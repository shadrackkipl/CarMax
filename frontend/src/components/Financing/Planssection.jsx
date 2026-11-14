import React from "react";
import { display } from "./utils";
import PlanCard from "./Plancard";
import ComparisonTable from "./Comparisontable";

export default function PlansSection() {
  return (
    <section
      id="financing-partners"
      className="scroll-mt-24 bg-[#f5f5f0] px-5 py-16 sm:px-8 sm:py-20 lg:px-10"
    >
      <div className="mx-auto max-w-7xl">
        <div className="max-w-2xl">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#003b70]">
            Finance options
          </p>
          <h2
            className="mt-3 text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl"
            style={display}
          >
            Compare our financing partners
          </h2>
          <p className="mt-4 leading-7 text-slate-900">
            Explore the available partners, then ask for written terms based on
            your vehicle and application. Rates, deposits and approval are set
            by the lender.
          </p>
        </div>

        <div className="mt-9 grid gap-5 md:grid-cols-3">
          <PlanCard
            title="Absa"
            badge="Bank finance"
            badgeClass="border-blue-100 bg-blue-50 text-[#003b70]"
            cta="Ask about Absa"
          >
            Ask about the deposit, repayment period, interest rate and
            application steps. Request the lender’s terms in writing.
          </PlanCard>
          <PlanCard
            title="Stanbic Bank"
            badge="Bank finance"
            badgeClass="border-blue-100 bg-blue-50 text-[#003b70]"
            cta="Ask about Stanbic"
          >
            Discuss the application process and required documents with our
            team, then review the lender’s written quotation.
          </PlanCard>
          <PlanCard
            title="NCBA"
            badge="Bank finance"
            badgeClass="border-red-100 bg-red-50 text-red-700"
            cta="Ask about NCBA"
          >
            Compare the full cost of an NCBA offer with other options, not only
            the initial deposit.
          </PlanCard>
        </div>

        <ComparisonTable />
      </div>
    </section>
  );
}