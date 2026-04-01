'use client';

import { useState } from 'react';
import { CATEGORY_LABELS, INDIAN_STATES, MAJOR_CITIES } from '@/types';
import DisclaimerBanner from '@/components/layout/DisclaimerBanner';
import toast from 'react-hot-toast';

export default function RegisterMSMEPage() {
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
      // Simulate submission delay
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success('🎉 MSME registered successfully! Pending admin approval.');
      setStep(4); // Success step
    } catch (error) {
      toast.error('Registration failed. Try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatINR = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className="page-container animate-fade-in">
      <DisclaimerBanner type="investment" />

      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-black mb-2">
          <span className="gradient-text">Register Your MSME</span>
        </h1>
        <p className="text-gray-600">
          List your business and raise micro-equity capital from investors across India
        </p>
      </div>

      {/* Progress Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-2">
          {['Business Info', 'Details', 'Fundraising', 'Done'].map((label, index) => (
            <div key={label} className="flex flex-col items-center">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${
                  step > index + 1
                    ? 'bg-india-green text-white'
                    : step === index + 1
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-200 text-gray-500'
                }`}
              >
                {step > index + 1 ? '✓' : index + 1}
              </div>
              <span className="text-xs mt-1 text-gray-500">{label}</span>
            </div>
          ))}
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-gradient-to-r from-primary-500 to-saffron h-2 rounded-full transition-all duration-500"
            style={{ width: `${((step - 1) / 3) * 100}%` }}
          ></div>
        </div>
      </div>

      {/* Form Card */}
      <div className="max-w-2xl mx-auto">
        <div className="card">
          {/* Step 1: Business Info */}
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">🏢 Business Information</h2>

              <div>
                <label className="label">Business Name *</label>
                <input
                  type="text"
                  className="input-field"
                  placeholder="e.g., Sharma Tea & Snacks"
                  value={formData.name}
                  onChange={(e) => updateField('name', e.target.value)}
                />
              </div>

              <div>
                <label className="label">Category *</label>
                <select
                  className="input-field"
                  value={formData.category}
                  onChange={(e) => updateField('category', e.target.value)}
                >
                  <option value="">Select category...</option>
                  {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                    <option key={key} value={key}>{label}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">City *</label>
                  <select
                    className="input-field"
                    value={formData.city}
                    onChange={(e) => updateField('city', e.target.value)}
                  >
                    <option value="">Select city...</option>
                    {MAJOR_CITIES.map((city) => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="label">State *</label>
                  <select
                    className="input-field"
                    value={formData.state}
                    onChange={(e) => updateField('state', e.target.value)}
                  >
                    <option value="">Select state...</option>
                    {INDIAN_STATES.map((state) => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">GST Number *</label>
                  <input
                    type="text"
                    className="input-field uppercase"
                    placeholder="22AAAAA0000A1Z5"
                    maxLength={15}
                    value={formData.gstNumber}
                    onChange={(e) => updateField('gstNumber', e.target.value.toUpperCase())}
                  />
                </div>
                <div>
                  <label className="label">Founding Year *</label>
                  <input
                    type="number"
                    className="input-field"
                    min={1900}
                    max={2026}
                    value={formData.foundingYear}
                    onChange={(e) => updateField('foundingYear', parseInt(e.target.value))}
                  />
                </div>
              </div>

              <button
                className="btn-primary w-full mt-4"
                onClick={() => {
                  if (validateStep1()) setStep(2);
                }}
              >
                Next: Business Details →
              </button>
            </div>
          )}

          {/* Step 2: Details */}
          {step === 2 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">📊 Business Details</h2>

              <div>
                <label className="label">Business Description *</label>
                <textarea
                  className="input-field h-32 resize-none"
                  placeholder="Describe your business, what you do, your vision..."
                  value={formData.description}
                  onChange={(e) => updateField('description', e.target.value)}
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="label">Annual Revenue (₹) *</label>
                  <input
                    type="number"
                    className="input-field"
                    placeholder="e.g., 500000"
                    min={0}
                    value={formData.revenue || ''}
                    onChange={(e) => updateField('revenue', parseInt(e.target.value) || 0)}
                  />
                  <p className="text-xs text-gray-400 mt-1">{formatINR(formData.revenue)}</p>
                </div>
                <div>
                  <label className="label">Number of Employees *</label>
                  <input
                    type="number"
                    className="input-field"
                    min={1}
                    value={formData.employees}
                    onChange={(e) => updateField('employees', parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => setStep(1)}
                >
                  ← Back
                </button>
                <button
                  className="btn-primary flex-1"
                  onClick={() => {
                    if (validateStep2()) setStep(3);
                  }}
                >
                  Next: Fundraising →
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Fundraising */}
          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold mb-4">💰 Fundraising Terms</h2>

              <div>
                <label className="label">Target Amount (₹) *</label>
                <input
                  type="range"
                  min={100000}
                  max={5000000}
                  step={50000}
                  value={formData.targetAmount}
                  onChange={(e) => updateField('targetAmount', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary-600"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">₹1 Lakh</span>
                  <span className="text-2xl font-bold text-primary-600">{formatINR(formData.targetAmount)}</span>
                  <span className="text-gray-400">₹50 Lakh</span>
                </div>
              </div>

              <div>
                <label className="label">Equity Offered (%) *</label>
                <input
                  type="range"
                  min={1}
                  max={20}
                  step={1}
                  value={formData.equityOffered}
                  onChange={(e) => updateField('equityOffered', parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-saffron"
                />
                <div className="flex justify-between text-sm mt-1">
                  <span className="text-gray-400">1%</span>
                  <span className="text-2xl font-bold text-saffron">{formData.equityOffered}%</span>
                  <span className="text-gray-400">20%</span>
                </div>
              </div>

              {/* Summary Card */}
              <div className="bg-gradient-to-br from-primary-50 to-orange-50 rounded-xl p-6 mt-6">
                <h3 className="font-bold text-lg mb-4">📋 Registration Summary</h3>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div>
                    <p className="text-gray-500">Business</p>
                    <p className="font-semibold">{formData.name || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Category</p>
                    <p className="font-semibold">{CATEGORY_LABELS[formData.category as keyof typeof CATEGORY_LABELS] || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Location</p>
                    <p className="font-semibold">{formData.city}, {formData.state}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">GST</p>
                    <p className="font-semibold">{formData.gstNumber || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Target</p>
                    <p className="font-bold text-primary-600">{formatINR(formData.targetAmount)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500">Equity</p>
                    <p className="font-bold text-saffron">{formData.equityOffered}%</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 mt-4">
                <button
                  className="btn-secondary flex-1"
                  onClick={() => setStep(2)}
                >
                  ← Back
                </button>
                <button
                  className="btn-saffron flex-1"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? '⏳ Registering...' : '🚀 Submit Registration'}
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Success */}
          {step === 4 && (
            <div className="text-center py-8">
              <span className="text-6xl block mb-4">🎉</span>
              <h2 className="text-2xl font-bold text-india-green mb-2">Registration Successful!</h2>
              <p className="text-gray-600 mb-6">
                Your MSME has been submitted for review. Our admin team will approve it shortly.
              </p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6 text-sm text-green-800">
                <p className="font-semibold mb-1">What happens next?</p>
                <ol className="text-left list-decimal ml-4 space-y-1">
                  <li>Admin reviews your application</li>
                  <li>Smart contract (ERC-20 token) is deployed for your MSME</li>
                  <li>Your listing goes live for investors</li>
                  <li>Investors buy tokens and you receive funding!</li>
                </ol>
              </div>
              <div className="flex gap-3 justify-center">
                <a href="/listings" className="btn-primary">Browse Listings</a>
                <a href="/" className="btn-secondary">Go Home</a>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}