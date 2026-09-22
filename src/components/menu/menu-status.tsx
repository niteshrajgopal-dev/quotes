"use client";

import { ButtonLink } from "@/components/ui/button";
import { EmptyState, Notice } from "@/components/ui/card";
import { storefrontMessage, storefrontMessageWithValues } from "@/lib/locale/messages";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";
import type { MenuLoadResult } from "@/lib/qos/menu-types";

export function MenuUnavailable({ result }: { result: MenuLoadResult }) {
  const locale = useStorefrontLocale((state) => state.locale);

  if (result.status === "ok") {
    return null;
  }

  return (
    <EmptyState
      title={storefrontMessage(locale, "menuUnavailableTitle")}
      body={result.error}
      action={
        <ButtonLink href="/locations" variant="secondary" size="sm">
          {storefrontMessage(locale, "viewLocations")}
        </ButtonLink>
      }
    />
  );
}

export function MenuContextNotice({
  branchName,
  menuDisplayName,
  releaseVersion,
  locale,
  currency,
}: {
  branchName: string;
  menuDisplayName: string;
  releaseVersion: number;
  locale: string;
  currency: string;
}) {
  const storefrontLocale = useStorefrontLocale((state) => state.locale);

  return (
    <Notice tone="info">
      {storefrontMessageWithValues(storefrontLocale, "branchMenuShowing", {
        menu: menuDisplayName,
        branch: branchName,
      })}{" "}
      · release {releaseVersion} · {locale.toUpperCase()} · {currency}
    </Notice>
  );
}
