'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';

type Option = {
  id: string;
  name: string;
};

export default function RegisterCaskPage() {
  const [distilleries, setDistilleries] = useState<Option[]>([]);
  const [brokers, setBrokers] = useState<Option[]>([]);
  const [warehouses, setWarehouses] = useState<Option[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const [formData, setFormData] = useState({
    distillery_id: '',
    distilleryName: '',
    customDistillery: '',
    broker: '',
    customBroker: '',
    warehouse: '',
    customWarehouse: '',
    dateOfPurchase: '',
    purchasePrice: '',
    fillDate: '',
    caskIdentifier: '',
    spiritType: '',
    caskType: '',
    originalFillStrength: '',
    originalVolume: '',
    notes: '',
    documents: null as File | null,
  });

  useEffect(() => {
    const fetchDropdowns = async () => {
      const { data: distilleryData } = await supabase.from('distilleries').select('id,name').order('name');
      const { data: brokerData } = await supabase.from('brokers').select('id,name').order('name');
      const { data: warehouseData } = await supabase.from('warehouses').select('id,name').order('name');

      if (distilleryData) setDistilleries(distilleryData);
      if (brokerData) setBrokers(brokerData);
      if (warehouseData) setWarehouses(warehouseData);
    };

    fetchDropdowns();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, files } = e.target as HTMLInputElement;

    if (files) {
      setFormData(prev => ({ ...prev, [name]: files[0] }));
    } else {
      if (name === 'distillery_id') {
        if (value === 'Other') {
          setFormData(prev => ({ ...prev, distillery_id: 'Other', distilleryName: '', customDistillery: '' }));
        } else {
          const selected = distilleries.find(d => d.id === value);
          setFormData(prev => ({ ...prev, distillery_id: value, distilleryName: selected?.name || '', customDistillery: '' }));
        }
      } else {
        setFormData(prev => ({ ...prev, [name]: value }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!distilleries.length) {
      alert('Dropdowns still loading, please wait.');
      return;
    }
    try {
        console.log('Submitting formData:', formData);

      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw userError || new Error('No authenticated user found');

      const caskPayload: any = {
        distillery_id: formData.distillery_id && formData.distillery_id !== 'Other' ? formData.distillery_id : null,
 // Use the selected ID, or null if nothing selected initially
        distillery: formData.distillery_id === 'Other' ? formData.customDistillery : formData.distilleryName,
        distillery_custom_name: formData.distillery_id === 'Other' ? formData.customDistillery : null,
        spirit_type: formData.spiritType,
        fill_date: formData.fillDate,
        cask_type: formData.caskType,
        cask_identifier: formData.caskIdentifier,
        original_fill_strength: formData.originalFillStrength,
        original_volume_litres: formData.originalVolume,
        notes: formData.notes,
      };

      const { data: newCask, error: caskError } = await supabase.from('casks').insert([caskPayload]).select().single();

      if (caskError) throw caskError;
      const caskId = newCask.id;
      console.log('Inserted cask with ID:', caskId);

      // 4. Upload documents (now that caskId exists!) ✅
    let documentUrl = '';
    if (formData.documents) {
      const originalFileName = formData.documents.name;
      const filePath = `CaskUploadedDocs/${caskId}/${originalFileName}`;

      const { error: uploadError } = await supabase
        .storage
        .from('cask-documents')
        .upload(filePath, formData.documents);

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase
        .storage
        .from('cask-documents')
        .getPublicUrl(filePath);

      documentUrl = publicUrlData.publicUrl;
    }



      const ownershipPayload = {
        cask_id: caskId,
        owner_id: userData.user.id,
        broker_id: formData.broker && formData.broker !== 'Other' ? formData.broker : null,
        warehouse_id: formData.warehouse && formData.warehouse !== 'Other' ? formData.warehouse : null,
        distillery_id: formData.distillery_id && formData.distillery_id !== 'Other' ? formData.distillery_id : null,
        price_paid: formData.purchasePrice ? parseFloat(formData.purchasePrice) : null,
        date_of_purchase: formData.dateOfPurchase,
        receipt_url: documentUrl,
        notes: formData.notes +
          (formData.customBroker ? ` Broker: ${formData.customBroker}.` : '') +
          (formData.customWarehouse ? ` Warehouse: ${formData.customWarehouse}.` : ''),
      };

      const { error: ownershipError } = await supabase.from('cask_ownership').insert([ownershipPayload]);
      if (ownershipError) throw ownershipError;

      const { error: eventError } = await supabase.from('cask_events').insert([{
        cask_id: caskId,
        event_type: 'registered',
        event_date: new Date(),
        event_actor: userData.user.id,
        notes: 'Initial registration of the cask.',
      }]);
      if (eventError) throw eventError;

      setShowSuccess(true);
    } catch (err) {
      console.error('Error during registration:', err);
      alert('Something went wrong. Please try again.');
    }
  };
  return (
    <>
      <Navbar />
      <main className="pt-28 px-6 pb-20 max-w-2xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Register New Cask</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Distillery Selection */}
          <div>
            <label htmlFor="distillery_id" className="block font-semibold mb-1">Distillery</label>
            <select
              id="distillery_id"
              name="distillery_id"
              value={formData.distillery_id}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            >
              <option value="">Select a distillery</option>
              {distilleries.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>

            {formData.distillery_id === 'Other' && (
              <div className="mt-2">
                <label htmlFor="customDistillery" className="block font-semibold mb-1">Custom Distillery Name</label>
                <input
                  id="customDistillery"
                  type="text"
                  name="customDistillery"
                  value={formData.customDistillery}
                  placeholder="Enter distillery name"
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                />
              </div>
            )}
          </div>

          {/* Broker Selection */}
          <div>
            <label htmlFor="broker" className="block font-semibold mb-1">Broker</label>
            <select id="broker" name="broker" value={formData.broker} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select a broker</option>
              {brokers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              <option value="Other">Other</option>
            </select>
            {formData.broker === 'Other' && (
              <div className="mt-2">
                <label htmlFor="customBroker" className="block font-semibold mb-1">Custom Broker Name</label>
                <input 
                  id="customBroker" 
                  type="text" 
                  name="customBroker"
                  value={formData.customBroker} 
                  placeholder="Enter broker name" 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded" 
                />
              </div>
            )}
          </div>

          {/* Warehouse Selection */}
          <div>
            <label htmlFor="warehouse" className="block font-semibold mb-1">Warehouse</label>
            <select id="warehouse" name="warehouse" value={formData.warehouse} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select a warehouse</option>
              {warehouses.map(w => (
                <option key={w.id} value={w.id}>
                  {w.name}
                </option>
              ))}
              <option value="Other">Other</option>
            </select>

            {formData.warehouse === 'Other' && (
              <div className="mt-2">
                <label htmlFor="customWarehouse" className="block font-semibold mb-1">Custom Warehouse Name</label>
                <input 
                  id="customWarehouse" 
                  type="text" 
                  name="customWarehouse"
                  value={formData.customWarehouse} 
                  placeholder="Enter warehouse name" 
                  onChange={handleChange} 
                  className="w-full p-2 border rounded" 
                />
              </div>
            )}
          </div>

          {/* Purchase Details */}
          <div>
            <label htmlFor="dateOfPurchase" className="block font-semibold mb-1">Date of Purchase</label>
            <input id="dateOfPurchase" type="date" name="dateOfPurchase" value={formData.dateOfPurchase} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <div>
            <label htmlFor="purchasePrice" className="block font-semibold mb-1">Purchase Price (without commission)</label>
            <input id="purchasePrice" type="text" name="purchasePrice" value={formData.purchasePrice} onChange={handleChange} className="w-full p-2 border rounded" placeholder="£" />
          </div>

          {/* Fill Date */}
          <div>
            <label htmlFor="fillDate" className="block font-semibold mb-1">Fill Date / Vintage</label>
            <input id="fillDate" type="date" name="fillDate" value={formData.fillDate} onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          {/* Spirit Type */}
          <div>
            <label htmlFor="spiritType" className="block font-semibold mb-1">Spirit Type</label>
            <select id="spiritType" name="spiritType" value={formData.spiritType} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select spirit type</option>
              <option value="Single Malt">Single Malt</option>
              <option value="Grain">Grain</option>
              <option value="Blend">Blend</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Cask Type */}
          <div>
            <label htmlFor="caskType" className="block font-semibold mb-1">Cask Type</label>
            <select id="caskType" name="caskType" value={formData.caskType} onChange={handleChange} className="w-full p-2 border rounded">
              <option value="">Select cask type</option>
              <option value="Barrel">Barrel</option>
              <option value="Hogshead">Hogshead</option>
              <option value="Butt">Butt</option>
              <option value="Puncheon">Puncheon</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Original Fill Strength */}
          <div>
            <label htmlFor="originalFillStrength" className="block font-semibold mb-1">Original Fill Strength (%)</label>
            <input id="originalFillStrength" type="text" name="originalFillStrength" value={formData.originalFillStrength} onChange={handleChange} className="w-full p-2 border rounded" placeholder="e.g., 63.5%" />
          </div>

          {/* Original Volume */}
          <div>
            <label htmlFor="originalVolume" className="block font-semibold mb-1">Original Volume (litres)</label>
            <input id="originalVolume" type="text" name="originalVolume" value={formData.originalVolume} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Optional" />
          </div>

          {/* Distillery / Cask Identifier */}
          <div>
            <label htmlFor="caskIdentifier" className="block font-semibold mb-1">Distillery / Cask ID</label>
            <input id="caskIdentifier" type="text" name="caskIdentifier" value={formData.caskIdentifier} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Enter the unique identifier" />
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block font-semibold mb-1">Notes (optional)</label>
            <textarea id="notes" name="notes" value={formData.notes} onChange={handleChange} className="w-full p-2 border rounded" placeholder="Any additional information about this cask" />
          </div>

          {/* Upload Documents */}
          <div>
            <label htmlFor="documents" className="block font-semibold mb-1">Upload Receipt / Documentation (optional)</label>
            <input id="documents" type="file" name="documents" onChange={handleChange} className="w-full p-2 border rounded" />
          </div>

          <button type="submit" className="bg-[#2f1b0c] text-white py-2 px-6 rounded hover:bg-[#442c1c] transition-all hover:scale-105 w-full">
            Register Cask
          </button>
        </form>
      </main>

      {showSuccess && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-8 text-center max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">🎉 Cask Registered!</h2>
            <p className="mb-6">Your cask has been successfully added to the system.</p>
            <button
              onClick={() => setShowSuccess(false)}
              className="bg-[#2f1b0c] text-white py-2 px-6 rounded hover:bg-[#442c1c] transition-all hover:scale-105 w-full"
            >
              Close
            </button>
          </div>
        </div>
      )}
      <Footer />
    </>
  );
}