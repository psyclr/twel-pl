import React, { useEffect, useRef, useState } from 'react';
import { Icon } from './Shared.jsx';
import { siteUrl } from '../site-paths.js';

const film = siteUrl('/media/twel-witryna.mp4');
const poster = siteUrl('/media/twel-witryna-poster.webp');

export default function StorefrontPreview() {
  const player = useRef(null);
  const [playing, setPlaying] = useState(false);
  const [failed, setFailed] = useState(false);
  const playbackLabel = playing ? 'Wstrzymaj wideo' : 'Odtwórz wideo';

  function play(video) {
    video.play().catch(() => setPlaying(false));
  }

  useEffect(() => {
    const video = player.current;
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');

    function syncMotionPreference() {
      if (preference.matches) video.pause();
      else play(video);
    }

    syncMotionPreference();
    preference.addEventListener('change', syncMotionPreference);
    return () => preference.removeEventListener('change', syncMotionPreference);
  }, []);

  function togglePlayback() {
    const video = player.current;
    if (video.paused) play(video);
    else video.pause();
  }

  return (
    <figure className="catalog-cover">
      <div className="storefront-window">
        <div className="storefront-layers">
          <img
            src={poster}
            width="1152"
            height="768"
            alt="Ekran LED w witrynie odtwarzający kampanię nowej kolekcji z logo twel.pl"
            fetchPriority="high"
          />
          <video
            className="storefront-video"
            ref={player}
            src={film}
            poster={poster}
            preload="none"
            muted
            loop
            playsInline
            hidden={failed}
            aria-hidden="true"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onError={() => setFailed(true)}
          />
        </div>
        {!failed && (
          <button
            className="storefront-toggle"
            type="button"
            aria-label={playbackLabel}
            title={playbackLabel}
            onClick={togglePlayback}
          >
            <Icon name={playing ? 'pause' : 'play'} strokeWidth="2" />
          </button>
        )}
      </div>
      <figcaption>Wizualizacja ekranu LED w witrynie</figcaption>
    </figure>
  );
}
