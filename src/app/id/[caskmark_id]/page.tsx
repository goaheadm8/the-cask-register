// app/id/[caskmark_id]/page.tsx
import { supabase } from '../../../lib/supabaseClient';
import { notFound } from 'next/navigation';
import Navbar from "../../components/Navbar";
import Footer from "../../components/Footer";

// Define type for ownership history entries
interface OwnershipHistoryEntry {
  owner_id: string;
  change_date: string | null;
}

export default async function CaskmarkIdPage({ params }: { params: { caskmark_id: string } }) {
  // Get caskmark record
  const { data: caskmark, error: caskmarkError } = await supabase
    .from('caskmark')
    .select('cask_id, caskmark_id')
    .eq('caskmark_id', params.caskmark_id)
    .single();

  if (!caskmark || caskmarkError) {
    console.error('Error fetching caskmark:', caskmarkError);
    return notFound();
  }

  // Get cask details
  const { data: cask, error: caskError } = await supabase
    .from('casks')
    .select('id, fill_date, cask_type, distillery_id')
    .eq('id', caskmark.cask_id)
    .single();

  if (!cask || caskError) {
    console.error('Error fetching cask:', caskError);
    return notFound();
  }

  // Get distillery details
  const { data: distillery } = await supabase
    .from('distilleries')
    .select('name, region, country_decode')
    .eq('id', cask.distillery_id)
    .single();

  // Get original measurement (ABV, volume)
  const { data: regauge } = await supabase
    .from('cask_regauges')
    .select('volume_litres, strength_abv, loa')
    .eq('cask_id', cask.id)
    .eq('measure_type', 'original')
    .single();

  // Format dates
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'Unknown';
    try {
      return new Date(dateString).toLocaleDateString('en-GB', {
        day: '2-digit',
        month: 'short',
        year: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Get ownership history
  try {
    const { data: ownership_history } = await supabase
      .from('cask_ownership_history')
      .select('owner_id, change_date')
      .eq('cask_id', cask.id)
      .order('change_date', { ascending: false });
    
    // Complete page with existing Navbar and Footer components
    return (
      <div className="min-h-screen flex flex-col">
        {/* Use existing Navbar component */}
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow bg-amber-50/30 pt-24">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm my-8">
            <div className="border-l-4 border-amber-600 pl-4 mb-6">
              <h1 className="text-3xl font-bold text-amber-900">CaskMark ID: {caskmark.caskmark_id}</h1>
              <p className="text-gray-600 mt-1">Verified authentic cask</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-amber-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Cask Details
                </h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Distillery:</span>
                    <span className="font-medium">{distillery?.name || 'Unknown'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium">{distillery?.region || 'Unknown'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{distillery?.country_decode || 'Unknown'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Fill Date:</span>
                    <span className="font-medium">{formatDate(cask.fill_date)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Cask Type:</span>
                    <span className="font-medium">{cask.cask_type || 'Unknown'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Measurements
                </h2>
                {regauge ? (
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Initial ABV:</span>
                      <span className="font-medium">{regauge.strength_abv}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Initial Volume:</span>
                      <span className="font-medium">{regauge.volume_litres}L</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">LOA:</span>
                      <span className="font-medium">{regauge.loa}</span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No measurement data available</p>
                )}
              </div>
            </div>

            <div className="bg-amber-50 p-6 rounded-lg mb-6">
              <h2 className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
                </svg>
                Ownership History
              </h2>
              {ownership_history?.length ? (
                <div className="overflow-hidden rounded-md">
                  <table className="min-w-full divide-y divide-amber-200">
                    <thead className="bg-amber-100">
                      <tr>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">Owner ID</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-amber-900 uppercase tracking-wider">Date</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-amber-100">
                      {ownership_history.map((entry: OwnershipHistoryEntry, index: number) => (
                        <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-amber-50'}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{entry.owner_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(entry.change_date)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <p className="text-gray-500 italic">No ownership history found</p>
              )}
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start">
              <svg className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-800 font-medium">Verified Authentic</p>
                <p className="text-green-700 text-sm mt-1">This cask has been verified by CaskMark's secure authentication system. The details displayed here have been cryptographically proven and cannot be altered.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Use existing Footer component */}
        <Footer />
      </div>
    );
  } catch (error) {
    // If the table doesn't exist, continue without ownership history
    console.error('Error fetching ownership history:', error);
    
    // Render without ownership history section (simplified version)
    return (
      <div className="min-h-screen flex flex-col">
        {/* Use existing Navbar component */}
        <Navbar />

        {/* Main Content (without ownership history) */}
        <main className="flex-grow bg-amber-50/30 pt-24">
          <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-sm my-8">
            <div className="border-l-4 border-amber-600 pl-4 mb-6">
              <h1 className="text-3xl font-bold text-amber-900">CaskMark ID: {caskmark.caskmark_id}</h1>
              <p className="text-gray-600 mt-1">Verified authentic cask</p>
            </div>

            <div className="grid md:grid-cols-2 gap-8 mb-8">
              <div className="bg-amber-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                  </svg>
                  Cask Details
                </h2>
                <ul className="space-y-3">
                  <li className="flex justify-between">
                    <span className="text-gray-600">Distillery:</span>
                    <span className="font-medium">{distillery?.name || 'Unknown'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Region:</span>
                    <span className="font-medium">{distillery?.region || 'Unknown'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Country:</span>
                    <span className="font-medium">{distillery?.country_decode || 'Unknown'}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Fill Date:</span>
                    <span className="font-medium">{formatDate(cask.fill_date)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span className="text-gray-600">Cask Type:</span>
                    <span className="font-medium">{cask.cask_type || 'Unknown'}</span>
                  </li>
                </ul>
              </div>

              <div className="bg-amber-50 p-6 rounded-lg">
                <h2 className="text-xl font-semibold mb-4 text-amber-800 flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5 2a1 1 0 011 1v1h1a1 1 0 010 2H6v1a1 1 0 01-2 0V6H3a1 1 0 010-2h1V3a1 1 0 011-1zm0 10a1 1 0 011 1v1h1a1 1 0 110 2H6v1a1 1 0 11-2 0v-1H3a1 1 0 110-2h1v-1a1 1 0 011-1zM12 2a1 1 0 01.967.744L14.146 7.2 17.5 9.134a1 1 0 010 1.732l-3.354 1.935-1.18 4.455a1 1 0 01-1.933 0L9.854 12.8 6.5 10.866a1 1 0 010-1.732l3.354-1.935 1.18-4.455A1 1 0 0112 2z" clipRule="evenodd" />
                  </svg>
                  Measurements
                </h2>
                {regauge ? (
                  <ul className="space-y-3">
                    <li className="flex justify-between">
                      <span className="text-gray-600">Initial ABV:</span>
                      <span className="font-medium">{regauge.strength_abv}%</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">Initial Volume:</span>
                      <span className="font-medium">{regauge.volume_litres}L</span>
                    </li>
                    <li className="flex justify-between">
                      <span className="text-gray-600">LOA:</span>
                      <span className="font-medium">{regauge.loa}</span>
                    </li>
                  </ul>
                ) : (
                  <p className="text-gray-500 italic">No measurement data available</p>
                )}
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start">
              <svg className="h-5 w-5 text-green-600 mt-0.5 mr-3 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <div>
                <p className="text-green-800 font-medium">Verified Authentic</p>
                <p className="text-green-700 text-sm mt-1">This cask has been verified by CaskMark's secure authentication system. The details displayed here have been cryptographically proven and cannot be altered.</p>
              </div>
            </div>
          </div>
        </main>

        {/* Use existing Footer component */}
        <Footer />
      </div>
    );
  }
}