'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function MyCasksPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [casks, setCasks] = useState<any[]>([]);
  const [user, setUser] = useState<any>(null);
  const [filters, setFilters] = useState({
    status: '',
    distillery: '',
    caskType: '',
    search: ''
  });

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const clearFilters = () => {
    setFilters({ status: '', distillery: '', caskType: '', search: '' });
  };

  useEffect(() => {
    const fetchCasks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!profile?.role) {
        console.error('Role not found.');
        setLoading(false);
        return;
      }

      let column = '';
      if (['collector', 'admin'].includes(profile.role)) column = 'owner_id';
      else if (profile.role === 'broker') column = 'broker_id';
      else if (profile.role === 'warehouse') column = 'warehouse_id';
      else if (profile.role === 'distillery') column = 'distillery_id';

      if (!column) {
        console.error('No column match for role.');
        setLoading(false);
        return;
      }

      const { data: ownerships, error: ownershipError } = await supabase
        .from('cask_ownership')
        .select(`cask_id, owner_id, broker_id, warehouse_id, distillery_id, 
                 casks!cask_ownership_cask_id_fkey(id, distillery, cask_identifier, cask_type, fill_date, current_status),
                 brokers(name), warehouses(name)`) 
        .eq(column, session.user.id);

      if (ownershipError) {
        console.error('Error fetching casks:', ownershipError);
        setLoading(false);
        return;
      }

      const caskIds = ownerships.map(o => o.cask_id);

      const { data: valuations, error: valuationsError } = await supabase
        .from('cask_valuations')
        .select('cask_id, valuation_amount')
        .in('cask_id', caskIds)
        .order('valuation_date', { ascending: false });

      if (valuationsError) {
        console.error('Error fetching valuations:', valuationsError);
        setLoading(false);
        return;
      }

      const enriched = ownerships.map(o => {
        const valuation = valuations.find(v => v.cask_id === o.cask_id);
        return {
          ...o,
          valuation: valuation?.valuation_amount || 0
        };
      });

      setCasks(enriched);
      setLoading(false);
    };

    fetchCasks();
  }, [router]);

  const filteredCasks = casks.filter(c => {
    return (
      (filters.status === '' || c.casks?.current_status === filters.status) &&
      (filters.distillery === '' || c.casks?.distillery?.toLowerCase().includes(filters.distillery.toLowerCase())) &&
      (filters.caskType === '' || c.casks?.cask_type?.toLowerCase().includes(filters.caskType.toLowerCase())) &&
      (filters.search === '' || c.casks?.cask_identifier?.toLowerCase().includes(filters.search.toLowerCase()))
    );
  });

  if (loading) return <p className="text-center pt-32">Loading casks...</p>;

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6 max-w-7xl mx-auto text-black">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Casks</h1>
          <Link href="/register-cask" className="bg-[#2f1b0c] text-white py-2 px-4 rounded hover:bg-[#442c1c] transition-all">
            Register New Cask
          </Link>
        </div>

        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <select name="status" value={filters.status} onChange={handleFilterChange} className="border rounded p-2">
            <option value="">All Statuses</option>
            <option value="in_storage">In Storage</option>
            <option value="for_sale">For Sale</option>
            <option value="verified">Verified</option>
          </select>
          <input type="text" name="distillery" value={filters.distillery} onChange={handleFilterChange} placeholder="Filter by Distillery" className="border rounded p-2" />
          <input type="text" name="caskType" value={filters.caskType} onChange={handleFilterChange} placeholder="Filter by Cask Type" className="border rounded p-2" />
          <input type="text" name="search" value={filters.search} onChange={handleFilterChange} placeholder="Search Cask ID" className="border rounded p-2" />
          <button onClick={clearFilters} className="border p-2 rounded bg-gray-100 hover:bg-gray-200">Clear Filters</button>
        </div>

        {filteredCasks.length === 0 ? (
          <p className="text-center text-gray-500">You don't have any casks registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredCasks.map((ownership) => (
              <div key={ownership.cask_id} className="flex border rounded-lg p-4 bg-white shadow hover:shadow-lg transition-all hover:scale-[1.01]">
                <div className="flex-1 pr-4">
                  <h2 className="text-xl font-semibold mb-1">{ownership.casks?.distillery || 'Unknown Distillery'}</h2>
                  <p className="text-sm text-gray-600">Cask ID: {ownership.casks?.cask_identifier || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Cask Type: {ownership.casks?.cask_type || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Warehouse: {ownership.warehouses?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-500">Broker: {ownership.brokers?.name || 'N/A'}</p>
                  <p className="text-sm text-gray-600">Year: {ownership.casks?.fill_date ? new Date(ownership.casks.fill_date).getFullYear() : 'N/A'}</p>
                  <p className="text-sm text-gray-600">Est. Valuation: £{ownership.valuation.toLocaleString()}</p>
                  <StatusBadge status={ownership.casks?.current_status || 'unknown'} />
                  <Link href={`/casks/${ownership.cask_id}`} className="inline-block mt-4 text-sm text-[#2f1b0c] hover:underline">
                    View Details →
                  </Link>
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
