/**
 * Café locations, used by the ordering flow's location step and the
 * locations surface referenced on the quotes link page.
 */

export type OpeningHours = {
  days: string;
  hours: string;
};

export type Location = {
  id: string;
  name: string;
  neighbourhood: string;
  address: string[];
  what3words: string;
  phone: string;
  hours: OpeningHours[];
  /** Minutes until a mobile order is ready, used by the order flow. */
  prepMinutes: number;
  services: Array<"Pickup" | "Delivery" | "Seating" | "Filter bar" | "Retail beans" | "Step-free">;
  note: string;
  busyFrom: string;
};

export const LOCATIONS: Location[] = [
  {
    id: "northern-quarter",
    name: "quotes Northern Quarter",
    neighbourhood: "Manchester",
    address: ["18 Tib Street", "Northern Quarter", "Manchester M4 1SH"],
    what3words: "///kettle.brew.linen",
    phone: "+44 161 000 0000",
    hours: [
      { days: "Mon – Fri", hours: "07:00 – 18:00" },
      { days: "Saturday", hours: "08:00 – 18:00" },
      { days: "Sunday", hours: "09:00 – 17:00" },
    ],
    prepMinutes: 6,
    services: ["Pickup", "Delivery", "Seating", "Filter bar", "Retail beans", "Step-free"],
    note: "The original site. Sixteen seats, one long window bench, no sockets in it.",
    busyFrom: "08:15",
  },
  {
    id: "ancoats",
    name: "quotes Ancoats",
    neighbourhood: "Manchester",
    address: ["4 Blossom Street", "Ancoats", "Manchester M4 6AJ"],
    what3words: "///paper.crema.stone",
    phone: "+44 161 000 0001",
    hours: [
      { days: "Mon – Fri", hours: "07:30 – 17:00" },
      { days: "Saturday", hours: "08:30 – 17:00" },
      { days: "Sunday", hours: "Closed" },
    ],
    prepMinutes: 4,
    services: ["Pickup", "Seating", "Filter bar", "Retail beans", "Step-free"],
    note: "Where the roaster lives. Cupping table open to the public on Fridays.",
    busyFrom: "12:30",
  },
  {
    id: "chorlton",
    name: "quotes Chorlton",
    neighbourhood: "Manchester",
    address: ["221 Wilbraham Road", "Chorlton", "Manchester M21 0UT"],
    what3words: "///bench.jasmine.oak",
    phone: "+44 161 000 0002",
    hours: [
      { days: "Mon – Fri", hours: "08:00 – 17:00" },
      { days: "Sat – Sun", hours: "08:30 – 17:30" },
    ],
    prepMinutes: 8,
    services: ["Pickup", "Delivery", "Seating", "Retail beans"],
    note: "The neighbourhood one. Prams, dogs and a bakery delivery at 07:45.",
    busyFrom: "10:00",
  },
];

export function getLocation(id: string): Location | undefined {
  return LOCATIONS.find((location) => location.id === id);
}
