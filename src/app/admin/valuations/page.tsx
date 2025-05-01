'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';

export default function AdminValuations() {
  const [casks, setCasks] = useState<any[]>([]);
  const [selectedCask, setSelectedCask] = useState('');
  const [valuationAmount, setValuationAmount] = useState('');
  const [valuationDate, setValuationDate] = useState(new Date().toISOString().substring(0, 10));
  const [userEmail, setUserEmail] = useState('');

  useEffect(() => {
    const fetchCasks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        console.error('Not logged in');
        return;
      }

      setUserEmail(session.user.email);

      const { data: casksData } = await supabase
        .from('casks')
        .select('id, distillery');

      setCasks(casksData || []);
    };

    fetchCasks();
  }, []);

  const handleSave = async () => {
    if (!selectedCask || !valuationAmount) return alert('Please fill out all fields.');

    const { error } = await supabase
      .from('cask_valuations')
      .insert([
        {
          cask_id: selectedCask,
          valuation_amount: Number(valuationAmount),
          valuation_date: valuationDate,
        }
      ]);

    if (error) {
      console.error('Error saving valuation:', error);
      alert('Failed to save valuation');
    } else {
      alert('Valuation saved!');
      setSelectedCask('');
      setValuationAmount('');
      setValuationDate(new Date().toISOString().substring(0, 10));
    }
  };

  if (userEmail !== 'youradminemail@example.com') {
    return <p className="text-center mt-20">Access Denied</p>;
  }

  return (
    <div className="max-w-lg mx-auto pt-32">
      <h1 className="text-2xl font-bold mb-6 text-center">Manual Valuation Entry</h1>

      <div className="mb-4">
        <label className="block font-medium">Cask</label>
        <select
          className="w-full p-2 border rounded"
          value={selectedCask}
          onChange={(e) => setSelectedCask(e.target.value)}
        >
          <option value="">Select a Cask</option>
          {casks.map(cask => (
            <option key={cask.id} value={cask.id}>
              {cask.distillery} ({cask.id})
            </option>
          ))}
        </select>
      </div>

      <div className="mb-4">
        <label className="block font-medium">Valuation Amount (£)</label>
        <input
          type="number"
          className="w-full p-2 border rounded"
          value={valuationAmount}
          onChange={(e) => setValuationAmount(e.target.value)}
        />
      </div>

      <div className="mb-6">
        <label className="block font-medium">Valuation Date</label>
        <input
          type="date"
          className="w-full p-2 border rounded"
          value={valuationDate}
          onChange={(e) => setValuationDate(e.target.value)}
        />
      </div>

      <button
        onClick={handleSave}
        className="w-full bg-black text-white py-2 rounded hover:bg-gray-800"
      >
        Save Valuation
      </button>
    </div>
  );
}
