'use client';

import { useState } from 'react';
import { CATEGORY_LABELS, INDIAN_STATES, MAJOR_CITIES } from '@/types';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useLang } from '@/components/layout/ClientLayout';
import { useWallet } from '@/hooks/useWallet';
import toast from 'react-hot-toast';

export default function RegisterMSMEPage() {
  const { lang } = useLang();
  const { address } = useWallet();
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    city: '',
    state: '',
    gstNumber: '',
    foundingYear: 2020,
    description: '',
    revenue: 0,
    employees: 1,
    targetAmount: 100000,
    equityOffered: 5,
  });

  const updateField = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateStep1 = () => {
    if (!formData.name) { toast.error('Business name is required'); return false; }
    if (!formData.category) { toast.error('Select a category'); return false; }
    if (!formData.city) { toast.error('City is required'); return false; }
    if (!formData.state) { toast.error('State is required'); return false; }
    if (!formData.gstNumber) { toast.error('GST number is required'); return false; }
    const gstRegex = /^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$/;
    if (!gstRegex.test(formData.gstNumber)) { toast.error('Invalid GST format (e.g., 22AAAAA0000A1Z5)'); return false; }
    return true;
  };

  const validateStep2 = () => {
    if (!formData.description) { toast.error('Description is required'); return false; }
    if (formData.revenue <= 0) { toast.error('Revenue must be greater than 0'); return false; }
    if (formData.employees <= 0) { toast.error('Employees must be at least 1'); return false; }
    return true;
  };

  const handleSubmit = async () => {
    if (formData.targetAmount < 100000) { toast.error('Minimum target is ₹1,00,000'); return; }
    if (formData.equityOffered < 1 || formData.equityOffered > 20) { toast.error('Equity must be 1-20%'); return; }

    setIsSubmitting(true);
    try {
      // Save to Firebase
      const docRef = await addDoc(collection(db, 'msmes'), {
        ...formData,
        status: 'pending',
        amountRaised: 0,
        founderWallet: address || 'unknown',
        tokenAddress: '',
        riskScore: { score: 50, label: 'Moderate' },
        createdAt: serverTimestamp(),
      });

      console.log('MSME saved with ID:', docRef.id);
      toast.success('🎉 MSME registered successfully! Pending admin approval.');
      setStep(4);
    } catch (error) {
      console.error('Firebase error:', error);
      toast.error('Registration failed. Check console for details.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (amount: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(amount);

  return (
    <div className="min-h-screen bg-[#050A18]">
      <div className="disclaimer-banner">
        ⚠️ SEBI Disclaimer: Educational prototype only. Not financial advice.
      </div>

      <div className="page-container py-12">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-white mb-2">
            <span className="gradient-text">
              {lang === 'en' ? 'Register Your MSME' : 'अपना MSME पंजीकृत करें'}
            </span>
          </h1>
          <p className="text-gray-400">
            {lang === 'en'
              ? 'List your business and raise micro-equity capital from investors across India'
              : 'अपने व्यवसाय को सूचीबद्ध करें और भारत भर के निवेशकों से पूंजी जुटाएं'}
          </p>
        </div>

        {/* Progress */}
        <div className="max-w-2xl mx-auto mb-8">
          <div className="flex items-center justify-between mb-4">
            {[
              lang === 'en' ? 'Business Info' : 'व्यवसाय जानकारी',
              lang === 'en' ? 'Details' : 'विवरण',
              lang === 'en' ? 'Fundraising' : 'फंडरेजिंग',
              lang === 'en' ? 'Done' : 'पूर्ण',
            ].map((label, index) => (
              <div key={label} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all ${
                  step > index + 1 ? 'bg-green-500 text-white' :
                  step === index + 1 ? 'bg-blue-500 text-white glow-blue' :
                  'bg-gray-800 text-gray-500'
                }`}>
                  {step > index + 1 ? '✓' : index + 1}
                </div>
                <span className="text-xs mt-1 text-gray-500">{label}</span>
              </div>
            ))}
          </div>
          <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full transition-all duration-500"
              style={{ width: `${((step - 1) / 3) * 100}%` }}
            />
          </div>
        </div>

        {/* Form */}
        <div className="max-w-2xl mx-auto">
          <div className="card p-8">

            {/* Step 1 */}
            {step === 1 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">🏢 {lang === 'en' ? 'Business Information' : 'व्यवसाय जानकारी'}</h2>

                <div>
                  <label className="label">{lang === 'en' ? 'Business Name *' : 'व्यवसाय का नाम *'}</label>
                  <input type="text" className="input-field" placeholder="e.g., Sharma Tea & Snacks"
                    value={formData.name} onChange={(e) => updateField('name', e.target.value)} />
                </div>

                <div>
                  <label className="label">{lang === 'en' ? 'Category *' : 'श्रेणी *'}</label>
                  <select className="input-field" value={formData.category} onChange={(e) => updateField('category', e.target.value)}>
                    <option value="">{lang === 'en' ? 'Select category...' : 'श्रेणी चुनें...'}</option>
                    {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                      <option key={key} value={key}>{label}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">{lang === 'en' ? 'City *' : 'शहर *'}</label>
                    <select className="input-field" value={formData.city} onChange={(e) => updateField('city', e.target.value)}>
                      <option value="">{lang === 'en' ? 'Select city...' : 'शहर चुनें...'}</option>
                      {MAJOR_CITIES.map((city) => <option key={city} value={city}>{city}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="label">{lang === 'en' ? 'State *' : 'राज्य *'}</label>
                    <select className="input-field" value={formData.state} onChange={(e) => updateField('state', e.target.value)}>
                      <option value="">{lang === 'en' ? 'Select state...' : 'राज्य चुनें...'}</option>
                      {INDIAN_STATES.map((state) => <option key={state} value={state}>{state}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">GST Number *</label>
                    <input type="text" className="input-field uppercase" placeholder="22AAAAA0000A1Z5"
                      maxLength={15} value={formData.gstNumber}
                      onChange={(e) => updateField('gstNumber', e.target.value.toUpperCase())} />
                  </div>
                  <div>
                    <label className="label">{lang === 'en' ? 'Founding Year *' : 'स्थापना वर्ष *'}</label>
                    <input type="number" className="input-field" min={1900} max={2026}
                      value={formData.foundingYear}
                      onChange={(e) => updateField('foundingYear', parseInt(e.target.value))} />
                  </div>
                </div>

                <button className="btn-primary w-full mt-4" onClick={() => { if (validateStep1()) setStep(2); }}>
                  {lang === 'en' ? 'Next: Business Details →' : 'अगला: व्यवसाय विवरण →'}
                </button>
              </div>
            )}

            {/* Step 2 */}
            {step === 2 && (
              <div className="space-y-4">
                <h2 className="text-xl font-bold text-white mb-4">📊 {lang === 'en' ? 'Business Details' : 'व्यवसाय विवरण'}</h2>

                <div>
                  <label className="label">{lang === 'en' ? 'Business Description *' : 'व्यवसाय विवरण *'}</label>
                  <textarea className="input-field h-32 resize-none"
                    placeholder={lang === 'en' ? 'Describe your business...' : 'अपने व्यवसाय का वर्णन करें...'}
                    value={formData.description} onChange={(e) => updateField('description', e.target.value)} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="label">{lang === 'en' ? 'Annual Revenue (₹) *' : 'वार्षिक राजस्व (₹) *'}</label>
                    <input type="number" className="input-field" placeholder="500000" min={0}
                      value={formData.revenue || ''}
                      onChange={(e) => updateField('revenue', parseInt(e.target.value) || 0)} />
                    <p className="text-xs text-gray-500 mt-1">{formatINR(formData.revenue)}</p>
                  </div>
                  <div>
                    <label className="label">{lang === 'en' ? 'Employees *' : 'कर्मचारी *'}</label>
                    <input type="number" className="input-field" min={1}
                      value={formData.employees}
                      onChange={(e) => updateField('employees', parseInt(e.target.value) || 1)} />
                  </div>
                </div>

                <div className="flex gap-3 mt-4">
                  <button className="btn-secondary flex-1" onClick={() => setStep(1)}>← {lang === 'en' ? 'Back' : 'वापस'}</button>
                  <button className="btn-primary flex-1" onClick={() => { if (validateStep2()) setStep(3); }}>
                    {lang === 'en' ? 'Next: Fundraising →' : 'अगला: फंडरेजिंग →'}
                  </button>
                </div>
              </div>
            )}

            {/* Step 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <h2 className="text-xl font-bold text-white mb-4">💰 {lang === 'en' ? 'Fundraising Terms' : 'फंडरेजिंग शर्तें'}</h2>

                <div>
                  <label className="label">{lang === 'en' ? 'Target Amount (₹) *' : 'लक्ष्य राशि (₹) *'}</label>
                  <input type="range" min={100000} max={5000000} step={50000}
                    value={formData.targetAmount}
                    onChange={(e) => updateField('targetAmount', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-500" />
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">₹1L</span>
                    <span className="text-2xl font-black gradient-text">{formatINR(formData.targetAmount)}</span>
                    <span className="text-gray-500">₹50L</span>
                  </div>
                </div>

                <div>
                  <label className="label">{lang === 'en' ? 'Equity Offered (%) *' : 'इक्विटी (%) *'}</label>
                  <input type="range" min={1} max={20} step={1}
                    value={formData.equityOffered}
                    onChange={(e) => updateField('equityOffered', parseInt(e.target.value))}
                    className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-orange-500" />
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-gray-500">1%</span>
                    <span className="text-2xl font-black text-orange-400">{formData.equityOffered}%</span>
                    <span className="text-gray-500">20%</span>
                  </div>
                </div>

                {/* Summary */}
                <div className="glass-card p-6">
                  <h3 className="font-bold text-white mb-4">📋 {lang === 'en' ? 'Summary' : 'सारांश'}</h3>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    {[
                      [lang === 'en' ? 'Business' : 'व्यवसाय', formData.name || 'N/A'],
                      [lang === 'en' ? 'Category' : 'श्रेणी', CATEGORY_LABELS[formData.category as keyof typeof CATEGORY_LABELS] || 'N/A'],
                      [lang === 'en' ? 'Location' : 'स्थान', `${formData.city}, ${formData.state}`],
                      ['GST', formData.gstNumber || 'N/A'],
                      [lang === 'en' ? 'Target' : 'लक्ष्य', formatINR(formData.targetAmount)],
                      [lang === 'en' ? 'Equity' : 'इक्विटी', `${formData.equityOffered}%`],
                    ].map(([label, value]) => (
                      <div key={label}>
                        <p className="text-gray-500">{label}</p>
                        <p className="text-white font-semibold">{value}</p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex gap-3">
                  <button className="btn-secondary flex-1" onClick={() => setStep(2)}>← {lang === 'en' ? 'Back' : 'वापस'}</button>
                  <button className="btn-primary flex-1" onClick={handleSubmit} disabled={isSubmitting}>
                    {isSubmitting ? '⏳ Saving...' : `🚀 ${lang === 'en' ? 'Submit Registration' : 'पंजीकरण जमा करें'}`}
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Success */}
            {step === 4 && (
              <div className="text-center py-8">
                <div className="text-6xl mb-4">🎉</div>
                <h2 className="text-2xl font-black text-white mb-2">
                  {lang === 'en' ? 'Registration Successful!' : 'पंजीकरण सफल!'}
                </h2>
                <p className="text-gray-400 mb-6">
                  {lang === 'en'
                    ? 'Your MSME has been saved to Firebase and submitted for review.'
                    : 'आपका MSME Firebase में सहेजा गया है और समीक्षा के लिए जमा किया गया है।'}
                </p>
                <div className="glass-card p-4 mb-6 text-sm text-left">
                  <p className="text-white font-semibold mb-2">
                    {lang === 'en' ? 'What happens next?' : 'आगे क्या होगा?'}
                  </p>
                  <ol className="text-gray-400 list-decimal ml-4 space-y-1">
                    <li>{lang === 'en' ? 'Admin reviews your application' : 'एडमिन आपके आवेदन की समीक्षा करेगा'}</li>
                    <li>{lang === 'en' ? 'ERC-20 token deployed on Polygon' : 'Polygon पर ERC-20 टोकन तैनात किया जाएगा'}</li>
                    <li>{lang === 'en' ? 'Your listing goes live' : 'आपकी लिस्टिंग लाइव होगी'}</li>
                    <li>{lang === 'en' ? 'Investors buy tokens and you get funded!' : 'निवेशक टोकन खरीदेंगे और आपको फंडिंग मिलेगी!'}</li>
                  </ol>
                </div>
                <div className="flex gap-3 justify-center">
                  <a href="/listings" className="btn-primary">{lang === 'en' ? 'Browse Listings' : 'लिस्टिंग देखें'}</a>
                  <a href="/" className="btn-secondary">{lang === 'en' ? 'Go Home' : 'होम जाएं'}</a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}