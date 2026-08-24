import type { Metadata } from "next";
import { Bean } from "@/components/brand/bean";
import { OrderFlow } from "@/components/order/order-flow";

export const metadata: Metadata = {
  title: "Order",
  description:
    "Order ahead for collection from a Manchester café, or have beans posted next-day.",
};

export default function OrderPage() {
  return (
    <section className="wrap pt-[clamp(32px,5vw,64px)] pb-[clamp(48px,7vw,88px)]">
      <header className="mb-8 flex flex-col gap-4">
        <span className="t-overline inline-flex items-center gap-2.5 tracking-[0.22em] text-muted">
          <Bean className="w-[0.9em]" />
          Order ahead
        </span>
        <h1 className="t-display-l max-w-[20ch]">Five steps, about a minute.</h1>
        <p className="max-w-[54ch] text-[clamp(16px,2vw,18px)] leading-[1.55] text-mocha">
          Choose a café, build the round, and it will be on the counter when you get there.
        </p>
      </header>

      <OrderFlow />
    </section>
  );
}
