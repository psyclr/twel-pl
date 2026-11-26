import React from 'react';
import { Footer, Header, Icon } from '../components/Shared.jsx';
import { catalogPath } from '../data.js';
import { siteUrl } from '../site-paths.js';

const pdf = siteUrl(catalogPath);

// Summary of the product sections on pages 4–12 of TWEL_Katalog.pdf.
const categories = [
  {
    id: 'outdoor',
    title: 'Ekrany LED outdoor',
    description: 'Modułowa seria FS do fasad, nośników reklamowych i instalacji zewnętrznych.',
    specs: [
      ['Pixel pitch', 'P1.95, P2.604, P2.97, P3.91, P4.81, P5, P6'],
      ['Moduł LED', '250 × 250 mm'],
      ['Przykładowa kaseta', '500 × 1000 × 85 mm'],
    ],
    note: 'Parametry P5 i P6 oraz wymiary kaset potwierdzamy dla wybranej konfiguracji.',
    pages: [4],
  },
  {
    id: 'transparent',
    title: 'Transparent LED SMD',
    description: 'Ekrany z prześwitem do przeszkleń, przestrzeni handlowych i fasad.',
    specs: [
      ['Jasność indoor', '1000–4500 nitów'],
      ['Jasność outdoor', '5000–8000 nitów'],
    ],
    pages: [5, 6],
  },
  {
    id: 'folie-led',
    title: 'Folie LED',
    description: 'Przezroczyste listwy do przeszkleń i miejsc o ograniczonej przestrzeni montażowej.',
    specs: [
      ['Rozstaw pikseli', '10 wariantów od P4 do P40, w tym P4–8'],
      ['Format listwy', '240 × 1000 lub 240 × 1200 mm'],
    ],
    pages: [7],
  },
  {
    id: 'holographic',
    title: 'Holographic LED',
    description: 'Lekkie, półprzezroczyste powierzchnie do niestandardowych ekspozycji.',
    specs: [
      ['Pixel pitch', 'P3.9, P6.25, P10.42'],
      ['Długości listew', '1000, 1200 lub 1500 mm zależnie od wariantu'],
    ],
    pages: [8],
  },
  {
    id: 'postery',
    title: 'Postery LED indoor',
    description: 'Gotowe formaty do prezentacji reklam w sklepach, recepcjach i galeriach.',
    specs: [
      ['Formaty', '640 × 1920 i 1280 × 1920 mm'],
      ['Jasność', '800 nitów'],
      ['Pixel pitch', 'P1.25, P1.53, P1.86, P2, P2.5'],
    ],
    pages: [9, 10],
  },
  {
    id: 'witryny',
    title: 'Ekrany LED do witryn',
    description: 'Zestawy do witryn, punktów sprzedaży i obiektów usługowych.',
    specs: [
      ['Pixel pitch', 'P1.25, P1.53, P1.86, P2.0'],
      ['Przykładowe rozdzielczości', '720 × 480 i 745 × 1468 px'],
    ],
    pages: [11],
  },
  {
    id: 'monitory',
    title: 'Monitory reklamowe',
    description: 'Monitory do prezentacji menu, ofert i komunikatów w sklepach i restauracjach.',
    specs: [
      ['Przekątne', 'Od 32″ do 105″ zależnie od modelu'],
      ['Maksymalna rozdzielczość', 'Do 5120 × 2160 px zależnie od modelu'],
    ],
    note: 'Przy montażu sufitowym potwierdzamy możliwość podwieszenia i dobieramy uchwyt.',
    pages: [12],
  },
];

export default function Catalog() {
  return (
    <div className="site city catalog-page">
      <a className="skip-link" href="#main">Przejdź do treści</a>
      <Header onCatalog />
      <main id="main">
        <div className="container catalog-intro" id="top">
          <div>
            <h1>Katalog ekranów LED</h1>
            <p>Przegląd ekranów, folii LED i monitorów reklamowych. Sprawdź dostępne formaty i parametry.</p>
          </div>
          <div className="catalog-download">
            <div>
              <h2>Katalog produktowy TWEL</h2>
              <p>PDF · 12 stron · wersja polska</p>
            </div>
            <div className="catalog-download-actions">
              <a className="button" href={pdf} download>
                <Icon name="download" width="18" height="18" /> Pobierz PDF
              </a>
              <a className="catalog-download-preview" href={pdf} target="_blank" rel="noopener noreferrer">
                Otwórz PDF
              </a>
            </div>
          </div>
        </div>

        <div className="container catalog-directory">
          <nav className="catalog-index" aria-label="Kategorie katalogu">
            <h2>Kategorie</h2>
            <ul>
              {categories.map(({ id, title }) => (
                <li key={id}><a href={'#' + id}>{title}</a></li>
              ))}
            </ul>
          </nav>
          <div className="catalog-entries">
            {categories.map(({ id, title, description, specs, note, pages }) => (
              <section className="catalog-entry" id={id} key={id} aria-labelledby={id + '-title'}>
                <h2 id={id + '-title'}>{title}</h2>
                <p>{description}</p>
                <dl>
                  {specs.map(([label, value]) => (
                    <div key={label}>
                      <dt>{label}</dt>
                      <dd>{value}</dd>
                    </div>
                  ))}
                </dl>
                {note && <p className="catalog-entry-note">{note}</p>}
                <a className="catalog-entry-link" href={pdf + '#page=' + pages[0]} target="_blank" rel="noopener noreferrer">
                  <Icon name="file" width="16" height="16" />
                  Szczegóły w PDF · str. {pages.join('–')}
                </a>
              </section>
            ))}
          </div>
        </div>

        <section className="pdf-section section-pad">
          <div className="container catalog-quote">
            <div>
              <h2>Potrzebujesz dobrać ekran?</h2>
              <p>Opisz miejsce montażu i podaj przybliżone wymiary, a pomożemy wybrać parametry do wyceny.</p>
            </div>
            <a className="button" href={siteUrl('/#kontakt')}>Wyceń projekt</a>
          </div>
        </section>
      </main>
      <Footer onCatalog />
    </div>
  );
}
