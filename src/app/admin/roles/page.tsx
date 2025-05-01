'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import React from 'react';

export default function RoleRequestsPage() {
  const [requests, setRequests] = useState<Array<{
    id: number;
    user_id: string; // ✅ UUIDs are strings
    requested_role: string;
    status: string;
    notes: string | null;
    created_at: string;
    profiles: { full_name: string; email: string }; // ✅ Not an array
}>>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRequests = async () => {
      const { data, error } = await supabase
        .from('role_requests')
        .select(`id, user_id, requested_role, status, notes, created_at, profiles(full_name, email)`)
        .eq('status', 'pending')
        .order('created_at', { ascending: false });

      if (!error) setRequests(data);
      setLoading(false);
    };

    fetchRequests();
  }, []);

  const handleAction = async (id, action) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase
      .from('role_requests')
      .update({ status: action, reviewed_by: user.id })
      .eq('id', id);

    if (!error && action === 'approved') {
      const req = requests.find(r => r.id === id);
      if (req) {
        await supabase.from('profiles').update({ role: req.requested_role }).eq('id', req.user_id);
      }
    }

    setRequests(prev => prev.filter(r => r.id !== id));
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 px-6 pb-20 max-w-5xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Pending Role Requests</h1>

        {loading ? <p>Loading...</p> : (
          requests.length === 0 ? <p className="text-center">No pending requests.</p> : (
            <div className="space-y-6">
              {requests.map((req) => (
                <div key={req.id} className="border p-4 rounded shadow bg-white">
                  <p><strong>User ID:</strong> {req.user_id}</p>
                  <p><strong>Requested Role:</strong> {req.requested_role}</p>
                  <p><strong>Submitted:</strong> {new Date(req.created_at).toLocaleString()}</p>
                  <div className="flex gap-4 mt-4">
                    <button onClick={() => handleAction(req.id, 'approved')} className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700">Approve</button>
                    <button onClick={() => handleAction(req.id, 'rejected')} className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">Reject</button>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </main>
      <Footer />
    </>
  );
}
