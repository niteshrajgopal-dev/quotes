/**
 * QOS-107 — EN/AR locale toggle placement outside header pill.
 *
 *   node scripts/verify-qos-107-locale-toggle.mjs
 */

const QUOTES = process.env.QUOTES_BASE_URL ?? "https://quotes.dev.qosapp.com";

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

async function fetchText(url, init) {
  const response = await fetch(url, init);
  const text = await response.text();
  return { response, text };
}

function navBarSlice(html) {
  const start = html.indexOf('data-nav-bar');
  if (start < 0) return "";
  const open = html.lastIndexOf("<", start);
  const close = html.indexOf("</nav>", start);
  return close > open ? html.slice(open, close) : "";
}

console.log("QOS-107 locale toggle placement validation");

{
  const { response, text } = await fetchText(`${QUOTES}/`);
  check(response.ok, `quotes / expected 200, got ${response.status}`);
  check(text.includes("data-locale-selector"), "locale selector marker missing from home HTML");
  check(
    text.includes("data-locale-selector-anchor"),
    "locale selector anchor missing (expected outside header pill)",
  );
  check(/English/i.test(text) && /Arabic|العربية/i.test(text), "EN/AR selector labels missing from home HTML");

  const navBar = navBarSlice(text);
  check(
    !navBar.includes("data-locale-selector"),
    "locale selector still rendered inside data-nav-bar pill",
  );
  console.log("  · home exposes EN/AR selector outside header pill");
}

{
  const { response, text } = await fetchText(`${QUOTES}/menu`);
  check(response.ok, `quotes /menu expected 200, got ${response.status}`);
  check(text.includes("data-locale-selector"), "locale selector marker missing from menu HTML");
  const navBar = navBarSlice(text);
  check(
    !navBar.includes("data-locale-selector"),
    "menu locale selector still inside data-nav-bar pill",
  );
  console.log("  · menu page keeps selector outside header pill");
}

{
  const { response, text } = await fetchText(`${QUOTES}/menu`, {
    headers: { Cookie: "quotes.locale=ar" },
  });
  check(response.ok, `quotes /menu (ar cookie) expected 200, got ${response.status}`);
  check(text.includes('dir="rtl"') || text.includes("dir=rtl"), "Arabic cookie did not set dir=rtl on html");
  check(text.includes("data-locale-selector-anchor"), "Arabic page missing locale selector anchor");
  console.log("  · Arabic RTL render keeps selector reachable");
}

if (failures.length > 0) {
  console.error("\nFailures:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("\nAll QOS-107 locale toggle placement checks passed.");
