const base = import.meta.env.BASE_URL;

export function siteUrl(path) {
  return base + path.replace(/^\//, '');
}

export function routeFromUrl(pathname) {
  return pathname.startsWith(base) ? '/' + pathname.slice(base.length) : pathname;
}
