import React, { useState } from 'react';
import {
  Contact, FAQ, Footer, Header, Monitor, CatalogSection,
} from '../components/Shared.jsx';
import StorefrontPreview from '../components/StorefrontPreview.jsx';
import { products } from '../data.js';
import { siteUrl } from '../site-paths.js';

const useCases = [
  {
    id: 'witryna',
    label: 'Witryna',
    title: 'Pokaż ofertę od strony ulicy',
    description: 'Wyświetlaj promocje i nowości przy wejściu. Jeśli chcesz zachować widok do wnętrza, zacznij od przezroczystego ekranu lub folii LED.',
    format: 'Transparent LED, folia LED lub poster',
    brief: 'Zdjęcie witryny, wymiary szyby i informacja, czy pada na nią bezpośrednie słońce.',
    image: '/images/signal.webp',
    alt: 'Dwa ekrany twel.pl przy wejściu do sklepu, z kwiatem i niebieską kompozycją',
  },
  {
    id: 'fasada',
    label: 'Fasada',
    title: 'Ekran widoczny z ulicy',
    description: 'Pokaż kampanię na elewacji lub przy wjeździe. Format, jasność i rozstaw pikseli dobieramy do odległości odbiorcy oraz warunków na zewnątrz.',
    format: 'Modułowy ekran LED outdoor',
    brief: 'Zdjęcie elewacji, dostępna powierzchnia i przybliżona odległość, z której będzie czytana reklama.',
    image: '/images/city.webp',
    alt: 'Narożny ekran LED twel.pl na miejskiej fasadzie i drugi ekran przy wejściu',
  },
  {
    id: 'wnetrze-event',
    label: 'Wnętrze i event',
    title: 'Zmieniaj treści razem z wydarzeniem',
    description: 'Pokaż program, menu lub prezentację tam, gdzie zatrzymują się goście. Poster sprawdzi się przy wejściu, a ekran na kołach można przenieść między strefami.',
    format: 'Poster LED, ekran mobilny lub monitor reklamowy',
    brief: 'Rodzaj treści, dostępne miejsce i informacja, czy ekran będzie przestawiany.',
    image: '/images/studio.webp',
    alt: 'Trzy postery LED twel.pl ustawione we wnętrzu, z różną grafiką na każdym ekranie',
  },
];

const specialistProducts = [
  {
    name: 'Folia LED',
    description: 'Przezroczyste listwy LED do witryn i przeszkleń.',
    image: '/images/led-film.jpg',
    width: 556,
    height: 347,
    alt: 'Elastyczna folia z niebieskimi punktami LED',
  },
  {
    name: 'Holographic LED',
    description: 'Lekkie, półprzezroczyste powierzchnie do niestandardowych ekspozycji.',
    image: '/images/led-holographic.png',
    width: 615,
    height: 410,
    alt: 'Ażurowe, elastyczne arkusze Holographic LED',
  },
  {
    name: 'Monitory podwieszane',
    description: 'Ekrany do menu, ofert i komunikatów. Możliwość montażu sufitowego sprawdzamy dla wybranego modelu.',
    image: '/images/monitor-podwieszany.webp',
    width: 900,
    height: 600,
    alt: 'Wizualizacja monitora podwieszonego nad ladą z logo twel.pl na ekranie',
  },
];

const services = [
  ['Dobór technologii', 'Dobieramy format, jasność i rozstaw pikseli do miejsca ekspozycji.'],
  ['Konstrukcje i montaż', 'Projektujemy konstrukcję oraz dobieramy mocowanie i sterowanie.'],
  ['Dostawa i serwis', 'Dostarczamy, konfigurujemy i uruchamiamy system. Zapewniamy obsługę serwisową.'],
];

const productNotes = {
  outdoor: 'Modułowa seria FS',
  transparent: 'Indoor i outdoor',
  mobile: 'Warianty na kołach i składane',
};

