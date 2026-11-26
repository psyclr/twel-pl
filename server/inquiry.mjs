// The options and length limits match the quote form in the site bundle (assets/index-*.js).
const LOCATIONS = ['Witryna', 'Fasada', 'Wnętrze i event'];
const PRODUCTS = ['Ekran outdoor', 'Poster LED', 'Transparent LED', 'Ekran mobilny', 'Potrzebuję pomocy w wyborze'];
const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function text(value, maxLength) {
  if (typeof value !== 'string') return null;
  const trimmed = value.trim();
  return trimmed.length > 0 && trimmed.length <= maxLength ? trimmed : null;
}

function optionalLocation(value) {
  if (value === undefined || value === '') return { valid: true, location: null };
  return { valid: LOCATIONS.includes(value), location: value };
}

export function parseInquiry(body) {
  if (body === null || typeof body !== 'object') return { ok: false, error: 'invalid' };
  if (body.website) return { ok: false, error: 'spam' };
  const name = text(body.name, 120);
  const email = text(body.email, 160);
  const message = text(body.message, 3000);
  const { valid: locationValid, location } = optionalLocation(body.location);
  const product = PRODUCTS.includes(body.product) ? body.product : null;
  if (!name || !email || !EMAIL.test(email) || !message || !product || !locationValid) {
    return { ok: false, error: 'invalid' };
  }
  return { ok: true, inquiry: { name, email, location, product, message } };
}

export function buildOwnerMail(inquiry) {
  const lines = ['Nowe zapytanie ze strony twel.pl', '', `Imię i firma: ${inquiry.name}`, `E-mail: ${inquiry.email}`];
  if (inquiry.location) lines.push(`Miejsce instalacji: ${inquiry.location}`);
  lines.push(`Rozwiązanie: ${inquiry.product}`, '', 'Opis projektu:', inquiry.message);
  return {
    replyTo: inquiry.email,
    subject: `Zapytanie twel.pl: ${inquiry.name.replace(/\s+/g, ' ')}`,
    text: lines.join('\n'),
  };
}

export function createRateLimiter({ limit, windowMs, now = Date.now }) {
  const hits = new Map();
  return function allow(ip) {
    const since = now() - windowMs;
    const recent = (hits.get(ip) ?? []).filter((time) => time > since);
    if (recent.length >= limit) {
      hits.set(ip, recent);
      return false;
    }
    recent.push(now());
    hits.set(ip, recent);
    return true;
  };
}
