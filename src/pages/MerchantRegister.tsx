import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Store, ArrowLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

export default function MerchantRegister() {
  const navigate = useNavigate();
  const { user, profile, refreshProfile } = useAuth();
  const [formData, setFormData] = useState({
    businessName: '',
    businessDescription: '',
    businessCategory: '',
    businessLocation: '',
    businessPhone: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const categories = [
    'Restaurants',
    'Supermarkets',
    'Electronics',
    'Fashion',
    'Health & Beauty',
    'Services',
    'Entertainment',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    if (!user) {
      setError('You must be signed in to register as a merchant');
      setLoading(false);
      return;
    }

    const { error: insertError } = await supabase.from('merchant_profiles').insert({
      user_id: user.id,
      business_name: formData.businessName,
      business_description: formData.businessDescription,
      business_category: formData.businessCategory,
      business_location: formData.businessLocation,
      business_phone: formData.businessPhone,
      approval_status: 'pending',
    });

    if (insertError) {
      setError(insertError.message);
      setLoading(false);
    } else {
      await supabase.from('profiles').update({ role: 'merchant' }).eq('id', user.id);
      await refreshProfile();
      navigate('/merchant');
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-600">Please sign in to register as a merchant</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-3xl mx-auto px-4 py-12">
        <button
          onClick={() => navigate('/')}
          className="flex items-center gap-2 text-slate-600 hover:text-slate-900 mb-6 transition"
        >
          <ArrowLeft size={20} />
          Back to Home
        </button>

        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Store size={24} className="text-blue-600" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">Become a Merchant</h1>
              <p className="text-slate-600">Register your business and start posting deals</p>
            </div>
          </div>

          <div className="mb-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800">
              Your merchant application will be reviewed by our admin team. Once approved, you'll be
              able to post discount deals for your business.
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="businessName" className="block text-sm font-medium text-slate-700 mb-2">
                Business Name *
              </label>
              <input
                id="businessName"
                type="text"
                required
                value={formData.businessName}
                onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="Your Business Name"
              />
            </div>

            <div>
              <label htmlFor="businessCategory" className="block text-sm font-medium text-slate-700 mb-2">
                Business Category *
              </label>
              <select
                id="businessCategory"
                required
                value={formData.businessCategory}
                onChange={(e) => setFormData({ ...formData, businessCategory: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Select a category</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="businessDescription" className="block text-sm font-medium text-slate-700 mb-2">
                Business Description
              </label>
              <textarea
                id="businessDescription"
                rows={4}
                value={formData.businessDescription}
                onChange={(e) => setFormData({ ...formData, businessDescription: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
                placeholder="Tell us about your business..."
              />
            </div>

            <div>
              <label htmlFor="businessLocation" className="block text-sm font-medium text-slate-700 mb-2">
                Business Location *
              </label>
              <input
                id="businessLocation"
                type="text"
                required
                value={formData.businessLocation}
                onChange={(e) => setFormData({ ...formData, businessLocation: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="City, Street Address"
              />
            </div>

            <div>
              <label htmlFor="businessPhone" className="block text-sm font-medium text-slate-700 mb-2">
                Business Phone Number *
              </label>
              <input
                id="businessPhone"
                type="tel"
                required
                value={formData.businessPhone}
                onChange={(e) => setFormData({ ...formData, businessPhone: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="+250 788 123 456"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Submitting...' : 'Submit Application'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
