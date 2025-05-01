'use client';

import React from 'react';
import Link from 'next/link';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main className="bg-white text-black">
        {/* Hero Section */}
        <section className="text-center px-6 py-24">
          <h1 className="text-5xl font-serif font-bold mb-6">
            The mark of whisky provenance.
          </h1>
          <p className="text-lg mb-6 max-w-2xl mx-auto">
            Caskmark is the secure registry for whisky cask ownership, custody, and valuation.
          </p>
          <p className="text-md mb-10 text-gray-700">
            Built for brokers, trusted by warehouses, and verified for investors.
          </p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/technology" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">Explore the Registry</Link>
            <Link href="/get-access" className="border border-black px-6 py-3 rounded hover:bg-gray-100">Partner With Us</Link>
          </div>
        </section>

        {/* What is Caskmark */}
        <section className="bg-gray-100 py-16 px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">What is Caskmark?</h2>
          <p className="max-w-3xl mx-auto text-gray-800">
            We provide the data backbone for verifying, documenting, and transferring whisky cask ownership.
            Every record is signed, time-stamped, and cryptographically anchored — so your cask can speak for itself.
          </p>
        </section>

        {/* Who It's For */}
        <section className="py-20 px-6 bg-white text-center">
          <h2 className="text-3xl font-serif font-bold mb-10">Who It’s For</h2>
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
            {[
              {
                title: 'Brokers',
                desc: 'Prove ownership. Simplify resale. Gain trust.'
              },
              {
                title: 'Warehouses',
                desc: 'Create secure custody logs. Reduce liability.'
              },
              {
                title: 'Collectors',
                desc: 'View and protect your investment.'
              },
            ].map(({ title, desc }) => (
              <div key={title} className="bg-gray-100 p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold font-serif mb-2">{title}</h3>
                <p className="text-gray-700">{desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Metrics Section */}
        <section className="bg-gray-50 py-20 px-6 text-center">
          <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { label: 'Casks Verified', value: '3,482' },
              { label: 'Partners Onboarded', value: '19' },
              { label: 'Appraised Value', value: '£14.2M' }
            ].map(({ label, value }) => (
              <div key={label} className="text-center">
                <p className="text-4xl font-bold font-serif mb-2">{value}</p>
                <p className="text-gray-600">{label}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Testimonial */}
        <section className="py-20 bg-white px-6 text-center">
          <blockquote className="italic text-lg max-w-2xl mx-auto text-gray-800">
            “Caskmark gives us a level of transparency this industry has never had.”<br />
            <span className="block mt-4 font-bold text-gray-700">— Partner Broker</span>
          </blockquote>
        </section>

        {/* Final Call to Action */}
        <section className="bg-[#f8f3e9] py-20 px-6 text-center">
          <h2 className="text-3xl font-serif font-bold mb-4">
            Still using spreadsheets and PDFs?
          </h2>
          <p className="mb-6 text-gray-800">Let’s fix that.</p>
          <div className="flex flex-col md:flex-row gap-4 justify-center">
            <Link href="/get-access" className="bg-black text-white px-6 py-3 rounded hover:bg-gray-800">
              Get Started
            </Link>
            <Link href="/get-access" className="border border-black px-6 py-3 rounded hover:bg-gray-100">
              Book a Call with Us
            </Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
