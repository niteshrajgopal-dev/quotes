import { storefrontMessage, type StorefrontMessageKey } from "@/lib/locale/messages";
import type { StorefrontLocale } from "@/lib/locale/storefront-locale";

type StatementLayout = {
  n: string;
  className: string;
  numClass: string;
  titleKey: StorefrontMessageKey;
  bodyKey: StorefrontMessageKey;
};

const DRINK_STATEMENT_LAYOUTS: StatementLayout[] = [
  {
    n: "1",
    titleKey: "homeDrinksStmt1Title",
    bodyKey: "homeDrinksStmt1Body",
    className: "left-0 top-[14%] text-left",
    numClass: "left-[-0.15em]",
  },
  {
    n: "2",
    titleKey: "homeDrinksStmt2Title",
    bodyKey: "homeDrinksStmt2Body",
    className: "right-0 top-[14%] text-right",
    numClass: "right-[-0.15em]",
  },
  {
    n: "3",
    titleKey: "homeDrinksStmt3Title",
    bodyKey: "homeDrinksStmt3Body",
    className: "left-0 top-[56%] text-left",
    numClass: "left-[-0.15em]",
  },
  {
    n: "4",
    titleKey: "homeDrinksStmt4Title",
    bodyKey: "homeDrinksStmt4Body",
    className: "right-0 top-[56%] text-right",
    numClass: "right-[-0.15em]",
  },
];

const ORIGIN_STEP_KEYS: Array<{ n: string; titleKey: StorefrontMessageKey; bodyKey: StorefrontMessageKey }> =
  [
    { n: "01", titleKey: "homeOriginStep1Title", bodyKey: "homeOriginStep1Body" },
    { n: "02", titleKey: "homeOriginStep2Title", bodyKey: "homeOriginStep2Body" },
    { n: "03", titleKey: "homeOriginStep3Title", bodyKey: "homeOriginStep3Body" },
  ];

const FEATURE_INGREDIENT_KEYS: StorefrontMessageKey[] = [
  "homeFeatureIng1",
  "homeFeatureIng2",
  "homeFeatureIng3",
  "homeFeatureIng4",
];

export function hospitalityDrinkStatements(locale: StorefrontLocale) {
  return DRINK_STATEMENT_LAYOUTS.map((layout) => ({
    n: layout.n,
    className: layout.className,
    numClass: layout.numClass,
    title: storefrontMessage(locale, layout.titleKey),
    body: storefrontMessage(locale, layout.bodyKey),
  }));
}

export function hospitalityOriginSteps(locale: StorefrontLocale) {
  return ORIGIN_STEP_KEYS.map((step) => [
    step.n,
    storefrontMessage(locale, step.titleKey),
    storefrontMessage(locale, step.bodyKey),
  ]);
}

export function hospitalityFeatureIngredients(locale: StorefrontLocale) {
  return FEATURE_INGREDIENT_KEYS.map((key) => storefrontMessage(locale, key));
}
