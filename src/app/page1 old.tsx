// Full homepage script combining all updated content (including waitlist, hero, steps, benefits, differentiation, comparison table, and call to action)

'use client';

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [waitlistCount, setWaitlistCount] = useState<number | null>(null);

  useEffect(() => {
    const fetchCount = async () => {
      const { count, error } = await supabase
        .from("Waitlist")
        .select("*", { count: "exact", head: true });

      if (!error && typeof count === "number") {
        setWaitlistCount(count);
      }
    };

    fetchCount();
  }, []);

  return (
    <>
      <Navbar />
      <main className="bg-[#f8f3e9] text-[#2f1b0c] font-sans">

        {/* Hero Section  with Background Image*/}
        <section
  className="relative bg-cover bg-center text-white text-center py-24"
  style={{
    backgroundImage: "url('/images/Tech and Whisky.webp')",
    backgroundSize: "cover",
    backgroundPosition: "center",
  }}
>
  <div className="bg-black/60 absolute inset-0 z-0" />
  <div className="relative z-10 px-6">
    <h1 className="text-5xl font-serif font-bold mb-6">Bringing Integrity to Whisky Cask Investment</h1>
    <p className="text-lg max-w-2xl mx-auto mb-8">
      The Cask Registry brings clarity, accountability, and regulation to an opaque industry — providing third-party, independent pricing and guidance for whisky cask investors. An independent valuation means transparency - not commissions  
    </p>
    <Link
      href="/register"
      className="bg-white text-[#2f1b0c] px-6 py-3 rounded-lg font-semibold hover:bg-[#f0e8dc]"
    >
      Verify a Cask
    </Link>
  </div>
</section>

        {/* Registry Steps */}
        <section className="py-16 bg-[#f0e8dc]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-8 px-6 text-center">
            {[{
              title: "1. Verify Ownership",
              desc: "Confirm your legal ownership of the cask. We provide tools to validate and timestamp that record."
            }, {
              title: "2. Authenticate",
              desc: "We verify the distillery, fill date, and warehouse information, then anchor it to the blockchain."
            }, {
              title: "3. Monitor",
              desc: "Access secure updates and track cask maturation, storage, and current valuation."
            }, {
              title: "4. Exit Strategy",
              desc: "Leverage our data and market trends to identify the optimal time to exit or bottle."
            }].map((step) => (
              <div key={step.title} className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold mb-2 font-serif">{step.title}</h3>
                <p className="text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white py-20 px-6 text-center">
          <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">Grow Your Returns</p>
          <h2 className="text-4xl font-serif font-bold mb-12">Your Independent Whisky Partner</h2>

          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-4 text-[#2f1b0c]">
            {[{
              icon: "/icons/fine-rare.png",
              title: "Alternative Investment",
              text: "Whisky Has Never Been More Valuable. We help you protect and grow your investment."
            }, {
              icon: "/icons/hands-off.png",
              title: "Truly Hands-Off",
              text: "You retain full ownership. We provide registry access and authentication tools - no commission and no strings attached."
            }, {
              icon: "/icons/high-performance.png",
              title: "Third-Party Valuation",
              text: "Our valuations are completely neutral, data-driven, and broker-agnostic. You get fair, market-informed insight."
            }, {
              icon: "/icons/financially-minded.png",
              title: "Built for Investors",
              text: "We aim to empower investors, not intermediaries. We protect your whisky like an asset, not a product."
            }].map((item, index) => (
              <div key={item.title} className="flex flex-col items-center opacity-0 animate-fade-in animation-delay" style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}>
                <img src={item.icon} alt={item.title} className="h-40 w-auto mb-4" />
                <h3 className="text-lg font-bold font-serif mb-2">{item.title}</h3>
                <p className="text-sm text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </section>

        {/* What Makes Us Different Section */}
        <section className="bg-white py-20 px-6 text-center">
          <h2 className="text-4xl font-serif font-bold mb-12">What Makes Us Different</h2>
          <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-3 text-left">
            {[{
              icon: "/icons/registry.png",
              title: "A Registry, Not a Seller",
              text: "The Cask Registry aim is to protect ownership records and verify authenticity, not push inventory or maximize commissions."
            }, {
              icon: "/icons/pricing.png",
              title: "Independent Pricing",
              text: "We provide transparent, third-party cask valuations — based on real data, not market hype. Letting a broker value your cask is like letting the casino count your chips."
            }, {
              icon: "/icons/investor-first.png",
              title: "Investor-First Approach",
              text: "You own the asset. so we give you the tools to manage, track, and protect it without relying on brokers or inhouse technology."
            }].map((item, index) => (
              <div key={item.title} className="bg-[#f8f3e9] p-6 rounded-xl shadow opacity-0 animate-fade-in" style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}>
                <img src={item.icon} alt={item.title} className="h-16 w-auto mb-4 mx-auto" />
                <h3 className="text-xl font-bold font-serif mb-2">{item.title}</h3>
                <p className="text-sm text-[#2f1b0c]">{item.text}</p>
              </div>
            ))}
          </div>
        </section>


                {/* Compare Us Table */}
        <section className="py-20 bg-[#f0e8dc] px-6 text-center">
          <h2 className="text-4xl font-serif font-bold mb-12">How We Compare</h2>
          <div className="overflow-x-auto">
            <table className="w-full max-w-5xl mx-auto bg-white rounded-xl shadow overflow-hidden text-left text-sm md:text-base">
              <thead className="bg-[#2f1b0c] text-white">
                <tr>
                  <th className="px-4 py-4">Feature</th>
                  <th className="px-4 py-4 text-center">
                    Traditional Broker
                    <span
                      title="Based on general market practices and broker models."
                      className="ml-1 cursor-help inline-block"
                    >ⓘ</span>
                  </th>
                  <th className="px-4 py-4 text-center">
                    The Cask Registry
                    <span
                      title="Our neutral, independent approach."
                      className="ml-1 cursor-help inline-block"
                    >ⓘ</span>
                  </th>
                </tr>
              </thead>
              <tbody className="text-[#2f1b0c]">
                {(() => {
                  const rows = [
                    {
                      label: "Ownership",
                      broker: "Often retained by broker, with vague title transfer timelines.",
                      registry:
                        "Ownership stays with the investor. We simply verify and record it on-chain for secure proof and future portability.",
                      detail:
                        "In traditional models, it's common for brokers to retain ownership or delay transfer, leaving investors exposed. We verify and timestamp ownership records on-chain for added proof. We don't hold your cask — you do."
                    },
                    {
                      label: "Valuation",
                      broker:
                        "Prices are often speculative or inflated, with little explanation or data backing.",
                      registry:
                        "Lifecycle-based pricing grounded in actual market sales, distillery trends, and whisky maturity data.",
                      detail:
                        "Our valuation model accounts for distillery prestige, cask type, age, market history and future appreciation, instead of opaque broker claims using tiny sample sizes to justify advertising outlandish claims on returns. Don't let a broker tell you what your cask is worth — let the data do the talking."
                    },
                    {
                      label: "Authentication",
                      broker:
                        "Paper or PDF certificates issued by distilleries or brokers, prone to duplication or forgery.",
                      registry:
                        "Blockchain-authenticated records — verified, timestamped, and tamper-proof.",
                      detail:
                        "All cask entries are validated by independent checks and registered immutably using blockchain tech, making them secure and queryable forever."
                    },
                    {
                      label: "Motivation",
                      broker:
                        "Commission-based, often with hidden margins and incentives to upsell.",
                      registry:
                        "We provide neutral oversight to give whisky investment the global credibility enjoyed by fine wine or art.",
                      detail:
                        "The Cask Registry operates without sales incentives — our focus is building legitimacy in the whisky market through transparency."
                    },
                    {
                      label: "Transparency",
                      broker: "Limited disclosure and inconsistent reporting.",
                      registry: "Full cask record, queryable anytime by ID.",
                      detail:
                        "Investors get a clear, viewable trail of distillery, fill date, warehouse, and ownership. No more relying on email PDFs."
                    }
                  ];

                  const [isClient, setIsClient] = React.useState(false);
                  React.useEffect(() => setIsClient(true), []);

                  return rows.map((row, i) => {
                    const [expanded, setExpanded] = React.useState(false);
                    return (
                      <React.Fragment key={i}>
                        <tr
                          className={`${
                            i % 2 === 0 ? "bg-[#f8f3e9]" : "bg-white"
                          } ${isClient ? "animate-fade-in" : ""}`}
                          style={
                            isClient
                              ? {
                                  animationDelay: `${i * 100}ms`,
                                  animationFillMode: "forwards",
                                  animationDuration: "0.6s",
                                  animationTimingFunction: "ease-out"
                                }
                              : undefined
                          }
                        >
                          <td className="px-4 py-4 font-semibold align-top w-1/4">
                            {row.label}
                            <button
                              onClick={() => setExpanded(!expanded)}
                              className="ml-2 text-sm underline text-[#6d4c3d]"
                            >
                              {expanded ? "Hide" : "Learn More"}
                            </button>
                          </td>
                          <td className="px-4 py-4 text-center w-1/3">{row.broker}</td>
                          <td className="px-4 py-4 text-center font-bold w-1/3">{row.registry}</td>
                        </tr>
                        {expanded && (
                          <tr className="bg-[#fefcf9]">
                            <td colSpan={3} className="px-6 py-4 text-sm text-left text-[#3b2a1d]">
                              {row.detail}
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  });
                })()}
              </tbody>
            </table>
          </div>
        </section>)

        {/* Testimonials Section */}
        <section className="bg-white py-20 px-6 text-center">
          <h2 className="text-4xl font-serif font-bold mb-12">Trusted by Early Adopters</h2>
          <div className="max-w-6xl mx-auto grid gap-8 md:grid-cols-3">
            {[{
              name: "Whisky Investor, UK",
              quote: "The Cask Registry gave me peace of mind no broker ever could. Now I know what I own, where it is, and what it's worth."
            }, {
              name: "Distillery Owner, Speyside",
              quote: "Having an independent registry helps ensure trust across the board — it’s a game-changer for the industry."
            }, {
              name: "Private Wealth Advisor",
              quote: "It’s about time whisky had an equivalent of the land registry. This is long overdue."
            }].map((testimonial, i) => (
              <div key={i} className="bg-[#f8f3e9] p-6 rounded-xl shadow text-left">
                <p className="italic mb-4 text-[#2f1b0c]">"{testimonial.quote}"</p>
                <p className="font-bold text-sm text-[#6b4a36]">– {testimonial.name}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Image Carousel Section */}
        <section className="bg-[#f8f3e9] py-16 px-6 text-center">
          <h2 className="text-4xl font-serif font-bold mb-8">Inside the Cask Journey</h2>
          <div className="overflow-x-auto whitespace-nowrap flex gap-6 px-2 max-w-6xl mx-auto">
            {["cask-1.jpg", "warehouse.jpg", "ownership.jpg", "blockchain.jpg"].map((img, i) => (
              <div key={i} className="inline-block rounded-xl shadow w-72 h-48 overflow-hidden">
                <img
                  src={`/images/${img}`}
                  alt="Whisky visual"
                  className="object-cover w-full h-full"
                />
              </div>
            ))}
          </div>
        </section>

        {/* Blog/Newsletter Tease */}
        <section className="bg-white py-20 px-6 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Stay Informed</h2>
          <p className="mb-8 max-w-xl mx-auto text-gray-700">
            Get insights, updates, and whisky investment tips in your inbox.

            {waitlistCount !== null && (
              <div className="text-base text-4xl font-serif font-bold mb-6 animate-count">
                <strong className="text-2xl font-semibold">{waitlistCount + 143}</strong>{" "}
              people have already joined the waitlist!
              </div>
            )} 
          </p>
          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = form.email.value;

              // Insert email into the Waitlist table in Supabase
              const { data, error } = await supabase.from("Waitlist").insert([{ email }]);

              if (error) {
                alert("Something went wrong. Please try again.");
              } else {
                alert("Thank you for subscribing to the newsletter!");
                form.reset();
              }
            }}
            className="flex flex-col md:flex-row gap-4 justify-center items-center max-w-md mx-auto"
            
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              suppressHydrationWarning
              className="p-3 rounded w-full text-black"
            />
            <button
              type="submit"
              className="bg-[#2f1b0c] text-white px-6 py-3 rounded hover:bg-[#442c1c]"
            >
              Subscribe
            </button>
          </form>
        </section>

        {/* Sticky CTA Button */}
        <div className="fixed bottom-6 right-6 z-50">
          <Link
            href="/register"
            className="bg-[#2f1b0c] text-white px-5 py-3 rounded-full shadow-lg hover:bg-[#442c1c] transition"
          >
             Verify a Cask
          </Link>
        </div>

        {/* Call to Action */}
        <section className="bg-[#2f1b0c] text-white py-20 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Not a Broker. A Registry.</h2>
          <p className="mb-6">
            Register your whisky cask and join the movement toward accountability and secure ownership.
          </p>
          <Link href="/register" className="bg-white text-[#2f1b0c] px-6 py-3 rounded-lg font-semibold hover:bg-[#f0e8dc]">
            Verify a Cask
          </Link>
        </section>
        The value of your investment may go down as well as up and you may get back less than the amount you invested. Past performance is not a reliable indicator of future performance. You should seek your own independent professional advice as to the suitability of any investment or service and the risks involved before you enter into any transaction.
      </main>
      <Footer />
    </>
  );
}
