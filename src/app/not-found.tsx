import { Bean, BeanDivider } from "@/components/brand/bean";
import { ButtonLink, TravelArrow } from "@/components/ui/button";

export default function NotFound() {
  return (
    <section className="wrap flex flex-col items-start gap-7 py-[clamp(72px,12vw,160px)]">
      <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
        <Bean className="w-[0.9em]" />
        404
      </span>
      <h1 className="t-display-l max-w-[20ch]">This page went cold.</h1>
      <p className="max-w-[48ch] text-[clamp(16px,2vw,19px)] leading-relaxed text-mocha">
        Whatever was here has been poured out. The shelf, the menu and the journal are all still
        where you left them.
      </p>
      <BeanDivider className="w-full max-w-80" />
      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/" size="lg" className="group">
          Back to the front
          <TravelArrow />
        </ButtonLink>
        <ButtonLink href="/menu" variant="secondary" size="lg">
          Café menu
        </ButtonLink>
      </div>
    </section>
  );
}
