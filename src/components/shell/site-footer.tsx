import Link from "next/link";
import { Bean, BeanDivider } from "@/components/brand/bean";
import { Icon } from "@/components/brand/icons";
import { BRAND, SOCIALS } from "@/lib/brand";
import { LOCATIONS } from "@/lib/locations";
import { PRIMARY_NAV, SECONDARY_NAV } from "./nav";

export function SiteFooter() {
  return (
    <footer className="mt-2 bg-espresso text-cream">
      <div className="wrap flex flex-col gap-12 py-[clamp(56px,8vw,96px)] pb-12">
        <div className="flex flex-col gap-6">
          <div className="flex items-center gap-3.5">
            <Bean onDark className="w-6" />
            <span className="font-serif text-[26px] text-cream">{BRAND.name}</span>
          </div>
          <p className="max-w-[20ch] font-serif text-[clamp(22px,3.4vw,34px)] leading-tight text-cream">
            {BRAND.statements.footer}
          </p>
        </div>

        <div className="grid gap-10 border-t border-[var(--border-on-dark)] pt-10 sm:grid-cols-2 lg:grid-cols-4">
          <nav aria-label="Footer — shop">
            <h2 className="t-overline mb-4 text-latte">Explore</h2>
            <ul className="flex flex-col gap-2.5">
              {PRIMARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-[14px] text-cream/70 transition-colors duration-fast ease-brand hover:text-cream"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label="Footer — cafés">
            <h2 className="t-overline mb-4 text-latte">Cafés</h2>
            <ul className="flex flex-col gap-3">
              {LOCATIONS.map((location) => (
                <li key={location.id}>
                  <Link
                    href={`/locations#${location.id}`}
                    className="group block text-[14px] text-cream/70 transition-colors duration-fast ease-brand hover:text-cream"
                  >
                    {location.name.replace("quotes ", "")}
                    <span className="mt-0.5 block font-mono text-[11px] tracking-[0.06em] text-cream/45">
                      {location.address[0]}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <h2 className="t-overline mb-4 text-latte">Follow &amp; connect</h2>
            <ul className="flex flex-col gap-2.5">
              {SOCIALS.map((social) => (
                <li key={social.label}>
                  <a
                    href={social.href}
                    className="group inline-flex items-baseline gap-2 text-[14px] text-cream/70 transition-colors duration-fast ease-brand hover:text-cream"
                    rel="noreferrer noopener"
                  >
                    {social.label}
                    <span className="font-mono text-[11px] tracking-[0.06em] text-cream/45">
                      {social.handle}
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h2 className="t-overline mb-4 text-latte">System</h2>
            <ul className="flex flex-col gap-2.5">
              {SECONDARY_NAV.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="group inline-flex items-center gap-2 text-[14px] text-cream/70 transition-colors duration-fast ease-brand hover:text-cream"
                  >
                    {item.label}
                    <Icon
                      name="arrow"
                      className="h-3.5 w-3.5 text-latte transition-transform duration-std ease-brand group-hover:translate-x-1"
                      strokeWidth={2}
                    />
                  </Link>
                </li>
              ))}
              <li>
                <Link
                  href="/design-system/foundations"
                  className="text-[14px] text-cream/70 transition-colors duration-fast ease-brand hover:text-cream"
                >
                  Foundations &amp; tokens
                </Link>
              </li>
              <li>
                <Link
                  href="/design-system/components"
                  className="text-[14px] text-cream/70 transition-colors duration-fast ease-brand hover:text-cream"
                >
                  Component library
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <BeanDivider className="[&::before]:bg-[var(--border-on-dark)] [&::after]:bg-[var(--border-on-dark)]" />

        <p className="font-mono text-[11px] leading-relaxed tracking-[0.08em] text-cream/50 uppercase">
          {BRAND.legalName} · warm · calm · crafted · distinctive · human · premium
        </p>
      </div>
    </footer>
  );
}
