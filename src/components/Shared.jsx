import React, { useState } from 'react';
import { catalogRoute, company, questions } from '../data.js';
import { siteUrl } from '../site-paths.js';

const phoneLink = 'tel:' + company.phone.replaceAll(' ', '');

export function Icon({name='plus', ...props}) {
  const paths = {plus:'M12 5v14M5 12h14',download:'M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5',check:'m5 12 4 4L19 6',file:'M14 2H6v20h12V6l-4-4Zm0 0v5h5M9 12h6M9 16h6',play:'m8 5 12 7-12 7V5Z',pause:'M9 5v14M15 5v14'};
  return <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...props}><path d={paths[name] || paths.plus}/></svg>;
}
export function Brand({ footer = false, href = '#top' }) {
  return <a className={'brand'+(footer?' brand-footer':'')} href={href} aria-label="twel.pl, strona główna"><span className="brand-parrot" aria-hidden="true"><img src={siteUrl('/images/brand-parrot.png')} alt="" width="816" height="816"/></span><span>twel.pl</span></a>;
}
export function Header({ onCatalog = false }) {
  return (
    <header className="site-header">
      <div className="container header-inner">
        <Brand href={onCatalog ? siteUrl('/') : '#top'} />
        <nav className="main-nav" aria-label="Nawigacja główna">
          <a href={onCatalog ? siteUrl('/#oferta') : '#oferta'}>Ekrany LED</a>
          <a href={siteUrl(catalogRoute)} aria-current={onCatalog ? 'page' : undefined}>Katalog</a>
        </nav>
      </div>
    </header>
  );
}
export function Monitor({type='poster',scene='bloom',className=''}) {
 return <div className={'monitor-scene '+type+' '+className} role="img" aria-label={'Wizualizacja ekranu LED twel.pl: '+({bloom:'pomarańczowy kwiat',ocean:'niebieska fala',sun:'słoneczna kompozycja',parrot:'tropikalne kolory'}[scene])}>
   <div className={'monitor-panel scene-'+scene}><div className="screen-art" aria-hidden="true"><i/><b/><em/></div><div className="screen-brand">twel.pl</div><span className="screen-caption">{scene==='ocean'?'Make waves.':scene==='sun'?'Hello, sunshine.':scene==='bloom'?'Rozkwitnij.':'Be seen.'}</span></div><div className="monitor-base"/><div className="monitor-shadow"/>
 </div>;
}
export function CatalogSection() {
  return (
    <section id="katalog" className="pdf-section section-pad" aria-labelledby="catalog-title">
      <div className="container catalog-layout">
        <div>
          <h2 id="catalog-title">Katalog</h2>
          <p>Modele ekranów, dostępne formaty i parametry techniczne.</p>
        </div>
        <a className="catalog-link" href={siteUrl(catalogRoute)}>
          <Icon name="file" width="28" height="28" />
          <div>
            <strong>Przejdź do katalogu</strong>
            <span>Przegląd produktów i katalog PDF</span>
          </div>
        </a>
      </div>
    </section>
  );
}
export function FAQ() {
 return <section className="faq-section section-pad"><div className="container faq-layout"><div><p className="eyebrow">Dobrze wiedzieć</p><h2>Zanim włączysz<br/>pierwszy ekran.</h2></div><div className="faq-list">{questions.map(([q,a])=><details key={q}><summary>{q}<Icon/></summary><p>{a}</p></details>)}</div></div></section>;
}
export function Contact({ locations, location, onLocationChange }) {
  const [ready, setReady] = useState(false);

  function saveBrief(event) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const lines = [
      'Zapytanie o projekt twel.pl',
      '',
      'Imię i firma: ' + data.get('name'),
      'E-mail: ' + data.get('email'),
    ];

    if (data.get('location')) lines.push('Miejsce instalacji: ' + data.get('location'));
    lines.push('Rozwiązanie: ' + data.get('product'), 'Opis projektu: ' + data.get('message'));

    const url = URL.createObjectURL(new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' }));
    const link = document.createElement('a');
    link.href = url;
    link.download = 'twel-zapytanie.txt';
    link.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setReady(true);
  }

  return (
    <section className="contact-section section-pad" id="kontakt">
      <div className="container contact-layout">
        <div className="contact-copy">
          <p className="eyebrow">Porozmawiajmy o Twoim miejscu</p>
          <h2>Twój pomysł.<br />Nasz wspólny<br />punkt wyjścia.</h2>
          <p>Opisz, gdzie potrzebujesz ekranu i co chcesz wyświetlać.</p>
          <div className="contact-prompt">
            <Icon name="check" />
            <span>Wystarczy miejsce, przybliżony wymiar i pomysł.</span>
          </div>
          <div className="contact-phone">
            <p>Kontakt telefoniczny · {company.contactName}</p>
            <a href={phoneLink}>{company.phone}</a>
          </div>
        </div>
        <form className="quote-form" onSubmit={saveBrief} onChange={() => setReady(false)}>
          <h3>Przygotuj zapytanie</h3>
          <div className="form-row">
            <label>
              Imię i firma
              <input name="name" autoComplete="organization" placeholder="Jak się nazywasz?" required maxLength={120} />
            </label>
            <label>
              <span id="quote-email-label">E-mail</span>
              <input type="email" name="email" autoComplete="email" aria-labelledby="quote-email-label" aria-describedby="quote-email-help" placeholder="twoj@email.pl" required maxLength={160} />
              <span id="quote-email-help" className="field-help">Na ten adres otrzymasz wycenę.</span>
            </label>
          </div>
          {locations && (
            <label>
              Miejsce instalacji
              <select name="location" value={location} onChange={(event) => onLocationChange(event.target.value)}>
                <option value="">Wybierz miejsce</option>
                {locations.map((item) => <option key={item}>{item}</option>)}
              </select>
            </label>
          )}
          <label>
            Co Cię interesuje?
            <select name="product" defaultValue="">
              <option value="" disabled>Wybierz rozwiązanie</option>
              <option>Ekran outdoor</option>
              <option>Poster LED</option>
              <option>Transparent LED</option>
              <option>Ekran mobilny</option>
              <option>Potrzebuję pomocy w wyborze</option>
            </select>
          </label>
          <label>
            Opowiedz o projekcie
            <textarea name="message" rows="3" placeholder="Gdzie stanie ekran? Jaki format planujesz?" required maxLength={3000} />
          </label>
          <button className="button" type="submit">Zapisz zapytanie <Icon name="download" /></button>
          <p className="form-note">W podglądzie możesz zapisać zapytanie jako plik tekstowy. Wysyłka jest jeszcze niedostępna.</p>
          <p className="form-status" role="status">{ready ? 'Plik przygotowany. Twoje dane nie zostały wysłane.' : ''}</p>
        </form>
      </div>
    </section>
  );
}
export function Footer({ onCatalog = false }) {
  return (
    <footer className="site-footer">
      <div className="container footer-main">
        <Brand footer href={onCatalog ? siteUrl('/') : '#top'} />
        <a href="#top">Wróć na górę</a>
      </div>
      <div className="container footer-details">
        <address>
          <strong>{company.name}</strong>
          <span>{company.street}</span>
          <span>{company.locality}</span>
        </address>
        <dl className="footer-registration">
          {Object.entries(company.registration).map(([label, value]) => (
            <div key={label}><dt>{label}</dt><dd>{value}</dd></div>
          ))}
        </dl>
        <div className="footer-phone">
          <strong>Kontakt · {company.contactName}</strong>
          <a href={phoneLink}>{company.phone}</a>
        </div>
      </div>
      <div className="container footer-bottom">
        <span>© 2026 twel.pl</span>
        <span>Wizualizacje przedstawiają koncepcje zastosowań.</span>
      </div>
    </footer>
  );
}
export function Process({title='Od miejsca do obrazu.'}) {
 return <section className="process-section section-pad"><div className="container"><div className="section-head"><div><p className="eyebrow">Dobry ekran zaczyna się od rozmowy</p><h2>{title}</h2></div><p>Dobór rozwiązania zaczyna się od tego,<br/>co chcesz osiągnąć w swojej przestrzeni.</p></div><div className="process-grid">{[['01','Pokaż nam miejsce','Witryna, ściana lub otwarta przestrzeń. Zdjęcie i wymiary pomogą określić punkt wyjścia.'],['02','Dobierzmy ekran','Format, odległość odbiorcy i światło. To one pomagają wybrać właściwe rozwiązanie.'],['03','Zaplanujmy efekt','Ustalmy konfigurację i treści, które chcesz pokazać swoim odbiorcom.']].map(([n,t,d])=><article key={n}><span className="step-number">{n}</span><h3>{t}</h3><p>{d}</p></article>)}</div></div></section>;
}
