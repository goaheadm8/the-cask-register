'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { User } from '@supabase/supabase-js';
import { p } from 'framer-motion/client';

export default function SignupPage() {
  const [formData, setFormData] = useState<{
    full_name: string;
    email: string;
    password: string;
    confirmPassword: string;
    role: string;
    services: string[];
    caskheld?: string;
    company?: string;
    focus?: string;
    warehouse?: string;
    location?: string;
    distillery?: string;
    contact?: string;
    phone_number?: string;
    owner?: string;
  }>({
    full_name: '',
    email: '',
    password: '',
    confirmPassword: '',
    services: [],
    caskheld: '',
    contact: '',
    role: '',
    owner: '',
    company: '',
    focus: '',
    warehouse: '',
    location: '',
    distillery: '',
    phone_number: ''
  });

  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleService = (value: string) => {
    setFormData((prev) => {
      const services = Array.isArray(prev.services) ? prev.services : [];
      return {
        ...prev,
        services: services.includes(value)
          ? services.filter((s) => s !== value)
          : [...services, value]
      };
    });
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
  
    if (formData.password !== formData.confirmPassword) {
      setMessage("Passwords don't match");
      return;
    }
  
    setLoading(true);
  
    // Step 1: Sign up
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        data: {
          full_name: formData.full_name,
          role: formData.role,
          phone_number: formData.phone_number,
        },
      },
    });
    console.log("SignUp result:", { data: signUpData, error: signUpError });
  
    if (signUpError) {
      setMessage(signUpError.message);
      setLoading(false);
      return;
    }
  
    // Step 2: Access user ID from signUpData
    const newUser = signUpData?.user;
  
    if (newUser?.id) {
      console.log("User ID from signUp data:", newUser.id);
  
      // Step 3: Build profile payload
      const profilePayload = {
        id: newUser.id,
        full_name: formData.full_name,
        email: formData.email,
        role: formData.role,
        company: formData.company,
        caskheld: formData.caskheld,
        focus: formData.focus,
        warehouse: formData.warehouse,
        location: formData.location,
        distillery: formData.distillery,
        contact: formData.contact,
        phone_number: formData.phone_number,
        verifying_ownership: formData.services.includes("Verifying ownership"),
        issuing_certificates: formData.services.includes("Issuing 3rd party certificates"),
        checking_cask_history: formData.services.includes("Checking Cask History"),
        valuation_reports: formData.services.includes("Generating valuation reports"),
        price_discovery: formData.services.includes("Price Discovery"),
        id_integration: formData.services.includes("CaskMark ID Integration"),
        other_service: formData.services.includes("Other"),
      };
  
      console.log("Payload being upserted:", profilePayload);
  
      // Step 4: Save to profile table
      const { error: profileError } = await supabase
        .from('profiles')
        .upsert(profilePayload, { onConflict: 'id', ignoreDuplicates: false });
  
      if (profileError) {
        console.error('Profile upsert failed:', profileError);
        setMessage('Error saving profile data: ' + profileError.message);
        setLoading(false);
        return;
      }
  
      setMessage('Check your email to confirm your account.');
      setLoading(false);
      // Optionally, you can redirect the user after successful signup
      // router.push('/login');
    } else {
      setMessage('Failed to retrieve user ID after signup.');
      setLoading(false);
    }
  };
  

  return (
    <>
      <Navbar />
      <main className="bg-white text-black pt-28 px-6 pb-20 max-w-xl mx-auto">
        <h1 className="text-4xl font-serif font-bold mb-10 text-center">Create an Account</h1>
        <form onSubmit={handleSignup} className="space-y-6">

          {/* General Information */}
          <input    type="text"     name="full_name"    placeholder="Your Name"    value={formData.full_name}    onChange={handleChange}  className="w-full p-2 border rounded"required/>
          <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleChange} className="w-full p-2 border rounded" required />
          <input type="password" name="password" placeholder="Password" value={formData.password}   onChange={handleChange}   className="w-full p-2 border rounded" required />
          <input type="password" name="confirmPassword" placeholder="Confirm Password" value={formData.confirmPassword}   onChange={handleChange}   className="w-full p-2 border rounded" required />
          <input type="text" name="phone_number" placeholder="Phone Number (optional)" value={formData.phone_number} onChange={handleChange} className="w-full p-2 border rounded" />

          {/* Shared Services Section */}
          <div className="space-y-2">
            <label className="block font-semibold">Which services are you interested in exploring with CaskMark?</label>
            {["Verifying ownership", "Issuing 3rd party certificates", "Checking Cask History", "Generating valuation reports", "Price Discovery", "CaskMark ID Integration", "Other"].map((service) => (
              <label key={service} className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  name="services"
                  value={service}
                  onChange={() => toggleService(service)}
                  checked={formData.services.includes(service)}
                />
                {service}
              </label>
            ))}
          </div>

          {/* Role Selection */}
          <select name="role" value={formData.role} onChange={handleChange} className="w-full p-2 border rounded" required>
            <option value="">Select your role</option>
            <option value="broker">Broker</option>
            <option value="warehouse">Warehouse</option>
            <option value="collector">Collector</option>
            <option value="distillery">Distillery</option>
          </select>

          {/* Role-Specific Questions */}
          {formData.role === 'broker' && (
            <>
              <input type="text" name="company" placeholder="Company Name" onChange={handleChange} className="w-full p-2 border rounded" required />
              <input type="text" name="caskheld" placeholder="Do you hold casks? (Yes/No)" onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="focus" placeholder="Special Focus? (Whisky/Rum/Distilleries/Regions)" onChange={handleChange} className="w-full p-2 border rounded" />
            </>
          )}

          {formData.role === 'warehouse' && (
            <>
              <input type="text" name="warehouse" placeholder="Warehouse Name" onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="location" placeholder="Location" onChange={handleChange} className="w-full p-2 border rounded" />
            </>
          )}

          {formData.role === 'collector' && (
            <>
              <select name="owner" onChange={handleChange} className="w-full p-2 border rounded">
                <option value="">Do you currently own a cask?</option>
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </>
          )}

          {formData.role === 'distillery' && (
            <>
              <input type="text" name="distillery" placeholder="Distillery Name" onChange={handleChange} className="w-full p-2 border rounded" />
              <input type="text" name="contact" placeholder="Contact Person" onChange={handleChange} className="w-full p-2 border rounded" />
            </>
          )}

          <div className="text-center">
            <button type="submit" disabled={loading} className="bg-[#2f1b0c] text-white py-2 px-6 rounded hover:bg-[#442c1c] transition-all hover:scale-105">
              {loading ? 'Signing Up...' : 'Sign Up'}
            </button>
          </div>

          {message && <p className="text-center text-sm text-red-500 mt-2">{message}</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
