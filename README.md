# twel.pl

React + Vite. Две страницы: главная `/` и каталог `/katalog/`. Пререндер (`scripts/prerender.mjs`) добавляет в них canonical, Open Graph и JSON-LD и создаёт `sitemap.xml` и `robots.txt` из того же списка страниц.

## Запуск

Требуется Node.js 22.12 или новее.

```sh
npm ci
npm run dev
```

Откройте http://127.0.0.1:5173/.

## Сборка

```sh
npm run build
npm run preview
```

Готовые HTML-страницы и медиа находятся в `dist/`. Текст страниц доступен до загрузки JavaScript. Шрифты, изображения, видео и актуальный `TWEL_Katalog.pdf` хранятся в `public/`.

## Форма заявки

Форма отправляет `POST /api/zapytanie`. Сервис `server/` (Node, `nodemailer`) проверяет поля и отправляет письмо владельцам через Postal на сервере. В `Reply-To` стоит адрес клиента. Получатели, SMTP-учётка и отправитель задаются в `/etc/twel-pl/inquiry.env` на сервере (`INQUIRY_TO`, `SMTP_*`). Тесты: `cd server && npm test`.

## Сервер

Caddy отдаёт `/srv/twel/dist` для `twel.pl` и проксирует `/api/*` на `127.0.0.1:3420`. Там работает unit `twel-inquiry` (`server/twel-inquiry.service`). Обновление после пуша в `main`:

```sh
cd /srv/twel && git pull --ff-only && npm ci && npm run build && (cd server && npm ci --omit=dev) && systemctl restart twel-inquiry
```

## Проверка в браузере

Запустите локальный сайт. Для проверки в отдельном окружении установите Python Playwright и Chromium, затем выполните `python qa/check_pages.py`. По умолчанию скрипт проверяет сервер на порту 5173. Другой адрес задаётся через `TWEL_QA_URL`.
