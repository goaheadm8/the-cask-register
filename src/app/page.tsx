'use client';

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import { supabase } from "../lib/supabaseClient";
import { useState, useEffect } from "react";

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
      <main className="text-[#2f1b0c] font-sans">
        {/* Waitlist Section */}
        <section className="text-white px-6 py-10 text-center">
          <h2 className="text-3xl text-white font-serif font-bold mb-4">Join the Waitlist</h2>
          <p className="mb-4">Be the first to register your whisky casks and access exclusive features.</p>

          {/* 👇 Waitlist Count */}
          {waitlistCount !== null && (
            <p className="text-base text-white mb-4 animate-count px-4 py-2 inline-block rounded shadow">
            <strong className="text-2xl font-semibold">{waitlistCount + 143}</strong> people have already joined the waitlist!
          </p>
          )}

          <form
            onSubmit={async (e) => {
              e.preventDefault();
              const form = e.currentTarget;
              const email = form.email.value;

              const { data, error } = await supabase.from("Waitlist").insert([{ email }]);

              console.log("✅ Supabase response:", data);
              console.error("❌ Supabase error:", error);

              if (error) {
                alert("Something went wrong. Please try again.");
              } else {
                alert("You're on the waitlist!");
                form.reset();

                // refresh the count immediately after new submission
                const { count } = await supabase
                  .from("Waitlist")
                  .select("*", { count: "exact", head: true });
                setWaitlistCount(count || null);
              }
            }}
            className="flex flex-col md:flex-row justify-center items-center gap-3 max-w-lg mx-auto"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="you@example.com"
              className="p-3 w-full rounded text-black"
            />
            <button
              type="submit"
              className="bg-white text-[#2f1b0c] px-6 py-3 rounded hover:bg-[#f0e8dc] font-semibold"
            >
              Join Now
            </button>
          </form>
        </section>

        {/* the rest of your homepage stays unchanged... */}

  <section className="text-center px-6 py-20 bg-white">
          <h1 className="text-5xl font-bold font-serif mb-6">
            Invest in Casks of Fine Whisky
          </h1>
          <p className="text-lg max-w-2xl mx-auto mb-8">
            The Cask Registry connects investors with carefully selected Scotch whisky casks. Enjoy full ownership, transparency, and a premium experience.
          </p>
          <Link
            href="/register"
            className="bg-[#2f1b0c] text-white px-6 py-3 rounded-lg hover:bg-[#442c1c] transition"
          >
            Register a Cask
          </Link>
        </section>

        {/* Investment Steps */}
        <section className="py-16 bg-[#f0e8dc]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8 px-6 text-center">
            {[
              {
                title: "1. Register",
                desc: "Add your cask to our secure database with a unique ID and optional image.",
              },
              {
                title: "2. Track",
                desc: "Monitor your cask’s status, warehouse location, and fill date over time.",
              },
              {
                title: "3. Authenticate",
                desc: "Get verified proof of ownership and future blockchain-backed history.",
              },
            ].map((step) => (
              <div key={step.title} className="bg-white p-6 rounded-xl shadow">
                <h3 className="text-xl font-bold mb-2 font-serif">{step.title}</h3>
                <p className="text-sm">{step.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Benefits Section */}
        <section className="bg-white py-20 px-6 text-center">
  <p className="text-sm uppercase tracking-widest text-gray-500 mb-2">
    Grow Your Knowledge and Returns
  </p>
  <h2 className="text-4xl font-serif font-bold mb-12">
    Your Whisky Investment Partner
  </h2>

  <div className="max-w-6xl mx-auto grid gap-12 md:grid-cols-4 text-[#2f1b0c]">
    {[
      {
        icon: "/icons/fine-rare.png",
        title: "Fine & Rare",
        text: "For over 14 years we’ve helped clients invest in spirits and wine, building a reputation for sourcing the most sought after casks on the market.",
      },
      {
        icon: "/icons/hands-off.png",
        title: "Truly Hands-Off",
        text: "Whisky casks are a medium-long term investment, requiring little-to-no ongoing management — just time to mature and appreciate in value.",
      },
      {
        icon: "/icons/high-performance.png",
        title: "High Performing Asset",
        text: "Casks can diversify and strengthen a balanced portfolio with potential for strong returns.",
      },
      {
        icon: "/icons/financially-minded.png",
        title: "Financially Minded",
        text: "Whisky is a time-tested alternative asset class with increasing global appeal among investors.",
      },
    ].map((item, index) => (
      <div
        key={item.title}
        className="flex flex-col items-center opacity-0 animate-fade-in animation-delay"
        style={{ animationDelay: `${index * 150}ms`, animationFillMode: 'forwards' }}
      >
        <img
          src={item.icon}
          alt={item.title}
          className="h-40 w-auto mb-4"
        />
        <h3 className="text-lg font-bold font-serif mb-2">{item.title}</h3>
        <p className="text-sm text-gray-700">{item.text}</p>
      </div>
    ))}
  </div>
</section>


        {/* Image + Text Section */}
        <section className="py-16 px-6 bg-[#f8f3e9]">
          <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-12 items-center">
            <Image
              src="/images/logo.jpg"
              alt="Cask logo"
              width={600}
              height={400}
              className="rounded-xl shadow"
            />
            <div>
              <h3 className="text-2xl font-bold font-serif mb-4">Full Cask Transparency</h3>
              <p className="mb-4">
                Each cask registered includes distillery name, fill date, type, and warehouse location. Optional image upload ensures authenticity.
              </p>
              <Link
                href="/cask-lookup"
                className="underline text-[#2f1b0c] font-medium"
              >
                Try Cask Lookup
              </Link>
            </div>
          </div>
        </section>

        {/* Call to Action */}
        <section className="bg-[#2f1b0c] text-white py-20 text-center">
          <h2 className="text-4xl font-serif font-bold mb-6">Get Started Today</h2>
          <p className="mb-6">
            Register your whisky cask now and secure its place in the global registry.
          </p>
          <Link
            href="/register"
            className="bg-white text-[#2f1b0c] px-6 py-3 rounded-lg font-semibold hover:bg-[#f0e8dc]"
          >
            Register a Cask
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
