import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import OverlayLayout from "../components/OverlayLayout";
import AboutFlowDiagram from "../components/AboutFlowDiagram"
import React from "react";

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <OverlayLayout>
        <h1 className="text-4xl font-bold mb-6 text-center">About Us</h1>
        <p className="mb-4">
          CaskMark was founded to bring transparency and innovation to the private unregulated whisky investment market.
        </p>
        <p className="mb-4">
          The goal is to route out the fraud and deception that has plagued the industry for decades, and to provide a secure and reliable way to register and verify cask ownership. 
        </p>
        <p className="mb-4">
          We combine secure web technology with blockchain-based proof of ownership to ensure every cask entry is verified, logged, and protected.
        </p>
        <p>
          Based in Scotland and proud to support the industry’s heritage, our mission is to help you protect your liquid investment.
        </p>
        <p className="mb-4 mt-4"> 
        </p>
            {/* Strategic Positioning & Framing */}
    <section className="bg-white py-12 px-6 rounded-xl shadow mb-12">
      <h2 className="text-3xl font-serif font-bold mb-4">Why Caskmark?</h2>
      <p className="mb-4">
        Caskmark is <strong>not</strong> a marketplace, tokenisation layer, or broker platform.
      </p>
      <p className="mb-4">
        It serves as a <strong>data layer</strong> beneath existing actors—brokers, warehouses, appraisers, and insurers—to:
      </p>
      <ul className="list-disc list-inside space-y-2 text-left text-sm mb-4">
        <li>Enable compliance with regulatory, insurance, and institutional standards</li>
        <li>Support resale, audit, and underwriting use cases</li>
        <li>Maintain broker-first control while providing end-user transparency</li>
        <li>Anchor every event off-chain with cryptographic proofs</li>
      </ul>
    </section>

        <AboutFlowDiagram />
      </OverlayLayout>
      <Footer />
    </>
  );
}
