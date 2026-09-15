"use client";

import Image from "next/image";

import { Bean, BeanDivider, BeanSpinner, BeanSprite } from "@/components/brand/bean";
import { useOptionalStorefrontShell } from "@/lib/stores/storefront-shell";

function RetailMarkSpinner({ className = "" }: { className?: string }) {
  const shell = useOptionalStorefrontShell();

  return (
    <span role="status" aria-label="Loading" className="inline-flex">
      <Image
        src={shell?.markSrc ?? "/tenants/retail/brand/flower-mark.svg"}
        alt=""
        width={24}
        height={24}
        aria-hidden
        className={`animate-bean-spin ${className}`}
      />
    </span>
  );
}

/** Tenant-aware loading mark — bean for Quotes, flower mark for Flowers. */
export function TenantMarkSpinner({ className = "" }: { className?: string }) {
  const shell = useOptionalStorefrontShell();
  const isHospitality = shell?.themePresetId === "hospitality_baseline";

  if (isHospitality || !shell) {
    return <BeanSpinner className={className} />;
  }

  return <RetailMarkSpinner className={className} />;
}

/** Inline tenant mark for headers and footers. */
export function TenantMark({
  className = "",
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const shell = useOptionalStorefrontShell();
  const isHospitality = shell?.themePresetId === "hospitality_baseline";

  if (isHospitality || !shell) {
    return <Bean className={className} onDark={onDark} />;
  }

  return (
    <Image
      src={shell.markSrc}
      alt=""
      width={24}
      height={24}
      aria-hidden
      className={className}
    />
  );
}

/** Hairline rule with the tenant mark at centre. */
export function TenantMarkDivider({ className = "" }: { className?: string }) {
  const shell = useOptionalStorefrontShell();
  const isHospitality = shell?.themePresetId === "hospitality_baseline";

  if (isHospitality || !shell) {
    return <BeanDivider className={className} />;
  }

  return (
    <div className={`flex items-center gap-3 ${className}`} aria-hidden="true">
      <span className="h-px flex-1 bg-line" />
      <TenantMark className="h-4 w-4" />
      <span className="h-px flex-1 bg-line" />
    </div>
  );
}

/** SVG sprite for hospitality bean mark only — retail uses raster marks. */
export function TenantBrandSprites() {
  const shell = useOptionalStorefrontShell();

  if (shell?.themePresetId !== "hospitality_baseline") {
    return null;
  }

  return <BeanSprite />;
}
