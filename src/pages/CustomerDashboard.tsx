import { useEffect, useState } from 'react';
import { Bookmark, Bell } from 'lucide-react';
import { supabase, Deal, MerchantProfile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import DealCard from '../components/DealCard';

type DealWithMerchant = Deal & {
  merchant_profiles: MerchantProfile;
};

export default function CustomerDashboard() {
  const { user } = useAuth();
  const [savedDeals, setSavedDeals] = useState<DealWithMerchant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchSavedDeals();
    }
  }, [user]);

  const fetchSavedDeals = async () => {
    if (!user) return;

    const { data } = await supabase
      .from('saved_deals')
      .select('deal_id')
      .eq('user_id', user.id);

    if (data && data.length > 0) {
      const dealIds = data.map((sd) => sd.deal_id);
      const { data: deals } = await supabase
        .from('deals')
        .select('*, merchant_profiles(*)')
        .in('id', dealIds)
        .eq('status', 'approved')
        .gt('end_date', new Date().toISOString());

      if (deals) {
        setSavedDeals(deals as DealWithMerchant[]);
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">My Dashboard</h1>
          <p className="text-slate-600">Track your saved deals and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
              <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
                <Bookmark size={24} className="text-blue-600" />
                Saved Deals
              </h2>

              {loading ? (
                <div className="space-y-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="animate-pulse">
                      <div className="h-32 bg-slate-200 rounded-lg"></div>
                    </div>
                  ))}
                </div>
              ) : savedDeals.length === 0 ? (
                <div className="text-center py-12">
                  <Bookmark size={48} className="mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-600 mb-2">No saved deals yet</p>
                  <p className="text-sm text-slate-500">
                    Browse deals on the home page and save your favorites!
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 gap-6">
                  {savedDeals.map((deal) => (
                    <DealCard key={deal.id} deal={deal} />
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Bell size={20} />
                Quick Stats
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-slate-600">Saved Deals</span>
                  <span className="font-bold text-slate-900">{savedDeals.length}</span>
                </div>
              </div>
            </div>

            <div className="bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl shadow-sm p-6 text-white">
              <h3 className="font-semibold mb-2">Want to offer deals?</h3>
              <p className="text-sm text-blue-100 mb-4">
                Register as a merchant and start promoting your business
              </p>
              <a
                href="/merchant-register"
                className="inline-block px-4 py-2 bg-white text-blue-600 rounded-lg font-medium hover:bg-blue-50 transition"
              >
                Become a Merchant
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
