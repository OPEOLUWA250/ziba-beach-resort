/**
 * Room catalogue: the single source of truth for room facts shown on the site
 * (room list, room detail pages, footer, admin labels).
 *
 * Facts are taken from each room's own page on zibabeachresort.com
 * (checked 2026-10-24). Live rates and availability come from IPMS
 * (see lib/booking-links.ts); `priceFrom` is only the "from" rate shown
 * before the guest opens the booking engine, and the admin-set price in the
 * rooms table overrides it when present.
 */

export interface RoomCatalogEntry {
  id: string;
  number: string;
  name: string;
  /** Short label for compact cards, e.g. "19m²" or "Two-level loft". */
  size: string;
  capacity: string;
  bedding: string;
  view: string;
  priceFrom: number;
  description: string;
  features: string[];
  amenities: string[];
  /** Restrictions or notes guests must see before booking. */
  notes?: string[];
}

const CORE_AMENITIES = [
  "Air Conditioning (individually controlled)",
  "Bath Amenities",
  "Water Heater",
  "Bathrobes",
  "Bathroom with Shower",
  "Pool Towels",
  "Room Service",
  "Hairdryer",
  "Non-smoking Room",
];

const NO_CHILDREN_UNDER_10 = "Children under 10 are not permitted in this room.";

