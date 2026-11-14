/* Advertised terms. Rates marked "example" are placeholders, not quotes.
   CarMax East Africa does not publish rates, deposits or terms for its
   lender partners, so every figure below must be replaced with the lender's
   written quote before launch. */

const EXAMPLE = {
  depositLabel: "Deposit",
  depositMin: 10,
  depositMax: 30,
  termMax: 60,
  termDefault: 48,
  rate: 1.25,
  fee: 0,
  rateNote: "Example rate. Use the lender’s written quote.",
};

export const PLANS = {
  absa: { name: "Absa", ...EXAMPLE },
  stanbic: { name: "Stanbic Bank", ...EXAMPLE },
  ncba: { name: "NCBA", ...EXAMPLE },
};

export const COLS = ["Absa", "Stanbic Bank", "NCBA"];

export const TABLE = [
  {
    label: "Deposit",
    values: ["Lender’s quote", "Lender’s quote", "Lender’s quote"],
  },
  {
    label: "Repayment period",
    values: ["Lender’s quote", "Lender’s quote", "Lender’s quote"],
  },
  {
    label: "Interest",
    values: ["Lender’s quote", "Lender’s quote", "Lender’s quote"],
  },
  {
    label: "Credit checks",
    values: [
      "Lender’s checks apply",
      "Lender’s checks apply",
      "Lender’s checks apply",
    ],
  },
  {
    label: "How to apply",
    values: [
      "Ask at the Ngong Road or Karen branch",
      "Ask at the Ngong Road or Karen branch",
      "Ask at the Ngong Road or Karen branch",
    ],
  },
];

export const DOCS = [
  {
    who: "Salaried employee",
    items: [
      "Three recent payslips",
      "Six months of bank statements",
      "National ID or passport",
      "KRA PIN certificate",
      "Employer introduction letter",
    ],
  },
  {
    who: "Self-employed or business owner",
    items: [
      "Six to twelve months of bank statements",
      "National ID or passport",
      "KRA PIN certificate",
      "Business registration documents, where applicable",
    ],
  },
  {
    who: "Company",
    items: [
      "Company registration documents",
      "Company KRA PIN",
      "Directors’ IDs and PINs",
      "Six to twelve months of bank statements",
    ],
  },
];

export const CHECKS = [
  {
    t: "Flat or reducing-balance?",
    d: "Ask which one applies, and ask for the total amount you will repay over the full term.",
  },
  {
    t: "Every extra charge",
    d: "Processing, insurance, valuation, tracking, transfer costs and early-repayment penalties.",
  },
  {
    t: "Ownership and default",
    d: "When ownership passes to you, whether the vehicle can be repossessed, and what happens if you miss a payment.",
  },
  {
    t: "Who the lender is",
    d: "Get the contract, the full repayment schedule and the legal name of the lender in writing.",
  },
  {
    t: "Insurance requirements",
    d: "Ask whether the lender requires comprehensive cover, who the insurer must be, and what the premium adds to your monthly cost.",
  },
];