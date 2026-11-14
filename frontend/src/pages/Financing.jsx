import React from "react";

import FinancingHero from "../components/Financing/Financinghero";
import PlansSection from "../components/Financing/Planssection";
import DocumentsSection from "../components/Financing/Documentssection";
import BeforeYouSign from "../components/Financing/Beforeyousign";
import ContactSection from "../components/Financing/Contactsection";

const Financing = () => {
  return (
    <div className="bg-[#f5f5f0] font-['Poppins',sans-serif] text-slate-900">
      <FinancingHero />

      <main>
        <PlansSection />
        <DocumentsSection />
        <BeforeYouSign />
        <ContactSection />
      </main>
    </div>
  );
};

export default Financing;