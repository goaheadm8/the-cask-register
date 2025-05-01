import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import React from "react";

export default function FAQPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen p-6 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md w-full max-w-3xl">
          <h1 className="text-4xl font-bold mb-6 text-center">Frequently Asked Questions</h1>

          <div className="space-y-6 text-left">
            <div>
              <h2 className="text-xl font-semibold">How do I register a cask?</h2>
              <p>Use the Register page to submit your cask details. It will be logged into the database and secured with a cryptographic hash.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">Can I verify a cask is real?</h2>
              <p>Yes, use the Lookup page to search by Cask ID and view ownership and registration info.</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold">What makes this fraud-proof?</h2>
              <p>Each record is hashed using SHA-256 and prepared for optional blockchain storage — meaning cask ownership can’t be tampered with.</p>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
