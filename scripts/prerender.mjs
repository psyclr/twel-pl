import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { render } from '../.prerender/prerender.js';
import { catalogRoute } from '../src/data.js';

const root = new URL('../dist/', import.meta.url);
const template = await readFile(new URL('index.html', root), 'utf8');
if (!template.includes('<!--app-html-->')) throw new Error('Prerender placeholder missing');
const pages = [
 ...['/', '/city/'].map(path => [
  path,
  'Ekrany LED do witryn, wnętrz i fasad — twel.pl',
  'Ekrany LED do fasad, wnętrz i witryn, postery, folie i monitory reklamowe. Dobór technologii, projektowanie konstrukcji, dostawa i montaż.',
 ]),
 ['/studio/', 'Postery i ekrany LED do przestrzeni — twel.pl Studio', 'Postery LED, transparentne witryny i ekrany do wnętrz. Poznaj możliwości twel.pl i dobierz ekran do swojej przestrzeni.'],
 ['/signal/', 'Ekrany LED dla Twojego biznesu — twel.pl Signal', 'Pokaż swoją markę na ekranach LED. Poznaj postery, ekrany outdoor, transparent i mobile. Przygotuj zapytanie o projekt twel.pl.'],
 [catalogRoute, 'Katalog ekranów LED i monitorów reklamowych — twel.pl', 'Poznaj ekrany LED outdoor i transparentne, folie LED, postery, zestawy do witryn i monitory reklamowe. Sprawdź parametry i pobierz katalog TWEL w PDF.'],
];
for (const [path,title,description] of pages) {
 const directory = new URL(path.slice(1), root);
 await mkdir(directory, {recursive:true});
 const html=template.replace('<!--app-html-->',render(path)).replace(/<title>.*?<\/title>/, '<title>'+title+'</title>').replace(/(<meta name="description" content=")[^"]*(")/,'$1'+description+'$2').replace(/(<meta property="og:title" content=")[^"]*(")/,'$1'+title+'$2').replace(/(<meta property="og:description" content=")[^"]*(")/,'$1'+description+'$2');
 await writeFile(new URL('index.html',directory),html);
}
console.log('Prerendered the three landing concepts, the home page and the product catalog.');
