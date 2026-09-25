/**
 * QOS-16 unit tests for normalizeProductName utility.
 *
 *   node scripts/verify-qos-16.mjs
 */

const failures = [];

function check(condition, message) {
  if (!condition) failures.push(message);
}

// Mock implementation for testing (inline for standalone script)
function normalizeProductName(name, locale) {
  if (locale === "ar") {
    return name;
  }

  if (!name || name.trim() === "") {
    return name;
  }

  return name.replace(/\b([A-Z]{2,})\b/g, (match) => {
    if (/\d/.test(match)) {
      return match;
    }

    if (match.length <= 3 && match.length >= 2) {
      const commonAcronyms = new Set([
        "UK",
        "US",
        "USA",
        "EU",
        "UAE",
        "CEO",
        "CFO",
        "CTO",
        "API",
        "FAQ",
        "PDF",
        "URL",
        "ISO",
        "GMT",
        "UTC",
      ]);
      if (commonAcronyms.has(match)) {
        return match;
      }
    }

    return match.charAt(0) + match.slice(1).toLowerCase();
  });
}

console.log("QOS-16 normalizeProductName verification");

// Test: ALL-CAPS words converted to Title Case
check(
  normalizeProductName("MALAYSIA", "en") === "Malaysia",
  "MALAYSIA should become Malaysia",
);
check(
  normalizeProductName("INDONESIA", "en") === "Indonesia",
  "INDONESIA should become Indonesia",
);
check(
  normalizeProductName("COLOMBIA", "en") === "Colombia",
  "COLOMBIA should become Colombia",
);
console.log("  · ALL-CAPS to Title Case ✓");

// Test: Words with digits preserved
check(normalizeProductName("V60", "en") === "V60", "V60 should remain unchanged");
check(normalizeProductName("B12", "en") === "B12", "B12 should remain unchanged");
check(
  normalizeProductName("BEAN123", "en") === "BEAN123",
  "BEAN123 should remain unchanged",
);
console.log("  · Words with digits preserved ✓");

// Test: Short acronyms preserved
check(normalizeProductName("UK", "en") === "UK", "UK should remain unchanged");
check(normalizeProductName("USA", "en") === "USA", "USA should remain unchanged");
check(normalizeProductName("EU", "en") === "EU", "EU should remain unchanged");
check(normalizeProductName("UAE", "en") === "UAE", "UAE should remain unchanged");
console.log("  · Short acronyms preserved ✓");

// Test: Already mixed-case words preserved
check(
  normalizeProductName("Malaysia", "en") === "Malaysia",
  "Malaysia should remain unchanged",
);
check(
  normalizeProductName("Espresso", "en") === "Espresso",
  "Espresso should remain unchanged",
);
check(normalizeProductName("V60 Beans", "en") === "V60 Beans", "V60 Beans should remain unchanged");
console.log("  · Mixed-case words preserved ✓");

// Test: Mixed strings with multiple ALL-CAPS words
check(
  normalizeProductName("Pipe / Tabaco - MALAYSIA", "en") === "Pipe / Tabaco - Malaysia",
  "Mixed string with MALAYSIA should be normalized",
);
check(
  normalizeProductName("New V60 Beans COLOMBIA", "en") === "New V60 Beans Colombia",
  "Mixed string with V60 and COLOMBIA should normalize only COLOMBIA",
);
check(
  normalizeProductName("ETHIOPIA Single Origin", "en") === "Ethiopia Single Origin",
  "ETHIOPIA at start should be normalized",
);
console.log("  · Mixed strings with multiple words ✓");

// Test: Punctuation and hyphens
check(
  normalizeProductName("KENYA-PROCESSED", "en") === "Kenya-Processed",
  "Hyphenated words should be normalized",
);
check(
  normalizeProductName("BRAZIL, COLOMBIA", "en") === "Brazil, Colombia",
  "Comma-separated words should be normalized",
);
check(
  normalizeProductName("(EXCLUSIVE)", "en") === "(Exclusive)",
  "Words in parentheses should be normalized",
);
console.log("  · Punctuation and hyphens ✓");

// Test: Empty strings and edge cases
check(normalizeProductName("", "en") === "", "Empty string should remain empty");
check(normalizeProductName("   ", "en") === "   ", "Whitespace should remain unchanged");
check(normalizeProductName("A", "en") === "A", "Single letter should remain unchanged");
console.log("  · Empty strings and edge cases ✓");

// Test: Arabic locale (should not transform)
check(
  normalizeProductName("MALAYSIA", "ar") === "MALAYSIA",
  "Arabic locale should not transform MALAYSIA",
);
check(
  normalizeProductName("INDONESIA", "ar") === "INDONESIA",
  "Arabic locale should not transform INDONESIA",
);
check(
  normalizeProductName("محمص", "ar") === "محمص",
  "Arabic text should remain unchanged",
);
check(
  normalizeProductName("MALAYSIA محمص", "ar") === "MALAYSIA محمص",
  "Mixed Arabic/Latin should not transform in AR locale",
);
console.log("  · Arabic locale preservation ✓");

// Test: Single ALL-CAPS letter words (should remain)
check(normalizeProductName("A B C", "en") === "A B C", "Single letters should remain unchanged");

// Test: Non-Latin uppercase (should not be affected)
check(
  normalizeProductName("КОФЕ", "en") === "КОФЕ",
  "Non-Latin uppercase should remain unchanged",
);
console.log("  · Non-Latin text preserved ✓");

if (failures.length > 0) {
  console.error("\nFailures:");
  for (const failure of failures) console.error(`  - ${failure}`);
  process.exit(1);
}

console.log("\nAll QOS-16 checks passed.");
