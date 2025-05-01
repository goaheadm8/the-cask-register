'use client';

import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import React from 'react';
import { ArrowLeft, ArrowRight, Check, AlertCircle } from 'lucide-react';

type Option = {
  id: string;
  name: string;
};

// Step indicator component
const StepIndicator = ({ currentStep, totalSteps }: { currentStep: number; totalSteps: number }) => {
  return (
    <div className="mb-8">
      <div className="flex justify-between items-center">
        {Array.from({ length: totalSteps }).map((_, index) => (
          <React.Fragment key={index}>
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                index < currentStep 
                  ? 'bg-green-600 text-white'
                  : index === currentStep
                    ? 'bg-[#2f1b0c] text-white'
                    : 'bg-gray-200 text-gray-500'
              }`}>
                {index < currentStep ? (
                  <Check size={18} />
                ) : (
                  <span>{index + 1}</span>
                )}
              </div>
              <span className="text-xs mt-1">
                {index === 0 ? 'Basics' : 
                 index === 1 ? 'Ownership' : 
                 index === 2 ? 'Measurements' : 
                 index === 3 ? 'Documents' : 'Review'}
              </span>
            </div>
            {index < totalSteps - 1 && (
              <div className={`h-1 flex-1 mx-2 ${
                index < currentStep ? 'bg-green-600' : 'bg-gray-200'
              }`} />
            )}
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default function RegisterCaskPage() {
  const [currentStep, setCurrentStep] = useState(0);
  const totalSteps = 5;
  
  const [distilleries, setDistilleries] = useState<Option[]>([]);
  const [brokers, setBrokers] = useState<Option[]>([]);
  const [warehouses, setWarehouses] = useState<Option[]>([]);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    originalLoa: '',
    notes: '',
    currency: 'GBP',
    documents: null as File | null,
    // Regauge fields
    volume: '',
    abv: '',
    loa: '',
    measurement_date: '',
    measurement_notes: '',
    measure_type: 'original', // Default to original
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
      return;
    }
  
    // Special handling for distillery dropdown
    if (name === 'distillery_id') {
      if (value === 'Other') {
        setFormData(prev => ({
          ...prev,
          distillery_id: 'Other',
          distilleryName: '',
          customDistillery: ''
        }));
      } else {
        const selected = distilleries.find(d => d.id === value);
        setFormData(prev => ({
          ...prev,
          distillery_id: value,
          distilleryName: selected?.name || '',
          customDistillery: ''
        }));
      }
      return;
    }
  
    // 👇 Auto-calculate 3rd measurement value
    if (['volume', 'abv', 'loa'].includes(name)) {
      const updated = { ...formData, [name]: value };
  
      const volume = parseFloat(updated.volume || '');
      const abv = parseFloat(updated.abv || '');
      const loa = parseFloat(updated.loa || '');
  
      let newValues: Partial<typeof formData> = {};
  
      if (volume && abv && name !== 'loa') {
        newValues.loa = ((volume * abv) / 100).toFixed(2);
      } else if (loa && abv && name !== 'volume') {
        newValues.volume = (loa / abv * 100).toFixed(2);
      } else if (loa && volume && name !== 'abv') {
        newValues.abv = (loa / volume * 100).toFixed(2);
      }
  
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...newValues
      }));
      return;
    }
    // Auto-calculate LOA logic for original fill
    if (['originalVolume', 'originalFillStrength', 'originalLoa'].includes(name)) {
      const updated = { ...formData, [name]: value };
  
      const origVolume = parseFloat(updated.originalVolume || '');
      const origAbv = parseFloat(updated.originalFillStrength || '');
      const origLoa = parseFloat(updated.originalLoa || '');
  
      let newValues: Partial<typeof formData> = {};
  
      if (origVolume && origAbv && name !== 'originalLoa') {
        newValues.originalLoa = ((origVolume * origAbv) / 100).toFixed(2);
      } else if (origLoa && origAbv && name !== 'originalVolume') {
        newValues.originalVolume = (origLoa / origAbv * 100).toFixed(2);
      } else if (origLoa && origVolume && name !== 'originalFillStrength') {
        newValues.originalFillStrength = (origLoa / origVolume * 100).toFixed(2);
      }
  
      setFormData(prev => ({
        ...prev,
        [name]: value,
        ...newValues
      }));
      return;
    }
    // Default update
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(prev => prev + 1);
      window.scrollTo(0, 0);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
      window.scrollTo(0, 0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (currentStep !== totalSteps - 1) {
      nextStep();
      return;
    }
  
    if (!distilleries.length) {
      setError('Dropdowns still loading, please wait.');
      return;
    }
    // 🔽 INSERT HERE
  const fillDate = new Date(formData.fillDate);
  const purchaseDate = new Date(formData.dateOfPurchase);

  if (formData.fillDate && formData.dateOfPurchase && purchaseDate < fillDate) {
    setError('Purchase date cannot be before the fill date. Please match or set a later date.');
    return;
  }

  const originalVolume = parseFloat(formData.originalVolume || '');
  const regaugeVolume = parseFloat(formData.volume || '');

  if (originalVolume && regaugeVolume && regaugeVolume > originalVolume) {
    setError('Regauge volume cannot be greater than the original volume.');
    return;
  }
  if (formData.documents && formData.documents.size > 10 * 1024 * 1024) {
    setError('Document size exceeds 10MB. Please upload a smaller file.');
    return;
  }

// 🔼 END INSERT HERE
    setIsLoading(true);
    setError(null);
  
    // Generate cask code
    function generateCaskCode() {
      const prefix = 'CSK';
      const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let randomPart = '';
      for (let i = 0; i < 4; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomPart += characters[randomIndex];
      }
      return prefix + randomPart;
    }
  
    try {
      console.log('Submitting formData:', formData);
  
      const { data: userData, error: userError } = await supabase.auth.getUser();
      if (userError || !userData?.user) throw userError || new Error('No authenticated user found');
      
      // Determine whether to use the regauge values or the original fields
      const useOriginalFillData = !formData.volume && !formData.abv && formData.originalFillStrength && formData.originalVolume;
  
      const caskPayload = {
        distillery_id: formData.distillery_id && formData.distillery_id !== 'Other' ? formData.distillery_id : null,
        distillery: formData.distillery_id === 'Other' ? formData.customDistillery : formData.distilleryName,
        distillery_custom_name: formData.distillery_id === 'Other' ? formData.customDistillery : null,
        spirit_type: formData.spiritType,
        fill_date: formData.fillDate,
        cask_type: formData.caskType,
        cask_identifier: formData.caskIdentifier,
        notes: formData.notes,
        cask_code: generateCaskCode(),
      };
  
      const { data: newCask, error: caskError } = await supabase.from('casks').insert([caskPayload]).select().single();
  
      if (caskError) throw caskError;
      const caskId = newCask.id;
      console.log('Inserted cask with ID:', caskId);

      // Insert into cask_valuations after cask created
      const { error: valuationError } = await supabase.from('cask_valuations').insert([
        {
          cask_id: caskId,
          valuation_amount: formData.purchasePrice ? parseFloat(formData.purchasePrice) : 0,
          valuation_currency: formData.currency,
          valuation_date: formData.dateOfPurchase || new Date().toISOString().substring(0, 10),
          valuation_method: 'PURCHASE PRICE',
        }
      ]);
      
      if (valuationError) {
        console.error('Error inserting valuation:', valuationError);
      }
      
      // Insert cask regauge data if any relevant measurement info exists
// Insert cask_regauge entries — both original and current, if provided
type RegaugeEntry = {
  cask_id: string;
  regauge_date: string;
  volume_litres: number | null;
  strength_abv: number | null;
  loa?: number | null;
  warehouse_id: string | null;
  notes: string;
  measure_type: string;
  measured_by: string;
};

const regaugeEntries: RegaugeEntry[] = [];

const parsedOriginalVolume = formData.originalVolume ? parseFloat(formData.originalVolume) : null;
const parsedOriginalABV = formData.originalFillStrength ? parseFloat(formData.originalFillStrength) : null;
const parsedCurrentVolume = formData.volume ? parseFloat(formData.volume) : null;
const parsedCurrentABV = formData.abv ? parseFloat(formData.abv) : null;

// Original fill entry
if (parsedOriginalVolume && parsedOriginalABV) {
  const originalLOA = parseFloat(((parsedOriginalVolume * parsedOriginalABV) / 100).toFixed(2));
  regaugeEntries.push({
    cask_id: caskId,
    regauge_date: formData.fillDate || new Date().toISOString().substring(0, 10),
    volume_litres: parsedOriginalVolume,
    strength_abv: parsedOriginalABV,
    loa: originalLOA,
    warehouse_id: formData.warehouse && formData.warehouse !== 'Other' ? formData.warehouse : null,
    notes: 'Original fill at time of purchase',
    measure_type: 'original',
    measured_by: 'user',
  });
}

// Regauge/estimate entry
if (parsedCurrentVolume || parsedCurrentABV || formData.loa) {
  const originalLOA = parsedCurrentVolume && parsedCurrentABV 
    ? parseFloat(((parsedCurrentVolume * parsedCurrentABV) / 100).toFixed(2)) 
    : null;
  regaugeEntries.push({
    cask_id: caskId,
    regauge_date: formData.measurement_date || new Date().toISOString().substring(0, 10),
    volume_litres: parsedCurrentVolume,
    strength_abv: parsedCurrentABV,
    loa: formData.loa ? parseFloat(formData.loa) : null,
    notes: formData.measurement_notes || 'Measurement at time of registration',
    measure_type: formData.measure_type || 'regauge',
    measured_by: 'user',
    warehouse_id: formData.warehouse && formData.warehouse !== 'Other' ? formData.warehouse : null,
  });
}

if (regaugeEntries.length > 0) {
  const { error: regaugeError } = await supabase.from('cask_regauges').insert(regaugeEntries);
  if (regaugeError) {
    console.error('Error inserting into cask_regauges:', regaugeError);
  }
}

  
      // Upload documents logic
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
      setIsLoading(false);
    } catch (err: any) {
      console.error('Error during registration:', err);
      setError(err.message || 'Something went wrong. Please try again.');
      setIsLoading(false);
    }
  };

  // Get step content based on current step
  const renderStepContent = () => {
    switch(currentStep) {
      case 0:
        return renderStep1();
      case 1:
        return renderStep2();
      case 2:
        return renderStep3();
      case 3:
        return renderStep4();
      case 4:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  // Step 1: Cask Basics
  const renderStep1 = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Cask Basics</h2>
        
        {/* Distillery Selection */}
        <div>
          <label htmlFor="distillery_id" className="block font-semibold mb-1">Distillery <span className="text-red-500">*</span></label>
          <select
            id="distillery_id"
            name="distillery_id"
            value={formData.distillery_id}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            required
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
              <label htmlFor="customDistillery" className="block font-semibold mb-1">Custom Distillery Name <span className="text-red-500">*</span></label>
              <input
                id="customDistillery"
                type="text"
                name="customDistillery"
                value={formData.customDistillery}
                placeholder="Enter distillery name"
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>
          )}
        </div>

        {/* Spirit Type */}
        <div>
          <label htmlFor="spiritType" className="block font-semibold mb-1">Spirit Type <span className="text-red-500">*</span></label>
          <select 
            id="spiritType" 
            name="spiritType" 
            value={formData.spiritType} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select spirit type</option>
            <option value="Single Malt">Single Malt</option>
            <option value="Grain">Grain</option>
            <option value="Blend">Blend</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Cask Type */}
        <div>
          <label htmlFor="caskType" className="block font-semibold mb-1">Cask Type <span className="text-red-500">*</span></label>
          <select 
            id="caskType" 
            name="caskType" 
            value={formData.caskType} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            required
          >
            <option value="">Select cask type</option>
            <option value="Barrel">Barrel</option>
            <option value="Hogshead">Hogshead</option>
            <option value="Butt">Butt</option>
            <option value="Puncheon">Puncheon</option>
            <option value="Other">Other</option>
          </select>
        </div>

        {/* Fill Date */}
        <div>
          <label htmlFor="fillDate" className="block font-semibold mb-1">Fill Date / Vintage <span className="text-red-500">*</span></label>
          <input 
            id="fillDate" 
            type="date" 
            name="fillDate" 
            value={formData.fillDate} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Distillery / Cask Identifier */}
        <div>
          <label htmlFor="caskIdentifier" className="block font-semibold mb-1">Distillery / Cask ID <span className="text-red-500">*</span></label>
          <input 
            id="caskIdentifier" 
            type="text" 
            name="caskIdentifier" 
            value={formData.caskIdentifier} 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
            placeholder="Enter the unique identifier"
            required
          />
        </div>
      </div>
    );
  };

  // Step 2: Ownership & Location
  const renderStep2 = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Ownership & Location</h2>
        
        {/* Broker Selection */}
        <div>
          <label htmlFor="broker" className="block font-semibold mb-1">Broker</label>
          <select 
            id="broker" 
            name="broker" 
            value={formData.broker} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
          >
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
          <label htmlFor="warehouse" className="block font-semibold mb-1">Warehouse <span className="text-red-500">*</span></label>
          <select 
            id="warehouse" 
            name="warehouse" 
            value={formData.warehouse} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            required
          >
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
              <label htmlFor="customWarehouse" className="block font-semibold mb-1">Custom Warehouse Name <span className="text-red-500">*</span></label>
              <input 
                id="customWarehouse" 
                type="text" 
                name="customWarehouse"
                value={formData.customWarehouse} 
                placeholder="Enter warehouse name" 
                onChange={handleChange} 
                className="w-full p-2 border rounded"
                required={formData.warehouse === 'Other'}
              />
            </div>
          )}
        </div>

        {/* Date of Purchase */}
        <div>
          <label htmlFor="dateOfPurchase" className="block font-semibold mb-1">Date of Purchase <span className="text-red-500">*</span></label>
          <input 
            id="dateOfPurchase" 
            type="date" 
            name="dateOfPurchase" 
            value={formData.dateOfPurchase} 
            onChange={handleChange} 
            className="w-full p-2 border rounded"
            required
          />
        </div>

        {/* Purchase Price and Currency */}
        <div className="flex gap-4">
          {/* Currency Dropdown */}
          <div className="w-32">
            <label htmlFor="currency" className="block font-semibold mb-1">Currency <span className="text-red-500">*</span></label>
            <select
              id="currency"
              name="currency"
              value={formData.currency}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="GBP">GBP (£)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Purchase Price Input */}
          <div className="flex-1">
            <label htmlFor="purchasePrice" className="block font-semibold mb-1">Purchase Price <span className="text-red-500">*</span></label>
            <input
              id="purchasePrice"
              type="text"
              name="purchasePrice"
              value={formData.purchasePrice}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Enter amount"
              required
            />
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Cask Measurements
  const renderStep3 = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Cask Measurements</h2>
        
        {/* Original Fill Details */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <h3 className="text-lg font-medium mb-3">Original Fill Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="originalFillStrength" className="block font-semibold mb-1">Original Fill Strength (ABV %) <span className="text-red-500">*</span></label>
              <input 
                id="originalFillStrength" 
                type="number" 
                step="0.1" 
                name="originalFillStrength" 
                value={formData.originalFillStrength} 
                onChange={handleChange} 
                className="w-full p-2 border rounded"
                required
              />
            </div>
            
            <div>
              <label htmlFor="originalVolume" className="block font-semibold mb-1">Original Volume (litres) <span className="text-red-500">*</span></label>
              <input 
                id="originalVolume" 
                type="number" 
                step="0.01" 
                name="originalVolume" 
                value={formData.originalVolume} 
                onChange={handleChange} 
                className="w-full p-2 border rounded"
                required
              />
            </div>
            <div className="mt-0">
              <label htmlFor="originalLoa" className="block font-semibold mb-1">
                Original LOA (litres of alcohol)
              </label>
              <input 
                id="originalLoa" 
                type="number" 
                step="0.01" 
                name="originalLoa" 
                value={formData.originalLoa || ''} 
                onChange={handleChange} 
                className="w-full p-2 border rounded"
              />
            </div>

          </div>
        </div>

        {/* Regauge Measurements (Optional) */}
        <div className="bg-gray-50 p-4 rounded-lg">
          <h3 className="text-lg font-medium mb-3">Regauge Measurements (Optional)</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="volume" className="block text-sm font-medium mb-1">Current Volume (litres)</label>
              <input 
                type="number" 
                step="0.01" 
                id="volume" 
                name="volume" 
                className="w-full border p-2 rounded" 
                value={formData.volume} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label htmlFor="abv" className="block text-sm font-medium mb-1">Current ABV (%)</label>
              <input 
                type="number" 
                step="0.1" 
                id="abv" 
                name="abv" 
                className="w-full border p-2 rounded" 
                value={formData.abv} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label htmlFor="loa" className="block text-sm font-medium mb-1">LOA (litres of alcohol)</label>
              <input 
                type="number" 
                step="0.01" 
                id="loa" 
                name="loa" 
                className="w-full border p-2 rounded" 
                value={formData.loa} 
                onChange={handleChange} 
              />
            </div>
            <div>
              <label htmlFor="measure_type" className="block text-sm font-medium mb-1">Measurement Type</label>
              <select 
                id="measure_type" 
                name="measure_type" 
                className="w-full border p-2 rounded" 
                value={formData.measure_type} 
                onChange={handleChange}
              >
                <option value="regauge">Regauge</option>
                <option value="estimate">Estimate</option>
              </select>
            </div>

            <div>
              <label htmlFor="measurement_date" className="block text-sm font-medium mb-1">Measurement Date</label>
              <input 
                type="date" 
                id="measurement_date" 
                name="measurement_date" 
                className="w-full border p-2 rounded" 
                value={formData.measurement_date} 
                onChange={handleChange} 
              />
            </div>
            <div className="md:col-span-2">
              <label htmlFor="measurement_notes" className="block text-sm font-medium mb-1">Measurement Notes</label>
              <textarea 
                id="measurement_notes" 
                name="measurement_notes" 
                className="w-full border p-2 rounded" 
                value={formData.measurement_notes} 
                onChange={handleChange} 
              />
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Step 4: Documents & Notes
  const renderStep4 = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Documents & Notes</h2>
        
        {/* Upload Documents */}
        <div>
          <label htmlFor="documents" className="block font-semibold mb-1">Upload Receipt / Documentation (optional)</label>
          <input 
            id="documents" 
            type="file" 
            name="documents" 
            onChange={handleChange} 
            className="w-full p-2 border rounded" 
          />
          <p className="text-sm text-gray-500 mt-1">
          Please upload any receipts, certificates, or supporting documents to assist in verifying ownership. All files are stored securely and remain <span className="underline">strictly confidential</span>.
          </p>
        </div>

        {/* Notes */}
        <div>
          <label htmlFor="notes" className="block font-semibold mb-1">Notes (optional)</label>
          <textarea 
            id="notes" 
            name="notes" 
            value={formData.notes} 
            onChange={handleChange} 
            className="w-full p-2 border rounded h-32" 
            placeholder="Any additional information about this cask" 
          />
        </div>
      </div>
    );
  };

  // Step 5: Review & Submit
  const renderStep5 = () => {
    return (
      <div className="space-y-6">
        <h2 className="text-xl font-semibold mb-4">Review & Submit</h2>
        
        <div className="bg-gray-50 p-6 rounded-lg divide-y divide-gray-200">
          {/* Cask Basics Section */}
          <div className="py-4">
            <h3 className="text-lg font-medium mb-3">Cask Basics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Distillery</p>
                <p>{formData.distillery_id === 'Other' ? formData.customDistillery : 
                   distilleries.find(d => d.id === formData.distillery_id)?.name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Spirit Type</p>
                <p>{formData.spiritType || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Cask Type</p>
                <p>{formData.caskType || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Fill Date</p>
                <p>{formData.fillDate || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Cask Identifier</p>
                <p>{formData.caskIdentifier || 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          {/* Ownership & Location Section */}
          <div className="py-4">
            <h3 className="text-lg font-medium mb-3">Ownership & Location</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Broker</p>
                <p>{formData.broker === 'Other' ? formData.customBroker : 
                   brokers.find(b => b.id === formData.broker)?.name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Warehouse</p>
                <p>{formData.warehouse === 'Other' ? formData.customWarehouse : 
                   warehouses.find(w => w.id === formData.warehouse)?.name || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Date of Purchase</p>
                <p>{formData.dateOfPurchase || 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Purchase Price</p>
                <p>{formData.purchasePrice ? `${formData.currency} ${formData.purchasePrice}` : 'Not specified'}</p>
              </div>
            </div>
          </div>
          
          {/* Measurements Section */}
          <div className="py-4">
            <h3 className="text-lg font-medium mb-3">Cask Measurements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Original Fill Strength</p>
                <p>{formData.originalFillStrength ? `${formData.originalFillStrength}%` : 'Not specified'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Original Volume</p>
                <p>{formData.originalVolume ? `${formData.originalVolume} litres` : 'Not specified'}</p>
              </div>
              
              {/* Show regauge info only if provided */}
              {(formData.volume || formData.abv || formData.loa) && (
                <>
                  <div className="md:col-span-2 mt-2">
                    <p className="text-sm font-semibold text-gray-500">Regauge Information</p>
                  </div>
                  {formData.volume && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Current Volume</p>
                      <p>{formData.volume} Litres</p>
                    </div>
                  )}
                  {formData.abv && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Current ABV</p>
                      <p>{formData.abv}%</p>
                    </div>
                  )}
                  {formData.loa && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Regauged Litres of Alcohol (RLA)</p>
                      <p>{formData.loa} Litres</p>
                    </div>
                  )}
                  {formData.measurement_date && (
                    <div>
                      <p className="text-sm font-semibold text-gray-500">Measurement Date</p>
                      <p>{formData.measurement_date}</p>
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
          
          {/* Documents & Notes Section */}
          <div className="py-4">
            <h3 className="text-lg font-medium mb-3">Documents & Notes</h3>
            <div className="grid grid-cols-1 gap-4">
              <div>
                <p className="text-sm font-semibold text-gray-500">Documents</p>
                <p>{formData.documents ? formData.documents.name : 'No documents uploaded'}</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-500">Notes</p>
                <p className="whitespace-pre-wrap">{formData.notes || 'No notes provided'}</p>
              </div>
            </div>
          </div>
        </div>
        
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center">
            <AlertCircle className="h-5 w-5 mr-2" />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  };

  // Navigation buttons
  const renderNavButtons = () => {
    return (
      <div className="flex justify-between mt-8">
        {currentStep > 0 ? (
          <button
            type="button"
            onClick={prevStep}
            className="flex items-center bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300 transition-all"
            disabled={isLoading}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </button>
        ) : (
          <div></div> // Empty div to maintain flex spacing
        )}
        
        <button
          type="submit"
          disabled={isLoading}
          className={`flex items-center ${
            currentStep === totalSteps - 1
              ? 'bg-[#2f1b0c] hover:bg-[#442c1c]'
              : 'bg-[#2f1b0c] hover:bg-[#442c1c]'
          } text-white py-2 px-6 rounded transition-all ${
            isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center">
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : currentStep === totalSteps - 1 ? (
            <span className="flex items-center">
              Submit Registration
              <Check className="h-4 w-4 ml-2" />
            </span>
          ) : (
            <span className="flex items-center">
              Next Step
              <ArrowRight className="h-4 w-4 ml-2" />
            </span>
          )}
        </button>
      </div>
    );
  };

  return (
    <>
      <Navbar />
      <main className="pt-28 px-6 pb-20 max-w-2xl mx-auto text-black">
        <h1 className="text-3xl font-bold mb-6 text-center">Register New Cask</h1>
        
        <StepIndicator currentStep={currentStep} totalSteps={totalSteps} />
        
        <form onSubmit={handleSubmit}>
          {renderStepContent()}
          {renderNavButtons()}
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