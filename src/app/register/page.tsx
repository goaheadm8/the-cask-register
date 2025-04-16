'use client';

import { useState } from "react";
import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import { supabase } from "@/lib/supabaseClient";

export default function RegisterCask() {
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);

    const rawData = {
      cask_id: formData.get("cask_id"),
      distillery: formData.get("distillery"),
      whisky: formData.get("whisky"),
      fill_date: formData.get("fill_date"),
      warehouse: formData.get("warehouse"),
      owner: formData.get("owner"),
    };

    const stringToHash = `${rawData.cask_id}-${rawData.distillery}-${rawData.whisky}-${rawData.fill_date}-${rawData.warehouse}-${rawData.owner}`;
    const encoder = new TextEncoder();
    const data = encoder.encode(stringToHash);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');

    const { error } = await supabase.from("casks").insert([{ ...rawData, hash: hashHex }]);

    if (error) {
      setErrorMessage("There was a problem registering your cask.");
      return;
    }

    setSubmitted(true);
  };

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-6 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md w-full max-w-3xl">
          <h1 className="text-4xl font-bold text-center mb-6">Register Your Cask</h1>

          {submitted ? (
            <div className="text-center">
              <h2 className="text-2xl font-semibold mb-2">Success!</h2>
              <p>Your cask has been registered in the ledger.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {["cask_id", "distillery", "whisky", "fill_date", "warehouse", "owner"].map((field, i) => (
                <div key={i}>
                  <label className="block capitalize font-medium mb-1">
                    {field.replace("_", " ")}
                  </label>
                  <input
                    type={field === "fill_date" ? "date" : "text"}
                    name={field}
                    required={field !== "warehouse" && field !== "owner"}
                    className="w-full p-2 border rounded"
                  />
                </div>
              ))}
              {errorMessage && (
                <p className="text-red-600 text-sm font-medium">{errorMessage}</p>
              )}
              <button
                type="submit"
                className="bg-[#2f1b0c] text-white px-6 py-2 rounded hover:bg-[#442c1c]"
              >
                Register Cask
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
