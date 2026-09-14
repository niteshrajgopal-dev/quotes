"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox, SelectField, TextArea, TextField } from "@/components/ui/field";
import { Notice } from "@/components/ui/card";
import { Segmented } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { computeTotals, useCart } from "@/lib/stores/cart";
import { useLoyalty } from "@/lib/stores/loyalty";
import { makeReference, useOrders, type PlacedOrder } from "@/lib/stores/orders";
import {
  getLocation,
  LOCATIONS,
} from "@/lib/fixtures/quotes-design-reference/locations";
import { formatPrice } from "@/lib/fixtures/quotes-design-reference/brand";

type PaymentMethod = "card" | "in-cafe";

type Errors = Partial<
  Record<
    "name" | "email" | "phone" | "address" | "postcode" | "card" | "expiry" | "cvc" | "slot",
    string
  >
>;

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const POSTCODE = /^[A-Z]{1,2}\d[A-Z\d]?\s?\d[A-Z]{2}$/i;

/** Fifteen-minute collection slots across the next two hours. */
function collectionSlots(prepMinutes: number): string[] {
  const slots: string[] = [];
  const start = new Date();
  start.setMinutes(start.getMinutes() + prepMinutes);
  start.setMinutes(Math.ceil(start.getMinutes() / 5) * 5, 0, 0);

  for (let index = 0; index < 9; index += 1) {
    const slot = new Date(start.getTime() + index * 15 * 60 * 1000);
    slots.push(
      slot.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }),
    );
  }
  return slots;
}

