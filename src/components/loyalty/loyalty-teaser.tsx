"use client";

import { ButtonLink } from "@/components/ui/button";
import { StampCard } from "@/components/brand/stamp-card";
import { TravelArrow } from "@/components/ui/button";
import { useLoyalty, STAMPS_PER_CARD } from "@/lib/stores/loyalty";
import { useHydrated } from "@/lib/use-hydrated";

/** Compact bean-card module for the homepage. Reads live member state. */
export function LoyaltyTeaser() {
  const hydrated = useHydrated();
  const member = useLoyalty((state) => state.member);
  const stamps = useLoyalty((state) => state.stamps);
  const rewardsAvailable = useLoyalty((state) => state.rewardsAvailable);

  const isMember = hydrated && Boolean(member);
  const shown = isMember ? stamps : 5;
  const remaining = STAMPS_PER_CARD - shown;

  return (
    <div className="flex flex-col gap-7 rounded-lg border border-[var(--border-on-dark)] bg-mocha/40 p-7 sm:p-9">
      <div className="flex flex-col gap-2">
        <span className="t-overline text-latte">
          {isMember ? `Your card · ${member}` : "The bean card"}
        </span>
        <h3 className="t-h1 text-cream">
          {isMember
            ? remaining === 0
              ? "Card complete. Your coffee is on us."
              : `${remaining} more cup${remaining > 1 ? "s" : ""} to a free coffee.`
            : "Eight cups. One free coffee. No app required."}
        </h3>
      </div>

      <StampCard stamps={shown} size="lg" />

      <p className="max-w-[46ch] text-[14.5px] leading-relaxed text-cream/65">
        {isMember
          ? rewardsAvailable > 0
            ? `You have ${rewardsAvailable} reward${rewardsAvailable > 1 ? "s" : ""} waiting in your wallet.`
            : "Every drink and every bag earns a stamp, in café or online."
          : "A stamp for every drink and every bag of beans, in café or online. Rewards sit in your wallet until you want them."}
      </p>

      <div className="flex flex-wrap gap-3">
        <ButtonLink href="/loyalty" variant="inverse" size="md" className="group">
          {isMember ? "Open your card" : "Start a card"}
          <TravelArrow className="text-latte" />
        </ButtonLink>
        <ButtonLink href="/order" variant="inverse" size="md">
          Order and earn
        </ButtonLink>
      </div>
    </div>
  );
}
