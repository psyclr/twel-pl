import assert from 'node:assert/strict';
import { test } from 'node:test';
import { buildOwnerMail, createRateLimiter, parseInquiry } from './inquiry.mjs';

const valid = {
  name: 'Jan Kowalski, Sklep ABC',
  email: 'jan@example.pl',
  location: 'Witryna',
  product: 'Transparent LED',
  message: 'Witryna 3 x 2 m, od południa.',
  website: '',
};

test('a complete inquiry is accepted with trimmed fields', () => {
  const result = parseInquiry({ ...valid, name: '  Jan  ' });
  assert.deepEqual(result, {
    ok: true,
    inquiry: {
      name: 'Jan',
      email: 'jan@example.pl',
      location: 'Witryna',
      product: 'Transparent LED',
      message: 'Witryna 3 x 2 m, od południa.',
    },
  });
});

test('the installation place is optional', () => {
  const result = parseInquiry({ ...valid, location: '' });
  assert.equal(result.ok, true);
  assert.equal(result.inquiry.location, null);
});

test('missing or too long required fields are rejected', () => {
  assert.equal(parseInquiry({ ...valid, name: ' ' }).ok, false);
  assert.equal(parseInquiry({ ...valid, name: 'a'.repeat(121) }).ok, false);
  assert.equal(parseInquiry({ ...valid, message: '' }).ok, false);
  assert.equal(parseInquiry({ ...valid, message: 'a'.repeat(3001) }).ok, false);
  assert.equal(parseInquiry({ ...valid, email: `${'a'.repeat(150)}@example.pl` }).ok, false);
});

test('an email address that could inject a header is rejected', () => {
  assert.equal(parseInquiry({ ...valid, email: 'not-an-email' }).ok, false);
  assert.equal(parseInquiry({ ...valid, email: 'a@b.pl\r\nBcc: x@y.pl' }).ok, false);
});

test('values outside the form options are rejected', () => {
  assert.equal(parseInquiry({ ...valid, product: 'Telewizor' }).ok, false);
  assert.equal(parseInquiry({ ...valid, location: 'Dach' }).ok, false);
});

test('a filled honeypot field marks the inquiry as spam', () => {
  assert.deepEqual(parseInquiry({ ...valid, website: 'http://spam.example' }), { ok: false, error: 'spam' });
});

test('non-object input is rejected', () => {
  assert.equal(parseInquiry(null).ok, false);
  assert.equal(parseInquiry('text').ok, false);
});

test('the owner mail replies to the client and contains every field', () => {
  const { inquiry } = parseInquiry(valid);
  const mail = buildOwnerMail(inquiry);
  assert.equal(mail.replyTo, 'jan@example.pl');
  assert.equal(mail.subject, 'Zapytanie twel.pl: Jan Kowalski, Sklep ABC');
  assert.equal(
    mail.text,
    [
      'Nowe zapytanie ze strony twel.pl',
      '',
      'Imię i firma: Jan Kowalski, Sklep ABC',
      'E-mail: jan@example.pl',
      'Miejsce instalacji: Witryna',
      'Rozwiązanie: Transparent LED',
      '',
      'Opis projektu:',
      'Witryna 3 x 2 m, od południa.',
    ].join('\n'),
  );
});

test('a newline in the name does not reach the subject', () => {
  const { inquiry } = parseInquiry({ ...valid, name: 'Jan\nBcc: x@y.pl' });
  assert.equal(buildOwnerMail(inquiry).subject, 'Zapytanie twel.pl: Jan Bcc: x@y.pl');
});

test('the mail omits the installation place when it was not chosen', () => {
  const { inquiry } = parseInquiry({ ...valid, location: '' });
  assert.doesNotMatch(buildOwnerMail(inquiry).text, /Miejsce instalacji/);
});

test('the rate limiter allows 5 inquiries per IP in 10 minutes', () => {
  let now = 0;
  const allow = createRateLimiter({ limit: 5, windowMs: 600_000, now: () => now });
  for (let i = 0; i < 5; i += 1) assert.equal(allow('1.2.3.4'), true);
  assert.equal(allow('1.2.3.4'), false);
  assert.equal(allow('5.6.7.8'), true);
  now = 600_001;
  assert.equal(allow('1.2.3.4'), true);
});