export function CheckoutForm({
  onPlaced,
}: {
  onPlaced: (order: PlacedOrder) => void;
}) {
  const { toast } = useToast();

  const lines = useCart((state) => state.lines);
  const fulfilment = useCart((state) => state.fulfilment);
  const setFulfilment = useCart((state) => state.setFulfilment);
  const locationId = useCart((state) => state.locationId);
  const setLocation = useCart((state) => state.setLocation);
  const promo = useCart((state) => state.promo);
  const clear = useCart((state) => state.clear);

  const member = useLoyalty((state) => state.member);
  const join = useLoyalty((state) => state.join);
  const addStamps = useLoyalty((state) => state.addStamps);
  const place = useOrders((state) => state.place);

  const totals = computeTotals({ lines, fulfilment, promo });
  const activeLocation = getLocation(locationId ?? LOCATIONS[0].id) ?? LOCATIONS[0];
  const slots = collectionSlots(activeLocation.prepMinutes);

  const [name, setName] = useState(member ?? "");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [postcode, setPostcode] = useState("");
  const [slot, setSlot] = useState(slots[0]);
  const [notes, setNotes] = useState("");
  const [payment, setPayment] = useState<PaymentMethod>("card");
  const [card, setCard] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [joinCard, setJoinCard] = useState(!member);
  const [errors, setErrors] = useState<Errors>({});
  const [submitting, setSubmitting] = useState(false);

  const validate = (): Errors => {
    const next: Errors = {};

    if (name.trim().length < 2) next.name = "We need a name for the cup.";
    if (!EMAIL.test(email.trim())) next.email = "Enter an email we can send the receipt to.";

    if (fulfilment === "pickup") {
      if (phone.replace(/\D/g, "").length < 10)
        next.phone = "A mobile number, so the bar can reach you.";
      if (!slot) next.slot = "Choose a collection time.";
    } else {
      if (address.trim().length < 6) next.address = "Enter a street address.";
      if (!POSTCODE.test(postcode.trim())) next.postcode = "Enter a valid UK postcode.";
    }

    if (payment === "card") {
      const digits = card.replace(/\s/g, "");
      if (!/^\d{16}$/.test(digits)) next.card = "A card number is 16 digits.";
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry.trim())) next.expiry = "Use MM/YY.";
      if (!/^\d{3,4}$/.test(cvc.trim())) next.cvc = "3 or 4 digits.";
    }

    return next;
  };

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const found = validate();
    setErrors(found);

    if (Object.keys(found).length > 0) {
      toast({
        title: "Check the highlighted fields",
        body: `${Object.keys(found).length} field${Object.keys(found).length === 1 ? "" : "s"} need attention.`,
        tone: "error",
      });
      return;
    }

    setSubmitting(true);

    // Stand-in for the payment and order-routing round trip.
    window.setTimeout(() => {
      const placedAt = new Date();
      const readyAt =
        fulfilment === "pickup"
          ? slot
          : new Date(placedAt.getTime() + 864e5).toLocaleDateString("en-GB", {
              weekday: "long",
              day: "numeric",
              month: "long",
            });

      const order: PlacedOrder = {
        reference: makeReference(),
        placedAt: placedAt.toISOString(),
        readyAt,
        fulfilment,
        locationId: fulfilment === "pickup" ? activeLocation.id : null,
        customerName: name.trim(),
        lines,
        total: totals.total,
        stampsEarned: totals.stampsEarned,
      };

      place(order);
      if (joinCard && !member) join(name);
      if (member || joinCard) addStamps(totals.stampsEarned, `Order ${order.reference}`);
      clear();
      setSubmitting(false);
      onPlaced(order);
    }, 900);
  };

  if (lines.length === 0) {
    return (
      <Notice tone="info" title="Your bag is empty.">
        Add a coffee or something from the café menu to check out.
      </Notice>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="flex flex-col gap-8">
      <fieldset className="flex flex-col gap-4">
        <legend className="t-label mb-1">How would you like it?</legend>
        <Segmented
          label="Fulfilment method"
          value={fulfilment}
          onChange={setFulfilment}
          options={[
            { value: "pickup", label: "Collect", hint: "Ready in minutes" },
            { value: "delivery", label: "Deliver", hint: "Next-day post" },
          ]}
        />
      </fieldset>

      {fulfilment === "pickup" ? (
        <fieldset className="flex flex-col gap-4">
          <legend className="t-label mb-1">Collection</legend>
          <SelectField
            label="Café"
            value={activeLocation.id}
            onChange={(event) => setLocation(event.target.value)}
          >
            {LOCATIONS.map((location) => (
              <option key={location.id} value={location.id}>
                {location.name} — {location.address[0]}
              </option>
            ))}
          </SelectField>
          <SelectField
            label="Collection time"
            value={slot}
            error={errors.slot}
            hint={`Usually ready in about ${activeLocation.prepMinutes} minutes.`}
            onChange={(event) => setSlot(event.target.value)}
          >
            {slots.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </SelectField>
        </fieldset>
      ) : (
        <fieldset className="flex flex-col gap-4">
          <legend className="t-label mb-1">Delivery address</legend>
          <TextArea
            label="Address"
            value={address}
            error={errors.address}
            autoComplete="street-address"
            placeholder={"18 Tib Street\nNorthern Quarter\nManchester"}
            onChange={(event) => setAddress(event.target.value)}
          />
          <TextField
            label="Postcode"
            value={postcode}
            error={errors.postcode}
            autoComplete="postal-code"
            inputMode="text"
            placeholder="M4 1SH"
            onChange={(event) => setPostcode(event.target.value)}
          />
          <Notice tone="info">
            Orders placed before 13:00 are roasted and posted the same day, tracked 24-hour.
          </Notice>
        </fieldset>
      )}

      <fieldset className="flex flex-col gap-4">
        <legend className="t-label mb-1">Your details</legend>
        <div className="grid gap-4 sm:grid-cols-2">
          <TextField
            label="Name"
            value={name}
            error={errors.name}
            autoComplete="name"
            onChange={(event) => setName(event.target.value)}
          />
          <TextField
            label="Email"
            type="email"
            value={email}
            error={errors.email}
            autoComplete="email"
            inputMode="email"
            onChange={(event) => setEmail(event.target.value)}
          />
        </div>
        {fulfilment === "pickup" ? (
          <TextField
            label="Mobile"
            type="tel"
            value={phone}
            error={errors.phone}
            autoComplete="tel"
            inputMode="tel"
            placeholder="07700 900000"
            onChange={(event) => setPhone(event.target.value)}
          />
        ) : null}
        <TextArea
          label="Notes for the bar"
          optional
          value={notes}
          hint="Allergies, a name for the cup, or how you take it."
          onChange={(event) => setNotes(event.target.value)}
        />
      </fieldset>

      <fieldset className="flex flex-col gap-4">
        <legend className="t-label mb-1">Payment</legend>
        <Segmented<PaymentMethod>
          label="Payment method"
          value={payment}
          onChange={setPayment}
          options={
            fulfilment === "pickup"
              ? [
                  { value: "card", label: "Card", hint: "Pay now" },
                  { value: "in-cafe", label: "In café", hint: "Pay on collection" },
                ]
              : [{ value: "card", label: "Card", hint: "Pay now" }]
          }
        />

        {payment === "card" ? (
          <div className="grid gap-4 sm:grid-cols-[2fr_1fr_1fr]">
            <TextField
              label="Card number"
              value={card}
              error={errors.card}
              autoComplete="cc-number"
              inputMode="numeric"
              placeholder="4242 4242 4242 4242"
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 16);
                setCard(digits.replace(/(.{4})/g, "$1 ").trim());
              }}
            />
            <TextField
              label="Expiry"
              value={expiry}
              error={errors.expiry}
              autoComplete="cc-exp"
              inputMode="numeric"
              placeholder="MM/YY"
              onChange={(event) => {
                const digits = event.target.value.replace(/\D/g, "").slice(0, 4);
                setExpiry(digits.length > 2 ? `${digits.slice(0, 2)}/${digits.slice(2)}` : digits);
              }}
            />
            <TextField
              label="CVC"
              value={cvc}
              error={errors.cvc}
              autoComplete="cc-csc"
              inputMode="numeric"
              placeholder="123"
              onChange={(event) => setCvc(event.target.value.replace(/\D/g, "").slice(0, 4))}
            />
          </div>
        ) : (
          <Notice tone="info">
            Pay at the till when you collect. We&apos;ll start making it at your chosen time.
          </Notice>
        )}
      </fieldset>

      {!member ? (
        <Checkbox
          label="Start a bean card"
          description={`Collect ${totals.stampsEarned} stamp${totals.stampsEarned === 1 ? "" : "s"} from this order.`}
          checked={joinCard}
          onChange={setJoinCard}
        />
      ) : null}

      <Button type="submit" size="lg" block loading={submitting} loadingLabel="Placing order">
        {payment === "in-cafe" ? "Place order" : `Pay ${formatPrice(totals.total)}`}
      </Button>

      <p className="t-caption text-center">
        By placing this order you agree to our terms. Card details are validated in the browser
        and never leave this device in this build.
      </p>
    </form>
  );
}
