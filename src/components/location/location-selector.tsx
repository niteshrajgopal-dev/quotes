"use client";

import { Icon } from "@/components/brand/icons";
import { cn } from "@/lib/cn";
import { useSelectStorefrontLocation } from "@/lib/storefront/use-select-storefront-location";
import { useStorefrontShell } from "@/lib/stores/storefront-shell";
import { useHydrated } from "@/lib/use-hydrated";

type LocationSelectorProps = {
  selectedLocationPublicId: string;
  compact?: boolean;
  className?: string;
};

export function LocationSelector({
  selectedLocationPublicId,
  compact = false,
  className,
}: LocationSelectorProps) {
  const shell = useStorefrontShell();
  const hydrated = useHydrated();
  const selectLocation = useSelectStorefrontLocation();

  if (!hydrated || shell.locations.length <= 1) {
    return null;
  }

  return (
    <div
      role="group"
      aria-label="Choose branch"
      className={cn(
        "flex flex-wrap gap-2",
        compact ? "text-[11px]" : "text-[12px]",
        className,
      )}
    >
      {shell.locations.map((location) => {
        const selected = location.locationPublicId === selectedLocationPublicId;
        return (
          <button
            key={location.locationPublicId}
            type="button"
            aria-pressed={selected}
            onClick={() => {
              void selectLocation(location.locationPublicId, selectedLocationPublicId);
            }}
            className={cn(
              "inline-flex min-h-9 items-center gap-2 rounded-full border px-3 font-medium transition-colors duration-fast ease-brand no-tap-highlight",
              selected
                ? "border-espresso bg-espresso text-cream"
                : "border-line bg-surface text-mocha hover:border-latte",
            )}
          >
            <Icon name="location" className="h-3.5 w-3.5" strokeWidth={2} />
            {location.name}
          </button>
        );
      })}
    </div>
  );
}
