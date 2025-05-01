'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { supabase } from '../../lib/supabaseClient';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface Cask {
  distillery: string;
  caskId: string;
  fillDate: string;
  age: number;
  estimatedValue: number;
  status: string;
  verificationName?: string;
  trustLevel?: string;
}

export default function DashboardPage() {
  const [casks, setCasks] = useState<Cask[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCasksAndValuations = async () => {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
      
        if (sessionError) {
          console.error('Error fetching session:', sessionError.message || sessionError);
          setLoading(false);
          return;
        }
      
        if (!session || !session.user) {
          console.error('No user session found.');
          setLoading(false);
          return;
        }
      
        // Fetch cask ownerships for the current user
        const { data: ownerships, error: ownershipsError } = await supabase
          .from('cask_ownership')
          .select(`
            cask_id,
            owner_id
          `)
          .eq('owner_id', session.user.id);
      
        if (ownershipsError) {
          console.error('Error fetching ownerships:', ownershipsError.message || ownershipsError);
          setLoading(false);
          return;
        }
      
        if (!ownerships || ownerships.length === 0) {
          setCasks([]);
          setLoading(false);
          return;
        }

        // Process each cask to add valuation data
        const enrichedCasks = await Promise.all(
          ownerships.map(async (ownership) => {
            // Fetch the cask details separately
            const { data: caskDetails, error: caskError } = await supabase
              .from('casks')
              .select(`
                distillery,
                fill_date
              `)
              .eq('id', ownership.cask_id)
              .single();
            
            if (caskError) {
              console.error(`Error fetching cask details for ${ownership.cask_id}:`, caskError);
            }
            
            // Fetch verification level
            const { data: verificationData, error: verificationError } = await supabase
              .from('verification_levels')
              .select('name, trust_level')
              .eq('cask_id', ownership.cask_id)
              .maybeSingle();
              
              if (verificationError && Object.keys(verificationError).length > 0 && verificationError.code !== 'PGRST116') {
                console.error(`Error fetching verification for cask ${ownership.cask_id}:`, verificationError);
              }
            
            // Fetch the latest valuation for this cask
            const { data: valuation, error: valuationError } = await supabase
              .from('cask_valuations')
              .select('*')
              .eq('cask_id', ownership.cask_id)
              .order('valuation_date', { ascending: false })
              .limit(1)
              .maybeSingle();

            if (valuationError && valuationError.code !== 'PGRST116') {
              console.error(`Error fetching valuation for cask ${ownership.cask_id}:`, valuationError);
            }
            
            // Calculate age from fill date
            const fillDate = caskDetails?.fill_date ? new Date(caskDetails.fill_date) : new Date();
            const age = new Date().getFullYear() - fillDate.getFullYear();

            return {
              distillery: caskDetails?.distillery || 'Unknown',
              caskId: ownership.cask_id,
              fillDate: caskDetails?.fill_date || 'Unknown',
              age: isNaN(age) ? 0 : age,
              estimatedValue: valuation?.valuation_amount || 0,
              status: caskDetails ? 'Verified' : 'Pending',
              verificationName: verificationData?.name || 'Standard',
              trustLevel: verificationData?.trust_level || 'Medium',
            };
          })
        );

        setCasks(enrichedCasks);
      } catch (error) {
        console.error('Unexpected error in fetchCasksAndValuations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCasksAndValuations();
  }, []);

  const portfolioValue = casks.reduce((acc, cask) => acc + (cask.estimatedValue || 0), 0);

  const chartData = {
    labels: ['2019', '2020', '2021', '2022', '2023', '2024'],
    datasets: [
      {
        label: 'Whisky Casks',
        data: [100, 112, 125, 140, 155, 170],
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'S&P 500',
        data: [100, 95, 120, 135, 145, 160],
        borderColor: 'rgba(54, 162, 235, 1)',
        backgroundColor: 'rgba(54, 162, 235, 0.2)',
      },
      {
        label: 'Gold',
        data: [100, 110, 115, 130, 140, 150],
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      }
    ],
  };

  const getTrustBadgeColor = (trustLevel: string) => {
    switch(trustLevel) {
      case 'Maximum': return 'bg-green-200 text-green-800';
      case 'High': return 'bg-blue-200 text-blue-800';
      case 'Medium': return 'bg-yellow-200 text-yellow-800';
      case 'Low': return 'bg-orange-200 text-orange-800';
      case 'None': return 'bg-red-200 text-red-800';
      default: return 'bg-gray-200 text-gray-800';
    }
  };

  if (loading) return <p className="text-center pt-32">Loading your dashboard...</p>;

  return (
    <>
      <Navbar />
      <main className="bg-white text-black pt-28 pb-20 px-6 max-w-7xl mx-auto">
        {/* Welcome Section */}
        <section className="text-center mb-12">
          <h1 className="text-4xl font-serif font-bold">Welcome back to your Portfolio</h1>
          <p className="text-gray-600 mt-4">Your secure whisky investments, at a glance.</p>
        </section>

        {/* Summary Stats */}
        <section className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="bg-gray-100 p-6 rounded-xl text-center shadow">
            <h2 className="text-3xl font-bold font-serif">{casks.length}</h2>
            <p className="text-gray-600 mt-2">Casks Owned</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl text-center shadow">
            <h2 className="text-3xl font-bold font-serif">£{portfolioValue.toLocaleString()}</h2>
            <p className="text-gray-600 mt-2">Total Value</p>
          </div>
          <div className="bg-gray-100 p-6 rounded-xl text-center shadow">
            <h2 className="text-3xl font-bold font-serif">
              {casks.length > 0 ? `${(casks.reduce((a, c) => a + c.age, 0) / casks.length).toFixed(1)} Years` : 'N/A'}
            </h2>
            <p className="text-gray-600 mt-2">Average Age</p>
          </div>
        </section>

        {/* Casks Table */}
        <section className="mb-20">
          <h2 className="text-2xl font-serif font-bold mb-6">Your Casks</h2>
          {casks.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Distillery</th>
                    <th className="py-2 px-4 border-b">Cask ID</th>
                    <th className="py-2 px-4 border-b">Fill Date</th>
                    <th className="py-2 px-4 border-b">Age</th>
                    <th className="py-2 px-4 border-b">Est. Value</th>
                    <th className="py-2 px-4 border-b">Verification</th>
                  </tr>
                </thead>
                <tbody>
                  {casks.map((cask) => (
                    <tr key={cask.caskId} className="hover:bg-gray-50">
                      <td className="py-2 px-4 border-b">{cask.distillery}</td>
                      <td className="py-2 px-4 border-b">{cask.caskId}</td>
                      <td className="py-2 px-4 border-b">{cask.fillDate}</td>
                      <td className="py-2 px-4 border-b">{cask.age}</td>
                      <td className="py-2 px-4 border-b">£{cask.estimatedValue.toLocaleString()}</td>
                      <td className="py-2 px-4 border-b">
                        <div className="flex items-center gap-2">
                          {cask.verificationName}
                          <span className={`text-xs font-semibold rounded-full px-2 py-1 ${getTrustBadgeColor(cask.trustLevel || '')}`}>
                            {cask.trustLevel}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center py-8 bg-gray-100 rounded-lg">No casks found in your portfolio.</p>
          )}
        </section>

        {/* Value Chart */}
        <section className="mb-20">
          <h2 className="text-2xl font-serif font-bold mb-6">Cask Value vs Markets</h2>
          <div className="bg-gray-100 p-6 rounded-xl">
            <Line data={chartData} />
          </div>
        </section>

        {/* Exit Strategy Section */}
        <section className="mb-20">
          <h2 className="text-2xl font-serif font-bold mb-6">Exit Strategy Options</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gray-100 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2">Sell Cask</h3>
              <p>Estimated Net: <span className="font-bold">£{(portfolioValue * 0.85).toLocaleString()}</span></p>
              <p className="text-gray-600 mt-2">Based on current auction prices after fees.</p>
            </div>
            <div className="bg-gray-100 p-6 rounded-xl">
              <h3 className="text-lg font-bold mb-2">Bottle & Sell</h3>
              <p>Estimated Net: <span className="font-bold">£{(portfolioValue * 2.1).toLocaleString()}</span></p>
              <p className="text-gray-600 mt-2">Including bottling costs and retail markup.</p>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}