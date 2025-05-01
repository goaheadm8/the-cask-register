'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';

export default function AccountPage() {
  const [profile, setProfile] = useState({
    full_name: '',
    phone: '',
    address: '',
    country: '',
    currency: 'GBP',
    notes: '',
    role_request: '',
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) return;

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (data) setProfile({
        full_name: data.full_name || '',
        phone: data.phone || '',
        address: data.address || '',
        country: data.country || '',
        currency: data.currency || 'GBP',
        notes: data.notes || '',
        role_request: data.role_request || '',
      });

      setLoading(false);
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('profiles')
      .upsert({
        id: user.id,
        ...profile
      });

    if (error) {
      setMessage('Failed to save changes.');
    } else {
      setMessage('Profile updated successfully!');
    }
    setSaving(false);
  };

  if (loading) return <p className="text-center pt-32">Loading your profile...</p>;

  return (
    <>
      <Navbar />
      <main className="pt-28 px-6 pb-20 max-w-2xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">My Account</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block font-semibold mb-1">Full Name</label>
            <input name="full_name" value={profile.full_name} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Phone Number</label>
            <input name="phone" value={profile.phone} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Address</label>
            <textarea name="address" value={profile.address} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Country</label>
            <input name="country" value={profile.country} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>
          <div>
            <label className="block font-semibold mb-1">Preferred Currency</label>
            <select name="currency" value={profile.currency} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="Other">Other</option>
            </select>
          </div>
          <div>
            <label className="block font-semibold mb-1">Notes</label>
            <textarea name="notes" value={profile.notes} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label className="block font-semibold mb-1">Request Access Role</label>
            <select name="role_request" value={profile.role_request} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select a role</option>
              <option value="collector">Collector</option>
              <option value="broker">Broker</option>
              <option value="warehouse">Warehouse</option>
              <option value="distillery">Distillery</option>
            </select>
            <p className="text-sm text-gray-500 mt-1">This request will be reviewed by an admin.</p>
          </div>

          <button type="submit" className="bg-[#2f1b0c] text-white py-2 px-6 rounded hover:bg-[#442c1c] transition-all hover:scale-105 w-full">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>

          {message && <p className="text-center text-sm text-green-600 mt-4">{message}</p>}
        </form>
      </main>
      <Footer />
    </>
  );
}