export const ROOM_CATALOG: Record<string, RoomCatalogEntry> = {
  room01: {
    id: "room01",
    number: "01",
    name: "Beach Facing Room",
    size: "19m²",
    capacity: "Up to 3 guests: 2 adults or 2 adults and a child",
    bedding: "1 King size bed",
    view: "Balcony with partial pool view overlooking the beach",
    priceFrom: 202000,
    description:
      "A bright, airy room with large windows and a private balcony overlooking the Atlantic, finished with modern furnishings and soft coastal tones for a restful stay.",
    features: [
      "Private balcony with partial pool view overlooking the beach",
      "Large windows with ocean views",
      "Restful sleeping area with space to unwind",
    ],
    amenities: [
      "King-size Bed",
      ...CORE_AMENITIES,
      "Flat Screen Cable TV (Netflix, YouTube, Amazon Prime)",
      "Private Balcony",
      "Mini Fridge",
    ],
  },
  room02: {
    // Not currently listed on zibabeachresort.com; details mirror the
    // Full View family room except the view. Confirm with the resort.
    id: "room02",
    number: "02",
    name: "Beach Facing Family Room (Partial View)",
    size: "26m²",
    capacity: "Up to 6 guests: 4 adults or 2 adults and up to 4 children",
    bedding: "1 King size bed and 1 bunk bed with a pull-out bed",
    view: "Balcony with partial pool view overlooking the beach",
    priceFrom: 225000,
    description:
      "Spacious family accommodation with flexible sleeping arrangements and a balcony overlooking the beach.",
    features: [
      "Balcony with partial pool view overlooking the beach",
      "Bunk bed with additional pull-out bed",
      "Room for the whole family",
    ],
    amenities: [
      "King-size Bed",
      "Bunk Bed with additional pull-out bed",
      ...CORE_AMENITIES,
      "Flat Screen Cable TV (Netflix, YouTube, Amazon Prime)",
      "Private Balcony",
      "Mini Fridge",
    ],
  },
  room03: {
    id: "room03",
    number: "03",
    name: "Beach Facing Family Room (Full View)",
    size: "26m²",
    capacity: "Up to 7 guests: 4 adults or 2 adults and up to 5 children",
    bedding: "1 King size bed and 1 bunk bed with a pull-out bed",
    view: "Balcony with pool view overlooking the beach",
    priceFrom: 247500,
    description:
      "A family room designed for togetherness, with a balcony looking out over the pool and the beach.",
    features: [
      "Balcony with full pool view overlooking the beach",
      "Bunk bed with additional pull-out bed",
      "Designed for families",
    ],
    amenities: [
      "King-size Bed",
      "Bunk Bed with additional pull-out bed",
      ...CORE_AMENITIES,
      "Flat Screen Cable TV (Netflix, YouTube, Amazon Prime)",
      "Private Balcony",
      "Mini Fridge",
    ],
  },
  room04: {
    id: "room04",
    number: "04",
    name: "Beach Facing Connecting Room",
    size: "32m²",
    capacity: "Up to 3 guests: 2 adults or 2 adults and a child",
    bedding: "1 King size bed or twin beds",
    view: "Balcony with pool view overlooking the beach",
    priceFrom: 202500,
    description:
      "A simple beachfront room for individuals or families who want to stay close together — one of a pair of connecting rooms.",
    features: [
      "Balcony with pool view overlooking the beach",
      "Connects to a second room",
      "King or twin bed configuration",
    ],
    amenities: [
      "King-size or Twin Beds",
      ...CORE_AMENITIES,
      "Flat Screen Cable TV (Netflix, YouTube, Amazon Prime)",
      "Private Balcony",
    ],
    notes: [
      "Rooms are sold individually — book two units to use both connecting rooms.",
      "This room has no fridge.",
    ],
  },
  room05: {
    id: "room05",
    number: "05",
    name: "Beach Facing Suite",
    size: "Bedroom + living room",
    capacity: "1 King bed + 1 sofa bed — ask us about occupancy",
    bedding: "1 King size bed and 1 sofa bed",
    view: "Private balcony with a full view of the beach",
    priceFrom: 231750,
    description:
      "A beachfront suite with a separate bedroom, a living room and a private balcony overlooking the sea.",
    features: [
      "Separate bedroom and living room",
      "Private balcony with full beach view",
      "Sofa bed for an extra guest",
    ],
    amenities: [
      "King-size Bed",
      "Sofa Bed",
      ...CORE_AMENITIES,
      "2 Flat Screen Cable TVs (Netflix, YouTube, Amazon Prime)",
      "Private Balcony",
      "Mini Fridge",
    ],
  },
  room06: {
    id: "room06",
    number: "06",
    name: "Two Bedroom Apartment",
    size: "2 bedrooms + open-plan living",
    capacity: "Up to 6 guests",
    bedding: "2 King size beds and 1 sofa bed",
    view: "Private pool",
    priceFrom: 450000,
    description:
      "A roomy two-bedroom apartment with its own private pool and an open-plan living area, built for privacy and relaxation close to the beach.",
    features: [
      "Private pool",
      "Open-plan living area",
      "Two en-suite bedrooms",
    ],
    amenities: [
      "2 King-size Beds",
      "Sofa Bed",
      "All Rooms En-suite",
      ...CORE_AMENITIES,
      "3 Flat Screen Cable TVs (Netflix, YouTube, Amazon Prime)",
      "Private Pool",
      "Mini Fridge",
    ],
  },
  room07: {
    id: "room07",
    number: "07",
    name: "Overwater Terrace Room",
    size: "24m²",
    capacity: "Up to 2 guests",
    bedding: "1 King size bed",
    view: "Direct access to the overwater pool",
    priceFrom: 213750,
    description:
      "A modern overwater room with direct pool access and a poolside daybed — made for slow, relaxed stays.",
    features: [
      "Direct access to the overwater pool",
      "Private terrace furnished with a sunbed",
      "Poolside daybed",
    ],
    amenities: [
      "King-size Bed",
      ...CORE_AMENITIES,
      "Flat Screen Cable TV (Netflix, YouTube, Amazon Prime)",
      "Private Balcony",
      "Private Terrace with Sunbed",
      "Mini Fridge",
    ],
    notes: [NO_CHILDREN_UNDER_10],
  },
  room08: {
    id: "room08",
    number: "08",
    name: "Overwater Terrace Suite",
    size: "58m²",
    capacity: "Up to 4 guests",
    bedding: "1 King size bed and 1 sofa bed",
    view: "Wooden deck with direct access to the overwater pool",
    priceFrom: 258750,
    description:
      "A luxury overwater suite with artfully furnished interiors, a private outdoor jacuzzi, and a pool you can step into straight from the bedroom.",
    features: [
      "Private outdoor jacuzzi",
      "Wooden deck with direct access to the overwater pool",
      "Private terrace furnished with a sunbed",
    ],
    amenities: [
      "King-size Bed",
      "Sofa Bed",
      ...CORE_AMENITIES,
      "2 Flat Screen Cable TVs (Netflix, YouTube, Amazon Prime)",
      "Private Balcony",
      "Private Terrace with Sunbed",
      "Mini Fridge",
    ],
    notes: [NO_CHILDREN_UNDER_10],
  },
  room09: {
    id: "room09",
    number: "09",
    name: "Ziba Black",
    size: "19m²",
    capacity: "Up to 3 guests: 2 adults or 2 adults and a child",
    bedding: "1 King size bed or twin beds",
    view: "Balcony with partial pool view overlooking the beach",
    priceFrom: 202500,
    description:
      "An all-black, ocean-view room with contemporary design, a plush sleeping area and its own lounge space.",
    features: [
      "Signature all-black contemporary design",
      "Lounge space",
      "Balcony with partial pool view overlooking the beach",
    ],
    amenities: [
      "King-size or Twin Beds",
      ...CORE_AMENITIES,
      "Flat Screen Cable TV (Netflix, YouTube, Amazon Prime)",
      "Private Balcony",
      "Mini Fridge",
    ],
  },
  room10: {
    id: "room10",
    number: "10",
    name: "Grand Overwater Loft Room",
    size: "Two-level loft",
    capacity: "Ask us about occupancy",
    bedding: "Upper-level bedroom",
    view: "Private balcony overlooking the pool and ocean",
    priceFrom: 295111,
    description:
      "A spacious two-level loft for an elevated overwater stay — more space and privacy above the water in Ziba's signature overwater pool, with a separate living and dining area below and the bedroom upstairs.",
    features: [
      "Two-level loft with upper-level bedroom",
      "Separate living and dining area",
      "Direct access to the signature overwater pool",
      "Private balcony overlooking the pool and ocean",
    ],
    amenities: [
      "Air Conditioning",
      "Bathroom with Hot & Cold Shower",
      "Towels",
      "Hairdryer",
      "Vanity Table",
      "Wardrobe",
      "Bedside Fridge",
      "In-room Coffee & Tea",
      "Coffee Machine",
      "HD Cable TV",
      "Sofa",
      "Intercom",
      "Free Wi-Fi",
      "Non-smoking Room",
      "Room Service",
      "Daily Housekeeping",
    ],
    notes: [NO_CHILDREN_UNDER_10],
  },
  room11: {
    id: "room11",
    number: "11",
    name: "Grand Overwater Studio Room",
    size: "Open-plan studio",
    capacity: "Up to 2 guests",
    bedding: "1 King size bed",
    view: "Water and ocean views",
    priceFrom: 251556,
    description:
      "Wake up surrounded by water in Ziba's signature overwater pool. A spacious, contemporary studio for two with floor-to-ceiling glass doors and direct pool access.",
    features: [
      "Floor-to-ceiling glass doors",
      "Direct access to the signature overwater pool",
      "Open-plan double vanity",
      "Separate shower and WC, plus a dressing area",
    ],
    amenities: [
      "King-size Bed",
      "Air Conditioning",
      "Bathroom with Hot & Cold Shower",
      "Towels",
      "Hairdryer",
      "Vanity Table",
      "Wardrobe",
      "Bedside Fridge",
      "In-room Coffee & Tea",
      "Coffee Machine",
      "HD Cable TV",
      "Sofa",
      "Intercom",
      "Free Wi-Fi",
      "Non-smoking Room",
      "Room Service",
      "Daily Housekeeping",
    ],
    notes: [NO_CHILDREN_UNDER_10],
  },
};

export const ROOM_IDS = Object.keys(ROOM_CATALOG);

export function formatPriceFrom(amount: number) {
  return `from ₦${Math.round(amount).toLocaleString("en-NG")}`;
}

/**
 * Stay facts every room shares, taken from the Resort Policies / House Rules
 * (shown in full on /bookings#policies). Keep in sync with that section.
 */
export const STAY_POLICY_HIGHLIGHTS = [
  "Check-in from 3pm · Check-out by 12pm",
  "Valid ID or passport required at check-in",
  "Full refund (less 5% admin fee) if cancelled 21+ days before arrival",
  "Within 21 days: non-refundable, but can be rescheduled once within 6 months",
];
