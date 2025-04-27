'use client';

import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Tooltip from '../components/Tooltip';

export default function TechnologyPage() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-black pt-28 px-6 pb-20">
        <h1 className="text-4xl font-serif font-bold mb-10 text-center">Technology</h1>

        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Registry Model</h2>
          <p className="text-gray-700 mb-4">
            The CaskMark Registry is an off-chain ledger secured by cryptographic
            anchoring. Events like ownership declarations, custody transfers, and appraisals
            are hashed (SHA-256) and time-stamped to ensure tamper-proof validation.
          </p>
          <p className="text-gray-700">
            Each cask’s lifecycle is defined by signed events, maintaining integrity from
            distillery to bottle.
          </p>
        </section>

        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">Appraisal System</h2>
          <p className="text-gray-700 mb-4">
            CaskMark supports multiple levels of valuation integrity:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1">
            <li><strong>Estimated:</strong> Data-driven estimates based on registry trends</li>
            <li><strong>Broker Verified:</strong> Provided by registered partners with signed declarations</li>
            <li><strong>Appraiser Verified:</strong> Submitted with full documentation and third-party review</li>
          </ul>
        </section>

        <section className="mb-16 max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">API Overview</h2>
          <p className="text-gray-700">
            Our API enables direct integration for brokers, warehouses, and appraisers. Access is role-based
            and supports:
          </p>
          <ul className="list-disc list-inside text-gray-700 space-y-1 mt-2">
            <li>Submitting events (ownership, custody, appraisal)</li>
            <li>Querying cask state and audit trails</li>
            <li>Generating certificates and valuations</li>
          </ul>
        </section>

        <section className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-4">CaskMark ID Explained</h2>
          <p className="text-gray-700 mb-4">
            Like ISINs and CUSIPs in financial markets, each cask in the registry receives a unique identifier.
            The CaskMark ID ensures each cask can be tracked, verified, and certified across its lifecycle. 
            The code can be broken down as follows:
          </p>

          <div className="overflow-visible mt-4">
            <table className="w-full table-auto border-collapse border border-gray-300">
              <thead className="bg-gray-100">
                <tr>
                  <th className="border border-gray-300 px-4 py-2 text-left">Segment</th>
                  <th className="border border-gray-300 px-4 py-2 text-left">Meaning</th>
                </tr>
              </thead>
              <tbody>
                {[ 
                  ['CM', 'CaskMark prefix', 'Denotes a CaskMark-verified record. All identifiers begin with CM.'],
                  ['24', 'Year of fill', 'Indicates the year the cask was filled.'],
                  ['GL1', 'Distillery code', 'A unique 3-character alphanumeric code representing the distillery of origin. Globally unique within CaskMark.'],
                  ['A100', 'Serial number', 'A 4-character alphanumeric sequence unique per distillery per year. Allows over 1.6 million combinations.'],
                  ['X', 'Checksum digit', 'Calculated from the preceding 11 characters using a mod-10 algorithm over a Base36 encoding. Helps detect errors and prevent forged IDs.']
                ].map(([segment, meaning, detail]) => (
                  <tr key={segment}>
                    <td className="border border-gray-300 px-4 py-2 font-mono">
                      <Tooltip content={detail}>{segment}</Tooltip>
                    </td>
                    <td className="border border-gray-300 px-4 py-2 text-gray-700">{meaning}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
