'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Link from 'next/link';
import React from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session?.user) {
        router.push('/login');
      } else {
        setUser(session.user);
      }
      setLoading(false);
    };
    checkSession();
  }, [router]);

  if (loading) return <p className="text-center mt-20">Loading...</p>;

  return (
    <>
      <Navbar />
      <main className="pt-28 pb-20 px-6 max-w-6xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-6">My CaskMark</h1>

        {/* Casks Section */}
        <h2 className="text-xl font-semibold mb-4 mt-8">My Casks</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            <Card title="Register Cask" href="/register-cask" desc="Submit a new cask for verification." />
          <Card title="View and Manage" href="/my-casks" desc="View casks you've verified." />
          <Card title="Submit Event" href="/submit-event" desc="Log purchase/sale or changes in cask status." />
          <Card title="Verification Requests" href="/verifications" desc="Track casks you've requested verification for." />
        </div>

        {/* Account Section */}
        <h2 className="text-xl font-semibold mb-4 mt-12">Account Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="My Account" href="/account" desc="Update your profile and contact information." />
        </div>

        {/* Payments Section */}
        <h2 className="text-xl font-semibold mb-4 mt-12">Payment Details</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="Payment Details" href="/billing" desc="View invoices and update payment methods." />
        </div>

        {/* Sign Out */}
        <h2 className="text-xl font-semibold mb-4 mt-12">Other</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          <Card title="Get Support" href="/support" desc="Need help? Contact our team." />
          <Card title="Sign Out" href="/logout" desc="Securely sign out of your account." />
        </div>
      </main>
      <Footer />
    </>
  );
}

function Card({ title, href, desc }: { title: string; href: string; desc: string }) {
  return (
    <Link href={href} className="border rounded-lg p-6 bg-white shadow hover:shadow-lg transition-all hover:scale-[1.01]">
      <h2 className="text-xl font-semibold mb-1">{title}</h2>
      <p className="text-sm text-gray-600">{desc}</p>
    </Link>
  );
}
