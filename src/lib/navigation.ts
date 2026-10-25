/**
 * Whether a nav href matches the current location.
 * Query links such as `/products?category=men` only match that category.
 * Plain `/products` stays inactive while a category link is active.
 */
export function isNavLinkActive(href: string, pathname: string, search: string): boolean {
  const [path, query = ""] = href.split("?");
  if (path === "/") return pathname === "/";

  const expected = new URLSearchParams(query);
  const actual = new URLSearchParams(search.startsWith("?") ? search.slice(1) : search);
  const hasQuery = [...expected.keys()].length > 0;

  if (pathname !== path) {
    return !hasQuery && pathname.startsWith(`${path}/`);
  }

  if (!hasQuery) {
    if (path === "/products" && actual.get("category")) return false;
    return true;
  }

  for (const [key, value] of expected.entries()) {
    if (actual.get(key) !== value) return false;
  }
  return true;
}
