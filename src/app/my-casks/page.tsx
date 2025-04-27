'use client';

import { useEffect, useState } from 'react';
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

  useEffect(() => {
    const fetchCasks = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      // Fetch user role
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
      if (profile.role === 'broker') column = 'broker_id';
      else if (profile.role === 'warehouse') column = 'warehouse_id';
      else if (profile.role === 'collector') column = 'owner_id';
      else if (profile.role === 'distillery') column = 'distillery_id';

      if (!column) {
        console.error('No column match for role.');
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('casks')
        .select('*')
        .eq(column, session.user.id);

      if (error) {
        console.error('Error fetching casks:', error);
      } else {
        setCasks(data || []);
      }

      setLoading(false);
    };

    fetchCasks();
  }, [router]);

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

        {casks.length === 0 ? (
          <p className="text-center text-gray-500">You don't have any casks registered yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {casks.map((cask) => (
              <div key={cask.id} className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition-all hover:scale-[1.01]">
                <h2 className="text-xl font-semibold mb-1">{cask.distillery_name || 'Unknown Distillery'}</h2>
                <p className="text-sm text-gray-600 mb-2">Cask #: {cask.cask_number || 'N/A'}</p>
                <StatusBadge status={cask.status || 'unknown'} />
                <Link
                  href={`/casks/${cask.id}`}
                  className="inline-block mt-4 text-sm text-[#2f1b0c] hover:underline"
                >
                  View Details →
                </Link>
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
    <span className={`inline-block px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
      {status.replace('_', ' ').toUpperCase()}
    </span>
  );
}
