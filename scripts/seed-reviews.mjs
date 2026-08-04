/**
 * Seed Reviews only (Google Sheet via Apps Script).
 * Does not touch Drive images — site media uses /public/images.
 *
 * Usage: yarn seed:reviews
 *    or: node scripts/seed-reviews.mjs
 */

const URL =
  process.env.GOOGLE_SCRIPT_URL ||
  "https://script.google.com/macros/s/AKfycbylnrCFQvKkwqE9NJn-Hwk68ixkGFW9PJX9_WzYAFjnOUnijhiagZlXiYuoI64Qjb87hA/exec";
const SECRET =
  process.env.GOOGLE_SCRIPT_SECRET || "d0c48e2b-6f96-4e4d-a38b-c0a3c0a7f9f1";

const seeds = [
  {
    quote:
      "We booked Private Chef Lombok for our Senggigi villa. The chef handled everything — shopping, cooking, and clean-up. Best dinner of the trip.",
    name: "Hannah & Mark",
    place: "Villa dinner, Senggigi",
    rating: 5,
    review: "Professional private chef service from start to finish.",
    status: "show",
  },
  {
    quote:
      "Six of us near Kuta Lombok. Fresh seafood, clear pricing on WhatsApp, and no restaurant transfers. Exactly what we needed.",
    name: "Priya R.",
    place: "Group booking, South Lombok",
    rating: 5,
    review: "Menus adapted perfectly to our dietary needs.",
    status: "show",
  },
  {
    quote:
      "We recommend this private chef service to every guest at our villa. Easy to book and consistently excellent.",
    name: "Villa Amara",
    place: "Villa host, Lombok",
    rating: 5,
    review: "Our guests keep asking for the WhatsApp number.",
    status: "show",
  },
  {
    quote:
      "Anniversary dinner on the terrace with a private chef. Quiet, generous portions, and dessert we still talk about.",
    name: "Tomás L.",
    place: "Couple dinner, Mangsit",
    rating: 5,
    review: "Felt like fine dining without leaving the villa.",
    status: "show",
  },
  {
    quote:
      "Family of eight including kids. Patient cooking, flexible menu, and great local flavours. Highly recommend for Lombok stays.",
    name: "The Chen family",
    place: "Family villa, Bangsal",
    rating: 4,
    review: "Easy WhatsApp booking and fair value.",
    status: "show",
  },
  {
    quote:
      "Booked again for friends arriving the next week. Same private chef service, same standard — arranged in two messages.",
    name: "Sofia & Luca",
    place: "Repeat booking, Kuta Lombok",
    rating: 5,
    review: "Reliable enough that we already rebooked.",
    status: "show",
  },
];

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function createReview(review) {
  const response = await fetch(URL, {
    method: "POST",
    headers: { "Content-Type": "text/plain;charset=utf-8" },
    body: JSON.stringify({
      action: "create",
      token: SECRET,
      ...review,
    }),
    redirect: "follow",
  });

  const text = await response.text();
  try {
    return JSON.parse(text);
  } catch {
    return { ok: false, error: text.slice(0, 200) };
  }
}

async function main() {
  console.log("Seeding reviews only →", URL);
  for (const review of seeds) {
    const data = await createReview(review);
    console.log(review.name, data);
    await sleep(1500);
  }
  console.log("Done.");
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
