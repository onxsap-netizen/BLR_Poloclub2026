export type CocSection = { title: string; items: string[] };
export type CocRule = { title: string; body: string };

export const codeOfConduct: CocSection[] = [
  {
    title: "Respect First",
    items: [
      "Treat every member, their family, fellow road users, venue staff, sponsors, and partners with courtesy and respect.",
    ],
  },
  {
    title: "Drive Responsibly",
    items: [
      "Safety is our highest priority.",
      "All participating vehicles must be in safe, roadworthy condition.",
      "Drive cautiously, adhering to speed limits and road rules at all times.",
      "Avoid dangerous overtakes, racing, drifting, or reckless driving.",
      "Maintain convoy discipline.",
      "Carry a basic emergency kit and contact details during events.",
      "Respect instructions given by the Convoy Coordinator and Event Team at all times.",
      "Adhere to child safety seat regulations when children are present.",
    ],
  },
  {
    title: "Pops & Bangs / Revving",
    items: [
      "Unnecessary revving, pops & bangs, launch control, or excessive exhaust noise is not permitted during community events.",
      "These are allowed only at a designated location and only after approval from the Event Coordinator.",
    ],
  },
  {
    title: "Event Rules",
    items: [
      "A safety and itinerary briefing will be conducted before each event.",
      "Arrive on time to avoid delays and ensure smooth coordination.",
      "Cars without number plates will not be tolerated.",
      "Group driving: maintain a safe following distance, use hand signals or agreed communication devices, and stick to designated routes.",
      "Park responsibly, avoiding damage to property or inconvenience to others.",
      "Follow all laws and ordinances of the areas visited during events.",
    ],
  },
  {
    title: "Environmental Responsibilities",
    items: [
      "Dispose of all trash properly; leave locations cleaner than found.",
      "Avoid unnecessary idling and maintain your vehicle to reduce emissions.",
      "Avoid damaging natural environments during off-road activities.",
    ],
  },
  {
    title: "Members Only",
    items: [
      "Club events are exclusively for registered members unless otherwise announced.",
    ],
  },
  {
    title: "No Alcohol or Drugs",
    items: [
      "Driving under the influence of alcohol or drugs is strictly prohibited. Any member found violating this rule will be removed from the event immediately.",
    ],
  },
  {
    title: "Represent the Community",
    items: [
      "Every member represents ThePoloClub.BLR. Conduct yourself in a manner that reflects positively on the community both on and off the road.",
    ],
  },
  {
    title: "Zero Tolerance",
    items: [
      "Any behaviour that compromises the safety, reputation, or experience of other members - including repeated rule violations, aggressive behaviour, or misconduct - may result in immediate removal from the event and/or permanent removal from ThePoloClub.BLR without prior notice.",
    ],
  },
  {
    title: "Dispute Resolution",
    items: [
      "Address conflict privately and respectfully, involving club leaders. Disputes should not be handled in the group.",
      "Concerns or violations can be reported confidentially, without fear of reprisal.",
    ],
  },
  {
    title: "Legal and Liability",
    items: [
      "Ensure your vehicle is insured as per legal requirements.",
      "Members acknowledge personal responsibility during events.",
      "The club is not responsible for individual actions or accidents during official and non-official events.",
    ],
  },
  {
    title: "Events & Costs",
    items: [
      "Most regular drives and meets run on a Dutch basis - each member bears their own costs (food, beverages, tolls, fuel, etc.).",
      "Where an event involves photography, videography, venue bookings, merchandise, or permits, a participation fee may be announced in advance, before registrations open.",
    ],
  },
  {
    title: "WhatsApp Group Etiquette",
    items: [
      "Treat all members with courtesy and respect.",
      "Keep conversations relevant to the community, events, Volkswagen, and automotive discussions.",
      "No abusive language, personal attacks, bullying, harassment, or discrimination of any kind.",
      "No political, religious, offensive, NSFW, or unrelated promotional content without prior approval from the Community Team.",
      "Respect differing opinions and maintain healthy discussions.",
      "Avoid spam, repeated forwards, or excessive messages.",
    ],
  },
];

export const codeOfConductRules: CocRule[] = codeOfConduct.map((section) => ({
  title: section.title,
  body: section.items.join(" "),
}));

export const cocImportant =
  "Violation of any community or event rule may result in immediate removal from the event and/or permanent removal from ThePoloClub.BLR without any refund or prior notice. All decisions made by the organising team are final.";

export const cocMotto =
  "We don't just drive together. We represent a community together.";

export default codeOfConduct;
