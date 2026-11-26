import { createServer } from 'node:http';
import nodemailer from 'nodemailer';
import { buildOwnerMail, createRateLimiter, parseInquiry } from './inquiry.mjs';

const MAX_BODY_BYTES = 16 * 1024;

function requireEnv(name) {
  const value = process.env[name];
  if (!value) throw new Error(`${name} is not set`);
  return value;
}

const config = {
  port: Number(process.env.PORT || 3420),
  from: requireEnv('SMTP_FROM'),
  to: requireEnv('INQUIRY_TO').split(',').map((address) => address.trim()),
};
const transport = nodemailer.createTransport({
  host: requireEnv('SMTP_HOST'),
  port: Number(requireEnv('SMTP_PORT')),
  secure: false,
  auth: { user: requireEnv('SMTP_USER'), pass: requireEnv('SMTP_PASS') },
});
const allow = createRateLimiter({ limit: 5, windowMs: 10 * 60 * 1000 });

function reply(res, status, body) {
  res.writeHead(status, { 'content-type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(body));
}

async function readJson(req) {
  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) return null;
    chunks.push(chunk);
  }
  try {
    return JSON.parse(Buffer.concat(chunks).toString('utf8'));
  } catch {
    return null;
  }
}

async function handleInquiry(req, res) {
  // Caddy is the only client and overwrites X-Forwarded-For with the visitor address.
  const ip = req.headers['x-forwarded-for'] || req.socket.remoteAddress;
  if (!allow(ip)) return reply(res, 429, { error: 'rate_limited' });
  const parsed = parseInquiry(await readJson(req));
  // A bot that filled the honeypot gets a success answer so it does not retry.
  if (!parsed.ok) return reply(res, parsed.error === 'spam' ? 200 : 400, parsed.error === 'spam' ? { ok: true } : { error: 'invalid' });
  try {
    await transport.sendMail({ from: config.from, to: config.to, ...buildOwnerMail(parsed.inquiry) });
  } catch (error) {
    console.error('inquiry mail failed', error);
    return reply(res, 502, { error: 'send_failed' });
  }
  console.info('inquiry sent', ip);
  return reply(res, 200, { ok: true });
}

createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/api/zapytanie') {
    handleInquiry(req, res).catch((error) => {
      console.error('inquiry handler failed', error);
      reply(res, 500, { error: 'internal' });
    });
    return;
  }
  reply(res, 404, { error: 'not_found' });
}).listen(config.port, '127.0.0.1', () => console.info(`twel inquiry listening on 127.0.0.1:${config.port}`));
