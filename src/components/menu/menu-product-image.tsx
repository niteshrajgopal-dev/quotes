"use client";

import Image from "next/image";
import { useState } from "react";
import { Bean } from "@/components/brand/bean";
import { qosPublicMediaUrl } from "@/lib/qos/media";
import { cn } from "@/lib/cn";

type MenuProductImageSize = "thumb" | "detail";

const SIZE_CLASSES: Record<MenuProductImageSize, string> = {
  thumb: "h-16 w-16",
  detail: "aspect-[3/4] w-full max-w-[220px]",
};

const BEAN_CLASSES: Record<MenuProductImageSize, string> = {
  thumb: "w-6",
  detail: "w-10",
};

export function MenuProductImage({
  mediaAssetId,
  alt,
  size = "thumb",
  className,
}: {
  mediaAssetId: string | null;
  alt: string;
  size?: MenuProductImageSize;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const src = qosPublicMediaUrl(mediaAssetId);
  const showPlaceholder = !src || failed;

  if (showPlaceholder) {
    return (
      <span
        className={cn(
          "grid shrink-0 place-items-center overflow-hidden rounded-sm border border-cream/15 bg-mocha/55",
          SIZE_CLASSES[size],
          className,
        )}
        aria-hidden
      >
        <Bean onDark className={BEAN_CLASSES[size]} />
      </span>
    );
  }

  return (
    <span
      className={cn(
        "relative shrink-0 overflow-hidden rounded-sm border border-cream/15 bg-mocha/55",
        SIZE_CLASSES[size],
        className,
      )}
    >
      <Image
        src={src}
        alt={alt}
        fill
        className="object-cover"
        sizes={size === "thumb" ? "64px" : "(max-width: 768px) 50vw, 220px"}
        onError={() => setFailed(true)}
      />
    </span>
  );
}
