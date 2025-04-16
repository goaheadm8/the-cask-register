'use client';

import React, { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { supabase } from "../../lib/supabaseClient";

export default function CaskLookup() {
  const [search, setSearch] = useState("");
  const [result, setResult] = useState<any | null>(null);
  const [notFound, setNotFound] = useState(false);

  const handleSearch = async () => {
    const { data, error } = await supabase
      .from("casks")
      .select("*")
      .eq("cask_id", search.trim());

    if (error || !data || data.length === 0) {
      setResult(null);
      setNotFound(true);
    } else {
      setResult(data[0]);
      setNotFound(false);
    }
  };

  // Temporary test fetch to confirm Supabase connection
  useEffect(() => {
    const fetchTest = async () => {
      const { data, error } = await supabase.from("casks").select("*").limit(1);
      console.log("Test data:", data);
      console.log("Test error:", error);
    };
    fetchTest();
  }, []);

  return (
    <>
      <Navbar />
      <main className="min-h-screen p-6 flex justify-center items-center">
        <div className="bg-white/80 backdrop-blur-sm p-8 rounded-xl shadow-md w-full max-w-xl text-center">
          <h1 className="text-4xl font-bold mb-6">Cask Lookup</h1>
          <p className="mb-4">Enter a registered cask ID to view its details.</p>

          <div className="flex gap-2 mb-6">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="e.g. CASK-001"
              className="flex-grow p-2 border rounded"
            />
            <button
              onClick={handleSearch}
              className="bg-[#2f1b0c] text-white px-4 rounded hover:bg-[#442c1c]"
            >
              Search
            </button>
          </div>

          {result && (
            <div className="text-left space-y-1">
              {Object.entries(result).map(([key, value]) => (
                <p key={key}>
                  <strong className="capitalize">{key.replace("_", " ")}:</strong> {value as string}
                </p>
              ))}
            </div>
          )}

          {notFound && <p className="text-red-600 mt-4">No cask found with that ID.</p>}
        </div>
      </main>
      <Footer />
    </>
  );
}
