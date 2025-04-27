'use client';

import React from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OverlayLayout from "../components/OverlayLayout";

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <OverlayLayout>
        <h1 className="text-4xl font-bold mb-6 text-center">How It Works</h1>

        <section className="mb-10 text-[#2f1b0c]">
          <h2 className="text-2xl font-semibold mb-4">The CaskMark Registry Process</h2>
          <p className="mb-4">
            CaskMark operates as a digital layer for whisky cask verification. We don’t sell casks, manage marketplaces, or act as brokers. Instead, we enable validation, transparency, and trusted data.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Brokers onboard casks into the system as verified entities.</li>
            <li>Warehouses confirm custody events (re-gauge, movement, bottling, etc.).</li>
            <li>Appraisers and insurers anchor valuation reports and coverage details.</li>
          </ul>
        </section>

        <section className="mb-10 text-[#2f1b0c]">
          <h2 className="text-2xl font-semibold mb-4">User Experience (UX)</h2>
          <p className="mb-4">
            CaskMark is designed with simplicity and clarity in mind. Users — whether brokers or collectors — interact through secure dashboards:
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Brokers access onboarding tools, cert generation, and event logs.</li>
            <li>Collectors can search their cask, view history, download certificates.</li>
            <li>All data is cryptographically signed, ensuring authenticity at every step.</li>
          </ul>
        </section>

        <section className="text-[#2f1b0c]">
          <h2 className="text-2xl font-semibold mb-4">The Trust Flow</h2>
          <p className="mb-4">
            Trust is earned via transparency. Each event in a cask's lifecycle — from fill date to bottling — is timestamped and signed by an authorised actor (e.g., warehouse, broker).
          </p>
          <p>
            These events are hashed (SHA-256) and anchored to a secure ledger, providing an immutable trail of custody and valuation. Certificates issued by CaskMark reflect this verified data.
          </p>
        </section>
      </OverlayLayout>
      <Footer />
    </>
  );
}
