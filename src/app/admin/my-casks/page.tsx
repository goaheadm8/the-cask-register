'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../lib/supabaseClient';
import Navbar from '../../components/Navbar';
import Footer from '../../components/Footer';
import React from 'react';

export default function AdminMyCasksPage() {
  const [loading, setLoading] = useState(true);
  const [authorized, setAuthorized] = useState(false);
  const [casks, setCasks] = useState<any[]>([]);
  const [filters, setFilters] = useState({
    status: '',
    distillery: '',
    owner: '',
    warehouse: '',
    search: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', distillery: '', owner: '', warehouse: '', search: '' });
  };

  useEffect(() => {
    const fetchCasks = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single();

      if (profile?.role !== 'admin') {
        setAuthorized(false);
        setLoading(false);
        return;
      }

      setAuthorized(true);

      const { data: ownerships, error: ownershipError } = await supabase
        .from('cask_ownership')
        .select('cask_id, owner_id, warehouse_id,warehouses(name), profiles(full_name), brokers(name)')
        .order('created_at', { ascending: false });

      if (ownershipError) {
        console.error('Error fetching ownerships:', ownershipError);
        setLoading(false);
        return;
      }

      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('id, full_name');

      if (profilesError) {
        console.error('Error fetching profiles:', profilesError);
        setLoading(false);
        return;
      }

      const caskIds = ownerships.map(o => o.cask_id);

      const { data: caskDetails, error: caskError } = await supabase
        .from('casks')
        .select('id, distillery, cask_identifier, current_status, fill_date, cask_type');

      if (caskError) {
        console.error('Error fetching casks:', caskError);
        setLoading(false);
        return;
      }

      const { data: valuations, error: valuationsError } = await supabase
        .from('cask_valuations')
        .select('cask_id, valuation_amount')
        .order('valuation_date', { ascending: false });

      if (valuationsError) {
        console.error('Error fetching valuations:', valuationsError);
        setLoading(false);
        return;
      }

      const enriched = ownerships.map(own => {
        const cask = caskDetails.find(c => c.id === own.cask_id) || {};
        const valuation = valuations.find(v => v.cask_id === own.cask_id);
        return {
          ...own,
          owner_name: profiles.find(p => p.id === own.owner_id)?.full_name || 'Unknown',
          casks: cask,
          valuation: valuation?.valuation_amount || 0
        };
      });

      setCasks(enriched);
      setLoading(false);
    };

    fetchCasks();
  }, []);

  const filteredCasks = casks.filter(c => {
    return (
      (filters.status === '' || c.casks?.current_status === filters.status) &&
      (filters.distillery === '' || c.casks?.distillery?.toLowerCase().includes(filters.distillery.toLowerCase())) &&
      (filters.owner === '' || c.owner_id?.toLowerCase().includes(filters.owner.toLowerCase())) &&
      (filters.warehouse === '' || c.warehouse_id?.toLowerCase().includes(filters.warehouse.toLowerCase())) &&
      (filters.search === '' || c.owner_name?.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  if (loading) return <p className="text-center pt-32">Loading...</p>;

  if (!authorized) {
    return (
      <>
        <Navbar />
        <main className="pt-28 pb-20 max-w-3xl mx-auto text-center text-red-600">
          <h1 className="text-2xl font-bold">Access Denied</h1>
          <p className="mt-4">You do not have permission to view this page.</p>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 max-w-7xl mx-auto px-6 text-black">
        <h1 className="text-3xl font-bold mb-6">Admin View: All Casks</h1>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
          <select name="status" value={filters.status} onChange={handleFilterChange} className="border rounded p-2">
            <option value="">All Statuses</option>
            <option value="in_storage">In Storage</option>
            <option value="for_sale">For Sale</option>
            <option value="verified">Verified</option>
          </select>

          <input type="text" name="distillery" value={filters.distillery} onChange={handleFilterChange} placeholder="Filter by Distillery" className="border rounded p-2" />

          <input type="text" name="owner" value={filters.owner} onChange={handleFilterChange} placeholder="Filter by Owner ID" className="border rounded p-2" />

          <input type="text" name="warehouse" value={filters.warehouse} onChange={handleFilterChange} placeholder="Filter by Warehouse ID" className="border rounded p-2" />

          <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search by User Name" className="border rounded p-2" />

          <button onClick={clearFilters} className="border p-2 rounded bg-gray-100 hover:bg-gray-200">Clear Filters</button>
        </div>

        {filteredCasks.length === 0 ? (
          <p className="text-gray-600">No casks found matching your filters.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCasks.map((ownership) => (
              <div key={ownership.cask_id} className="flex border p-4 bg-white rounded shadow hover:shadow-lg transition-all">
              <div className="flex-1 pr-4">
                <p className="font-semibold">{ownership.casks?.distillery || 'Unknown Distillery'}</p>
                <p className="text-sm text-gray-600">Cask ID: {ownership.casks?.cask_identifier || 'N/A'}</p>
                <p className="text-sm text-gray-600">Cask Type: {ownership.casks?.cask_type || 'N/A'}</p>
                <p className="text-sm text-gray-600">Warehouse: {ownership.warehouses?.name || 'N/A'}</p>
                <p className="text-sm text-gray-500">Broker: {ownership.brokers?.name}</p>
                <p className="text-sm text-gray-600">Year: {ownership.casks?.fill_date ? new Date(ownership.casks.fill_date).getFullYear() : 'N/A'}</p>
                <p className="text-sm text-gray-600">Est. Valuation: £{ownership.valuation.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Owner: {ownership.owner_name}</p>
                <StatusBadge status={ownership.casks?.current_status || 'unknown'} />
              </div>
              <div className="w-32 flex-shrink-0">
                <img src="/images/whisky-cask-generic2.png" alt="Whisky Cask" className="w-full h-auto object-contain" />
              </div>
            </div>
            ))}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}

function StatusBadge({ status }: { status: string }) {
  let color = 'bg-gray-300 text-gray-800';
  if (status === 'in_storage') color = 'bg-blue-100 text-blue-800';
  if (status === 'for_sale') color = 'bg-yellow-100 text-yellow-800';
  if (status === 'verified') color = 'bg-green-100 text-green-800';

  return (
    <span className={`inline-block mt-2 px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}
