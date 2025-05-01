import React from "react";
import { ArrowRight, ArrowUpDown } from 'lucide-react';

export default function CaskLifecycle() {
  return (
    <section className="bg-[#f8f3e9] py-20 px-6 text-center">
      <h2 className="text-4xl font-serif font-bold mb-12">
        The Life of a Whisky Cask
      </h2>
      <div className="flex flex-col md:flex-row items-center justify-center gap-6">
        {/* Distillery */}
        <div className="bg-white p-6 rounded-xl shadow text-center w-56">
          <h3 className="text-xl font-bold font-serif mb-2">Distillery</h3>
          <p className="text-sm text-[#2f1b0c]">
            Whisky is filled into a cask and stored in bonded warehouses.
          </p>
        </div>

        {/* Arrow */}
        <div className="text-4xl text-[#2f1b0c] hidden md:block">→</div>

        {/* Broker/Investor */}
        <div className="bg-white p-6 rounded-xl shadow text-center w-56">
          <h3 className="text-xl font-bold font-serif mb-2">Broker / Investor</h3>
          <p className="text-sm text-[#2f1b0c]">
            Casks are acquired by brokers or private investors during their
            maturation.
          </p>
        </div>

        {/* Arrow */}
        <div className="text-4xl text-[#2f1b0c] hidden md:block">→</div>

        {/* Sale or Bottling */}
        <div className="bg-white p-6 rounded-xl shadow text-center w-56">
          <h3 className="text-xl font-bold font-serif mb-2">Bottling / Sale</h3>
          <p className="text-sm text-[#2f1b0c]">
            Once matured, the cask is either bottled or sold on the secondary
            market.
          </p>
        </div>
      </div>
    {/* Up Arrow back to Broker/Investor */}
        <ArrowUpDown className="block mx-auto my-6 h-14 w-14 text-[#2f1b0c]" />  
      {/* Cask Registry Block */}
      <div className="bg-white text-[#2f1b0c] mt-12 p-6 rounded-xl shadow w-full max-w-xs mx-auto text-center">
        <h3 className="text-xl font-bold font-serif mb-2">The Role of CaskMark</h3>
        <ul className="text-sm text-left list-disc pl-4">
          <li>Independent Ownership Verification</li>
          <li>Blockchain Authentication</li>
          <li>Data-Driven Valuation Reports</li>
          <li>Exit Strategy & Bottling Guidance</li>
        </ul>
      </div>
    </section>
  );
}
