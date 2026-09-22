/**
 * QOS-75 scoped slice — EN/AR selector + RTL plumbing evidence.
 *
 *   node scripts/verify-qos-75-locale.mjs
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

console.log("QOS-75 locale slice validation");

{
  const { response, text } = await fetchText(`${QUOTES}/menu`);
  check(response.ok, `quotes /menu expected 200, got ${response.status}`);
  check(/English/i.test(text) && /Arabic|العربية/i.test(text), "EN/AR selector labels missing from menu HTML");
  console.log("  · menu page exposes EN/AR selector labels");
}

{
  const { response, text } = await fetchText(`${QUOTES}/menu`, {
    headers: { Cookie: "quotes.locale=ar" },
  });
  check(response.ok, `quotes /menu (ar cookie) expected 200, got ${response.status}`);
  check(text.includes('dir="rtl"') || text.includes("dir=rtl"), "Arabic cookie did not set dir=rtl on html");
  check(text.includes('lang="ar"') || text.includes("lang=ar"), "Arabic cookie did not set lang=ar on html");
  console.log("  · Arabic cookie sets html lang/dir on server render");
}

{
  const { response, text } = await fetchText(`${QUOTES}/menu`, {
    headers: { Cookie: "quotes.locale=ar" },
  });
  const setCookie = response.headers.get("set-cookie") ?? "";
  check(
    setCookie.includes("quotes.locale=ar") || text.includes('dir="rtl"'),
    "Arabic locale did not persist via cookie or html dir",
  );
  console.log("  · Arabic locale request is RTL-capable");
}

if (failures.length > 0) {
  console.error("\nFailures:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("\nAll QOS-75 locale slice checks passed.");