export default function City() {
  const [activeUseCase, setActiveUseCase] = useState(useCases[0]);
  const [quoteLocation, setQuoteLocation] = useState('');

  function selectUseCase(item) {
    setActiveUseCase(item);
    setQuoteLocation(item.label);
  }

  return (
    <div className="site city">
      <a className="skip-link" href="#main">Przejdź do treści</a>
      <Header />
      <main id="main">
        <section className="catalog-hero container" id="top">
          <div className="catalog-hero-copy">
            <h1>Ekrany LED do witryn, wnętrz i fasad</h1>
            <p className="catalog-lead">
              Wyświetlaj promocje, nowości i kampanie. Dobierzemy ekran i zajmiemy się montażem.
            </p>
            <div className="catalog-hero-actions">
              <a className="button" href="#kontakt">Wyceń projekt</a>
              <a className="catalog-hero-link" href="#zastosowania">Zastosowania</a>
            </div>
          </div>
          <StorefrontPreview />
        </section>

        <section className="catalog-applications" id="zastosowania">
          <div className="container">
            <div className="catalog-section-heading">
              <h2>Gdzie ma działać Twój ekran?</h2>
              <p>Wybierz miejsce, aby zobaczyć przykładowe zastosowanie i przygotować dane do wyceny.</p>
            </div>
            <fieldset className="application-choices">
              <legend className="application-legend">Miejsce instalacji</legend>
              {useCases.map((item) => (
                <label className="application-choice" key={item.id}>
                  <input
                    type="radio"
                    name="application-preview"
                    value={item.id}
                    checked={activeUseCase === item}
                    onChange={() => selectUseCase(item)}
                  />
                  <span>{item.label}</span>
                </label>
              ))}
            </fieldset>
            <article className="application-detail" aria-labelledby="application-title">
              <figure className="application-visual">
                <img
                  src={siteUrl(activeUseCase.image)}
                  alt={activeUseCase.alt}
                  width="1536"
                  height="1024"
                  loading="lazy"
                />
                <figcaption>Wizualizacja zastosowania</figcaption>
              </figure>
              <div className="application-copy">
                <h3 id="application-title">{activeUseCase.title}</h3>
                <p>{activeUseCase.description}</p>
                <dl>
                  <dt>Proponowany format</dt>
                  <dd>{activeUseCase.format}</dd>
                  <dt>Co przygotować do wyceny</dt>
                  <dd>{activeUseCase.brief}</dd>
                </dl>
                <a className="button" href="#kontakt" onClick={() => setQuoteLocation(activeUseCase.label)}>
                  Wyceń projekt
                </a>
              </div>
            </article>
          </div>
        </section>

        <section className="catalog-offer container section-pad" id="oferta">
          <div className="catalog-section-heading">
            <h2>Ekrany LED i monitory reklamowe</h2>
            <p>Dobierz ekran do fasady, witryny, wnętrza lub wydarzenia.</p>
          </div>
          <div className="catalog-products">
            {products.map((product) => (
              <article key={product.type} className="catalog-product">
                <div className="catalog-product-image">
                  <Monitor type={product.type} scene={product.scene} />
                </div>
                <h3>{product.name}</h3>
                {productNotes[product.type] && <p className="catalog-spec">{productNotes[product.type]}</p>}
                <p>{product.description}</p>
              </article>
            ))}
          </div>
          <div className="catalog-specialist">
            {specialistProducts.map(({ name, description, image, width, height, alt }) => (
              <article key={name}>
                <div className="catalog-specialist-media">
                  <img src={siteUrl(image)} alt={alt} width={width} height={height} loading="lazy" />
                </div>
                <h3>{name}</h3>
                <p>{description}</p>
              </article>
            ))}
          </div>
          <figure className="catalog-equipment">
            <div className="catalog-equipment-image">
              <img
                src={siteUrl('/images/catalog-poster.jpg')}
                width="724"
                height="543"
                alt="Mobilny poster LED, jego podstawa i skrzynia transportowa"
                loading="lazy"
              />
              <span className="catalog-screen-mark">twel.pl</span>
            </div>
            <figcaption>
              <h3>Mobilny poster LED ze skrzynią</h3>
              <p>Skrzynia ułatwia transport ekranu między lokalizacjami.</p>
            </figcaption>
          </figure>
        </section>

        <section className="catalog-services section-pad" aria-labelledby="catalog-service-title">
          <div className="container">
            <div className="catalog-section-heading">
              <h2 id="catalog-service-title">Od doboru ekranu po montaż</h2>
              <p>Rozwiązania do sklepów, restauracji, galerii handlowych i reklamy zewnętrznej.</p>
            </div>
            <div className="catalog-services-grid">
              {services.map(([name, description]) => (
                <article key={name}>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <CatalogSection />
        <FAQ />
        <Contact
          locations={useCases.map(({ label }) => label)}
          location={quoteLocation}
          onLocationChange={setQuoteLocation}
        />
      </main>
      <Footer />
    </div>
  );
}
