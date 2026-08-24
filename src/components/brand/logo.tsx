import Image from "next/image";
import Link from "next/link";

/**
 * The supplied wordmark is canonical: never redrawn, recoloured or
 * re-proportioned. Only its rendered height changes.
 * Minimum sizes from the logo foundation: wordmark 96px, bean mark 24px.
 */
const LOGO_SRC = "/brand/quotes-logo.png";
const LOGO_INTRINSIC = { width: 1536, height: 409 };
const MIN_WORDMARK_WIDTH = 96;

export function Wordmark({
  height = 26,
  className = "",
  priority = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  const width = Math.round((LOGO_INTRINSIC.width / LOGO_INTRINSIC.height) * height);

  if (width < MIN_WORDMARK_WIDTH) {
    throw new Error(
      `Wordmark rendered at ${width}px, below the ${MIN_WORDMARK_WIDTH}px minimum. Use the bean mark instead.`,
    );
  }

  return (
    <Image
      src={LOGO_SRC}
      alt="quotes"
      width={width}
      height={height}
      priority={priority}
      className={className}
      style={{ height, width: "auto" }}
      sizes={`${width}px`}
    />
  );
}

export function LogoLink({
  height = 26,
  className = "",
  priority = false,
}: {
  height?: number;
  className?: string;
  priority?: boolean;
}) {
  return (
    <Link
      href="/"
      aria-label="quotes — home"
      className={`inline-flex items-center no-tap-highlight ${className}`}
    >
      <Wordmark height={height} priority={priority} />
    </Link>
  );
}
