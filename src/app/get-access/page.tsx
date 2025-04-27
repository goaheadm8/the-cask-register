'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Tooltip from '../components/Tooltip';
import { supabase } from '../../lib/supabaseClient';

export default function GetAccessPage() {
    const [role, setRole] = useState<'broker' | 'warehouse' | 'collector' | 'distillery'>('broker');
    const [formData, setFormData] = useState({});
    const [message, setMessage] = useState<string | null>(null);
  
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({ ...prev, [name]: value }));
    };
  
    const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      setMessage(null);
  
      const payload = {
        role,
        ...formData
      };
  
      const { error } = await supabase.from('access_requests').insert([payload]);
  
      if (error) {
        setMessage('There was an error submitting your request.');
        console.error(error);
      } else {
        setMessage('Submitted successfully!');
      }
    };
  return (
    <>
      <Navbar />
      <main className="bg-white text-black pt-28 px-6 pb-20 max-w-3xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-10 text-center">Get Access</h1>

        {/* Role Selection */}
        <div className="flex justify-center gap-4 mb-8 flex-wrap">
          {[{ key: 'broker', tip: 'For professionals handling cask sales, verification, and resale support.' }, { key: 'warehouse', tip: 'For bonded facilities that handle storage, movement, and re-gauging.' }, { key: 'collector', tip: 'For individuals or investors seeking to verify and track their casks.' }, { key: 'distillery', tip: 'For producers interested in event logging and record support.' }].map(({ key, tip }) => (
            <Tooltip key={key} content={tip}>
              <button
                className={`px-4 py-2 rounded-full font-semibold transition border ${
                  role === key ? 'bg-[#2f1b0c] text-white' : 'border-gray-300 text-gray-700'
                }`}
                onClick={() => setRole(key as 'broker' | 'warehouse' | 'collector' | 'distillery')}
              >
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </button>
            </Tooltip>
          ))}
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {role === 'broker' && (
            <>
              <input type="text" name="company" placeholder="Company Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="contact" placeholder="Contact Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="clients" placeholder="Number of Clients" onChange={handleChange} className="w-full p-2 border rounded" />
              <select name="interest" onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select area of interest</option>
                    <option value="onboarding">Client Onboarding</option>
                    <option value="certificates">Ownership Certificates</option>
                    <option value="valuation">Valuation Reports</option>
                    <option value="resale">Resale Support</option>
                    <option value="other">Other</option>
              </select>
            </>
          )}

          {role === 'warehouse' && (
            <>
              <input type="text" name="warehouse" placeholder="Warehouse Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded" />
              <select name="integration" onChange={handleChange} className="w-full p-2 border rounded">
                    <option value="">Select area of interest</option>
                    <option value="custodyLogs">Submitting Custody Logs</option>
                    <option value="audit">Audit Tools</option>
                    <option value="integration">API/CSV Integration</option>
                    <option value="other">Other</option>
              </select>
              <input type="email" name="email" placeholder="Contact Email" onChange={handleChange} className="w-full p-2 border rounded" required />
            </>
          )}

          {role === 'collector' && (
            <>
              <input type="text" name="name" placeholder="Your Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="email" name="email" placeholder="Email" onChange={handleChange} className="w-full p-2 border rounded" required />
              <select name="owner" onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Do you currently own a cask?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
              <select name="interest" onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Select area of interest</option>
                <option value="verification">Cask Verification</option>
                <option value="dashboard">Portfolio Dashboard</option>
                <option value="valuation">Valuation Tools</option>
                <option value="exit">Exit Strategy Insights</option>
                <option value="other">Other</option>
              </select>
            </>
          )}

          {role === 'distillery' && (
            <>
              <input type="text" name="distillery" placeholder="Distillery Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="contact" placeholder="Contact Person" onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="email" name="email" placeholder="Contact Email" onChange={handleChange} className="w-full p-2 border rounded" required />
              <select name="interest" onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Interest</option>
                <option value="event-logging">Event Logging</option>
                <option value="blockchain-anchor">Blockchain Anchoring</option>
                <option value="ownership-support">Ownership Verification</option>
                <option value="other">Other</option>
              </select>
            </>
          )}

          <div className="text-center">
            <button
              type="submit"
              className="bg-[#2f1b0c] text-white py-2 px-6 rounded hover:bg-[#442c1c] transition-all hover:scale-105"
            >
              Submit
            </button>
          </div>

          {message && <p className="text-green-600 mt-2 text-center">{message}</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
