import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render } from '../.prerender/prerender.js';
import { catalogRoute, company, siteOrigin } from '../src/data.js';

const root = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', root), 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Prerender placeholder missing');

const pages = [
  ['/', 'Ekrany LED do witryn, wnętrz i fasad — twel.pl', 'Ekrany LED do fasad, wnętrz i witryn, postery, folie i monitory reklamowe. Dobór technologii, projektowanie konstrukcji, dostawa i montaż.'],
  [catalogRoute, 'Katalog ekranów LED i monitorów reklamowych — twel.pl', 'Poznaj ekrany LED outdoor i transparentne, folie LED, postery, zestawy do witryn i monitory reklamowe. Sprawdź parametry i pobierz katalog TWEL w PDF.'],
];

const ogImage = { url: siteOrigin + '/images/og-twel.jpg', width: 1200, height: 630, alt: 'Ekran LED twel.pl w witrynie sklepu' };

const localBusiness = {
  '@context': 'https://schema.org',
  '@type': 'LocalBusiness',
  name: 'twel.pl',
  legalName: company.name,
  url: siteOrigin + '/',
  logo: siteOrigin + '/images/brand-parrot.png',
  image: ogImage.url,
  telephone: company.phone.replaceAll(' ', ''),
  taxID: company.registration.NIP,
  address: {
    '@type': 'PostalAddress',
    streetAddress: company.street,
    postalCode: company.postalCode,
    addressLocality: company.city,
    addressCountry: 'PL',
  },
};

function headTags(url) {
  // "<" is escaped so the JSON cannot close the script element.
  const jsonLd = JSON.stringify(localBusiness).replaceAll('<', '\\u003c');
  return [
    `<link rel="canonical" href="${url}" />`,
    `<meta property="og:url" content="${url}" />`,
    '<meta property="og:site_name" content="twel.pl" />',
    `<meta property="og:image" content="${ogImage.url}" />`,
    `<meta property="og:image:width" content="${ogImage.width}" />`,
    `<meta property="og:image:height" content="${ogImage.height}" />`,
    `<meta property="og:image:alt" content="${ogImage.alt}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<script type="application/ld+json">${jsonLd}</script>`,
  ].join('\n    ');
}

function pageHtml(path, title, description) {
  return template
    .replace('<!--app-html-->', render(path))
    .replace(/<title>.*?<\/title>/, '<title>' + title + '</title>')
    .replace(/(<meta name="description" content=")[^"]*(")/, '$1' + description + '$2')
    .replace(/(<meta property="og:title" content=")[^"]*(")/, '$1' + title + '$2')
    .replace(/(<meta property="og:description" content=")[^"]*(")/, '$1' + description + '$2')
    .replace('</head>', '  ' + headTags(siteOrigin + path) + '\n  </head>');
}

for (const [path, title, description] of pages) {
  const directory = new URL(path.slice(1), root);
  await mkdir(directory, { recursive: true });
  await writeFile(new URL('index.html', directory), pageHtml(path, title, description));
}

const sitemapUrls = pages.map(([path]) => `  <url><loc>${siteOrigin + path}</loc></url>`).join('\n');
await writeFile(new URL('sitemap.xml', root), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${sitemapUrls}\n</urlset>\n`);
await writeFile(new URL('robots.txt', root), `User-agent: *\nAllow: /\n\nSitemap: ${siteOrigin}/sitemap.xml\n`);

console.log('Prerendered the home page and the product catalog, with sitemap.xml and robots.txt.');
