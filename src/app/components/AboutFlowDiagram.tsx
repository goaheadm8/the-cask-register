import React from "react";
import { ArrowRight } from "lucide-react";

export default function AboutFlowDiagram() {
  return (
    <section className="bg-white py-20 px-6 text-center">
      <h2 className="text-4xl font-serif font-bold mb-12">
        How The Cask Registry Fits In
      </h2>
      <div className="max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-12 items-center">
          {/* Investor Start */}
          <div className="flex flex-col items-center">
            <div className="bg-[#f0e8dc] p-6 rounded-xl shadow w-full">
              <h3 className="text-xl font-bold mb-2">Investor</h3>
              <p className="text-sm text-[#2f1b0c]">
                Individuals or institutions looking to invest in whisky casks.
              </p>
            </div>
          </div>

          {/* Middle Arrows + Registry */}
          <div className="flex flex-col items-center gap-6 relative">
            <div className="w-full relative">
              <div className="absolute inset-0 flex items-center justify-center">
                <ArrowRight className="text-[#2f1b0c] w-6 h-6 rotate-90 md:rotate-0" />
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-[#f8f3e9] p-4 rounded-xl shadow">
                  <h4 className="font-semibold">Broker</h4>
                  <p className="text-xs text-[#2f1b0c]">
                    Buys/sells casks, often with limited transparency.
                  </p>
                </div>
                <div className="bg-[#f8f3e9] p-4 rounded-xl shadow">
                  <h4 className="font-semibold">Distillery</h4>
                  <p className="text-xs text-[#2f1b0c]">
                    Offers casks directly to investors or brokers.
                  </p>
                </div>
              </div>
            </div>

            {/* Registry Box */}
            <div className="bg-[#2f1b0c] text-white p-6 rounded-xl shadow max-w-xs z-10">
              <h3 className="text-xl font-bold mb-2">The Cask Registry</h3>
              <p className="text-sm">
                An independent layer that provides:
                <ul className="list-disc text-left ml-4 mt-2 space-y-1">
                  <li>Ownership Verification</li>
                  <li>Authentication & Blockchain Records</li>
                  <li>Data-Driven Valuations</li>
                  <li>Exit Strategy Guidance</li>
                </ul>
              </p>
            </div>
          </div>

          {/* Outcome */}
          <div className="flex flex-col items-center">
            <div className="bg-[#f0e8dc] p-6 rounded-xl shadow w-full">
              <h3 className="text-xl font-bold mb-2">Secure Investment</h3>
              <p className="text-sm text-[#2f1b0c]">
                Verified records, transparent pricing, and confident ownership.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
