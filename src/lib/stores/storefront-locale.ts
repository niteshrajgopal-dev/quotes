"use client";

import { create } from "zustand";

import {
  readClientStorefrontLocale,
  writeClientStorefrontLocale,
  type StorefrontLocale,
} from "@/lib/locale/storefront-locale";

type StorefrontLocaleState = {
  locale: StorefrontLocale;
  hydrated: boolean;
  hydrate: (initialLocale?: StorefrontLocale) => void;
  setLocale: (locale: StorefrontLocale) => void;
};

export const useStorefrontLocale = create<StorefrontLocaleState>((set, get) => ({
  locale: "en",
  hydrated: false,

  hydrate: (initialLocale) => {
    if (get().hydrated) {
      return;
    }

    const locale =
      typeof document === "undefined"
        ? initialLocale ?? "en"
        : readClientStorefrontLocale();

    set({
      locale,
      hydrated: true,
    });
  },

  setLocale: (locale) => {
    writeClientStorefrontLocale(locale);
    set({ locale, hydrated: true });
  },
}));

export function selectStorefrontLocale(state: StorefrontLocaleState) {
  return state.locale;
}
