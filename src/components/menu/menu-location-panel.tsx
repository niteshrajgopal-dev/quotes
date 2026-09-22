"use client";

import { LocationSelector } from "@/components/location/location-selector";
import { storefrontMessage, storefrontMessageWithValues } from "@/lib/locale/messages";
import { useStorefrontLocale } from "@/lib/stores/storefront-locale";

type MenuLocationPanelProps = {
  selectedLocationPublicId: string;
  branchName: string;
  menuDisplayName: string;
};

export function MenuLocationPanel({
  selectedLocationPublicId,
  branchName,
  menuDisplayName,
}: MenuLocationPanelProps) {
  const locale = useStorefrontLocale((state) => state.locale);

  return (
    <div className="flex flex-col gap-4 rounded-md border border-line bg-surface p-5">
      <div className="flex flex-col gap-2">
        <p className="t-label">{storefrontMessage(locale, "branchMenu")}</p>
        <p className="text-[15px] text-mocha">
          {storefrontMessageWithValues(locale, "branchMenuShowing", {
            menu: menuDisplayName,
            branch: branchName,
          })}
        </p>
      </div>
      <LocationSelector selectedLocationPublicId={selectedLocationPublicId} />
    </div>
  );
}
