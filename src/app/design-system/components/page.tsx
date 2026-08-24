"use client";

import { useState } from "react";
import { BeanDivider, BeanSpinner } from "@/components/brand/bean";
import { StampCard, StampProgress } from "@/components/brand/stamp-card";
import { Badge, Overline } from "@/components/ui/badge";
import { Button, IconButton, TravelArrow } from "@/components/ui/button";
import { Card, EmptyState, Notice, Skeleton } from "@/components/ui/card";
import {
  Checkbox,
  ChoiceGroup,
  QuantityStepper,
  SelectField,
  TextArea,
  TextField,
} from "@/components/ui/field";
import { Sheet } from "@/components/ui/sheet";
import { FilterRail, Segmented, Stepper } from "@/components/ui/tabs";
import { useToast } from "@/components/ui/toast";
import { Icon } from "@/components/brand/icons";
import { CoffeeCard } from "@/components/product/coffee-card";
import { DsBlock, DsCover, DsLabel, DsTopBar } from "@/components/system/ds-shell";
import { COFFEES } from "@/lib/catalog";

/**
 * The component library. Every specimen imports the same component the product
 * uses — this page documents the real library rather than restyled copies.
 */
export default function ComponentsPage() {
  const { toast } = useToast();

  const [sheetOpen, setSheetOpen] = useState(false);
  const [bottomSheetOpen, setBottomSheetOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [grind, setGrind] = useState("whole");
  const [plan, setPlan] = useState("one-off");
  const [rail, setRail] = useState("all");
  const [step, setStep] = useState(2);
  const [quantity, setQuantity] = useState(2);
  const [joinCard, setJoinCard] = useState(true);
  const [showError, setShowError] = useState(false);

  return (
    <>
      <DsTopBar current="/design-system/components" />

      <DsCover
        eyebrow="Components · v1.0"
        title={
          <>
            The parts,
            <br />
            and their states.
          </>
        }
        lede={
          <>
            Buttons, forms, cards, navigation, badges, toasts and loyalty — each with its default,
            hover, focus, pressed, disabled, loading, empty, error and success state. Everything
            here is imported live from the app, so the documentation cannot drift.
          </>
        }
        chips={["Buttons", "Forms", "Navigation", "Feedback", "Loyalty", "Product"]}
      />

      {/* ============ 01 · BUTTONS ============ */}
      <DsBlock
        id="buttons"
        no="01"
        title="Buttons"
        sub="Primary actions are espresso-solid, never latte. The accent stays rationed to the bean and one highlight."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Card>
            <DsLabel>Variants</DsLabel>
            <div className="flex flex-wrap items-center gap-3">
              <Button>Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="ghost">Ghost</Button>
              <Button variant="danger">Danger</Button>
            </div>

            <DsLabel className="mt-7">On espresso</DsLabel>
            <div className="flex flex-wrap items-center gap-3 rounded-sm bg-espresso p-4">
              <Button variant="inverse">Inverse</Button>
              <Button variant="inverse" className="group">
                With travel
                <TravelArrow className="text-latte" />
              </Button>
            </div>
          </Card>

          <Card>
            <DsLabel>Sizes · every one clears 44px</DsLabel>
            <div className="flex flex-wrap items-center gap-3">
              <Button size="sm">Small</Button>
              <Button size="md">Medium</Button>
              <Button size="lg">Large</Button>
            </div>

            <DsLabel className="mt-7">States</DsLabel>
            <div className="flex flex-wrap items-center gap-3">
              <Button disabled>Disabled</Button>
              <Button
                loading={loading}
                loadingLabel="Adding"
                onClick={() => {
                  setLoading(true);
                  window.setTimeout(() => {
                    setLoading(false);
                    toast({ title: "Ethiopia Yirgacheffe added", body: "250g · Whole bean" });
                  }, 1400);
                }}
              >
                Trigger loading
              </Button>
              <IconButton label="Search the menu">
                <Icon name="search" className="h-5 w-5" strokeWidth={1.7} />
              </IconButton>
            </div>
            <p className="t-caption mt-5">
              Hover shifts espresso to mocha over 260ms, pressed drops one pixel, and loading swaps
              the label for a spinning bean while setting{" "}
              <code className="font-mono">aria-busy</code>.
            </p>
          </Card>
        </div>
      </DsBlock>

      {/* ============ 02 · FORMS ============ */}
      <DsBlock
        id="forms"
        no="02"
        title="Forms & selection"
        sub="Labels stay visible, hints sit below, and errors replace the hint and are announced to assistive tech."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="flex flex-col gap-5">
            <DsLabel className="mb-0">Text inputs</DsLabel>
            <TextField label="Name" placeholder="The name on the cup" />
            <TextField
              label="Email"
              type="email"
              hint="We only use it for the receipt."
              defaultValue="hello@quotes.coffee"
            />
            <TextField
              label="Postcode"
              defaultValue="M4"
              error={showError ? "Enter a valid UK postcode." : undefined}
            />
            <SelectField label="Café" defaultValue="nq">
              <option value="nq">quotes Northern Quarter</option>
              <option value="an">quotes Ancoats</option>
              <option value="ch">quotes Chorlton</option>
            </SelectField>
            <TextArea label="Notes for the bar" optional hint="Allergies, or how you take it." />
            <TextField label="Gift message" defaultValue="Unavailable on this order" disabled />
            <Button variant="secondary" size="sm" onClick={() => setShowError((value) => !value)}>
              {showError ? "Clear the error" : "Show an error state"}
            </Button>
          </Card>

          <div className="flex flex-col gap-5">
            <Card className="flex flex-col gap-6">
              <ChoiceGroup
                legend="Grind"
                value={grind}
                onChange={setGrind}
                columns={2}
                options={[
                  { value: "whole", label: "Whole bean", hint: "Grind fresh at home" },
                  { value: "espresso", label: "Espresso", hint: "Fine · pressurised" },
                  { value: "filter", label: "Filter", hint: "Medium · V60, Chemex" },
                  { value: "moka", label: "Moka pot", hint: "Out of stock", disabled: true },
                ]}
              />
              <ChoiceGroup
                legend="Bag size"
                value="250g"
                onChange={() => {}}
                columns={3}
                options={[
                  { value: "250g", label: "250g", meta: "£16.50" },
                  { value: "500g", label: "500g", meta: "£30.53" },
                  { value: "1kg", label: "1kg", meta: "£56.10" },
                ]}
              />
            </Card>

            <Card className="flex flex-col gap-5">
              <DsLabel className="mb-0">Controls</DsLabel>
              <div className="flex flex-wrap items-center gap-6">
                <QuantityStepper value={quantity} onChange={setQuantity} />
                <QuantityStepper value={1} onChange={() => {}} min={1} max={1} />
              </div>
              <Checkbox
                label="Start a bean card"
                description="Collect stamps from this order."
                checked={joinCard}
                onChange={setJoinCard}
              />
              <Checkbox
                label="Gift wrapping"
                description="Unavailable for this destination."
                checked={false}
                onChange={() => {}}
                disabled
              />
            </Card>
          </div>
        </div>
      </DsBlock>

      {/* ============ 03 · NAVIGATION ============ */}
      <DsBlock
        id="navigation"
        no="03"
        title="Navigation & progress"
        sub="Rails scroll on a phone and wrap from tablet up. Segmented controls carry binary choices."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <Card className="flex flex-col gap-7">
            <div>
              <DsLabel>Filter rail</DsLabel>
              <FilterRail
                label="Roast level"
                value={rail}
                onChange={setRail}
                bleed={false}
                options={[
                  { value: "all", label: "All roasts", count: 6 },
                  { value: "light", label: "Light", count: 1 },
                  { value: "medium", label: "Medium", count: 2 },
                  { value: "dark", label: "Dark", count: 1 },
                ]}
              />
            </div>
            <div>
              <DsLabel>Segmented</DsLabel>
              <Segmented
                label="Purchase plan"
                value={plan}
                onChange={setPlan}
                options={[
                  { value: "one-off", label: "One-off", hint: "Buy once" },
                  { value: "subscribe", label: "Subscribe", hint: "Save up to 15%" },
                ]}
              />
            </div>
          </Card>

          <Card className="flex flex-col gap-7">
            <div>
              <DsLabel>Stepper</DsLabel>
              <Stepper
                steps={["Where", "Menu", "Bag", "Details", "Done"]}
                current={step}
                onStepSelect={setStep}
                bleed={false}
              />
              <div className="mt-4 flex gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setStep((value) => Math.max(0, value - 1))}
                >
                  Back
                </Button>
                <Button size="sm" onClick={() => setStep((value) => Math.min(4, value + 1))}>
                  Advance
                </Button>
              </div>
            </div>

            <BeanDivider />

            <div>
              <DsLabel>Sheets &amp; drawers</DsLabel>
              <div className="flex flex-wrap gap-3">
                <Button variant="secondary" size="sm" onClick={() => setSheetOpen(true)}>
                  Side sheet
                </Button>
                <Button variant="secondary" size="sm" onClick={() => setBottomSheetOpen(true)}>
                  Bottom sheet
                </Button>
              </div>
              <p className="t-caption mt-3">
                Focus is trapped while open, Escape closes, and focus returns to the trigger. Side
                sheets become bottom sheets below 640px.
              </p>
            </div>
          </Card>
        </div>
      </DsBlock>

      {/* ============ 04 · BADGES ============ */}
      <DsBlock
        id="badges"
        no="04"
        title="Badges & labels"
        sub="Mono, wide-tracked, uppercase. Status colour comes from the muted semantic set."
      >
        <Card>
          <DsLabel>Tones</DsLabel>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge>Neutral</Badge>
            <Badge tone="outline">Outline</Badge>
            <Badge tone="espresso">Espresso</Badge>
            <Badge tone="latte">Limited</Badge>
            <Badge tone="success">Ready</Badge>
            <Badge tone="warning">Low stock</Badge>
            <Badge tone="error">Sold out</Badge>
            <Badge tone="info">Decaf</Badge>
          </div>

          <DsLabel className="mt-7">With an icon</DsLabel>
          <div className="flex flex-wrap items-center gap-2.5">
            <Badge tone="neutral">
              <Icon name="location" className="h-3 w-3" strokeWidth={2} />
              Northern Quarter
            </Badge>
            <Badge tone="latte">
              <Icon name="cup" className="h-3 w-3" strokeWidth={2} />
              ~6 min
            </Badge>
          </div>

          <DsLabel className="mt-7">Overline</DsLabel>
          <Overline>Single origin</Overline>
        </Card>
      </DsBlock>

      {/* ============ 05 · FEEDBACK ============ */}
      <DsBlock
        id="feedback"
        no="05"
        title="Feedback & states"
        sub="Every module ships default, loading, empty, error and success. Nothing dead-ends."
      >
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="flex flex-col gap-5">
            <Card className="flex flex-col gap-3">
              <DsLabel className="mb-0">Notices</DsLabel>
              <Notice tone="info">£12.40 more for free delivery — the threshold is £30.00.</Notice>
              <Notice tone="success" title="quotes Ancoats.">
                Usually ready in about 4 minutes.
              </Notice>
              <Notice tone="warning" title="Sold out.">
                This lot has finished. We&apos;ll write when the next harvest lands.
              </Notice>
              <Notice tone="error" title="Payment declined.">
                Check the card number and try again.
              </Notice>
            </Card>

            <Card className="flex flex-col gap-4">
              <DsLabel className="mb-0">Toasts</DsLabel>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  onClick={() => toast({ title: "Flat white added", body: "Medium · Oat" })}
                >
                  Confirmation toast
                </Button>
                <Button
                  size="sm"
                  variant="secondary"
                  onClick={() =>
                    toast({
                      title: "Check the highlighted fields",
                      body: "2 fields need attention.",
                      tone: "error",
                    })
                  }
                >
                  Error toast
                </Button>
              </div>
            </Card>

            <Card className="flex flex-col gap-5">
              <DsLabel className="mb-0">Loading</DsLabel>
              <div className="flex items-center gap-3.5">
                <BeanSpinner className="w-5" />
                <span className="text-[13.5px] text-muted">Brewing…</span>
              </div>
              <div className="flex flex-col gap-2.5">
                <Skeleton className="h-4 w-2/5" />
                <Skeleton className="h-4 w-4/5" />
                <Skeleton className="h-4 w-3/5" />
              </div>
            </Card>
          </div>

          <EmptyState
            title="Nothing in the bag yet"
            body="Start with the Signature Blend, or pick something from the café menu."
            action={
              <div className="flex flex-wrap justify-center gap-2">
                <Button size="sm">Shop coffee</Button>
                <Button size="sm" variant="secondary">
                  Café menu
                </Button>
              </div>
            }
          />
        </div>
      </DsBlock>

      {/* ============ 06 · LOYALTY ============ */}
      <DsBlock
        id="loyalty"
        no="06"
        title="Loyalty module"
        sub="Domain-specific, not a generic progress bar: the bean itself is the stamp."
      >
        <div className="grid gap-5 lg:grid-cols-3">
          {[
            { stamps: 0, caption: "Empty · a fresh card" },
            { stamps: 5, caption: "In progress · 5 of 8" },
            { stamps: 8, caption: "Complete · reward ready" },
          ].map((state) => (
            <Card key={state.caption} className="flex flex-col gap-5">
              <DsLabel className="mb-0">{state.caption}</DsLabel>
              <StampCard stamps={state.stamps} size="md" />
              <StampProgress stamps={state.stamps} />
            </Card>
          ))}
        </div>
      </DsBlock>

      {/* ============ 07 · PRODUCT CARDS ============ */}
      <DsBlock
        id="product"
        no="07"
        title="Product cards"
        sub="Not generic cards: overline, roast, serif name, tasting notes, price and stock state."
      >
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {[COFFEES[0], COFFEES[2], COFFEES[5]].map((coffee) => (
            <CoffeeCard key={coffee.slug} coffee={coffee} />
          ))}
        </div>
        <p className="t-caption mt-5 max-w-[70ch]">
          Left to right: in stock, a low-stock limited lot, and a sold-out lot. Stock state changes
          the badge, the price line and the call to action, never the layout.
        </p>
      </DsBlock>

      <Sheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
        title="Side sheet"
        description="Slides from the right on desktop, up from the bottom on a phone."
        footer={
          <Button block onClick={() => setSheetOpen(false)}>
            Close
          </Button>
        }
      >
        <div className="flex flex-col gap-4">
          <p className="text-[14.5px] leading-relaxed text-mocha">
            This is the same component the bag drawer and the mobile navigation use. Try tabbing:
            focus cycles inside the panel and cannot escape behind the veil.
          </p>
          <TextField label="Focusable field" placeholder="Tab to me" />
          <Button variant="secondary">Another focus stop</Button>
        </div>
      </Sheet>

      <Sheet
        open={bottomSheetOpen}
        onClose={() => setBottomSheetOpen(false)}
        side="bottom"
        title="Bottom sheet"
        description="Used for drink customisation, where the thumb already is."
        footer={
          <Button block onClick={() => setBottomSheetOpen(false)}>
            Close
          </Button>
        }
      >
        <ChoiceGroup
          legend="Milk"
          value="oat"
          onChange={() => {}}
          columns={2}
          options={[
            { value: "whole", label: "Whole milk" },
            { value: "oat", label: "Oat", meta: "+£0.40" },
            { value: "almond", label: "Almond", meta: "+£0.40" },
            { value: "none", label: "No milk" },
          ]}
        />
      </Sheet>
    </>
  );
}
