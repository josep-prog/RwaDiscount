import { useEffect, useState } from 'react';
import { Users, Store, Tag, TrendingUp, Check, X } from 'lucide-react';
import { supabase, MerchantProfile, Deal } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';

type DealWithMerchant = Deal & {
  merchant_profiles: MerchantProfile;
};

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [pendingMerchants, setPendingMerchants] = useState<MerchantProfile[]>([]);
  const [pendingDeals, setPendingDeals] = useState<DealWithMerchant[]>([]);
  const [stats, setStats] = useState({
    totalMerchants: 0,
    totalDeals: 0,
    totalCustomers: 0,
    activeDeals: 0,
  });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'merchants' | 'deals'>('merchants');

  useEffect(() => {
    if (user && profile?.role === 'admin') {
      fetchData();
    }
  }, [user, profile]);

  const fetchData = async () => {
    const [merchantsRes, dealsRes, customersRes, activeDealsRes, pendingMerchantsRes, pendingDealsRes] = await Promise.all([
      supabase.from('merchant_profiles').select('*', { count: 'exact', head: true }),
      supabase.from('deals').select('*', { count: 'exact', head: true }),
      supabase.from('profiles').select('*', { count: 'exact', head: true }).eq('role', 'customer'),
      supabase.from('deals').select('*', { count: 'exact', head: true }).eq('status', 'approved').gt('end_date', new Date().toISOString()),
      supabase.from('merchant_profiles').select('*').eq('approval_status', 'pending'),
      supabase.from('deals').select('*, merchant_profiles(*)').eq('status', 'pending'),
    ]);

    setStats({
      totalMerchants: merchantsRes.count || 0,
      totalDeals: dealsRes.count || 0,
      totalCustomers: customersRes.count || 0,
      activeDeals: activeDealsRes.count || 0,
    });

    setPendingMerchants(pendingMerchantsRes.data || []);
    setPendingDeals((pendingDealsRes.data as DealWithMerchant[]) || []);
    setLoading(false);
  };

  const handleMerchantApproval = async (merchantId: string, approved: boolean, reason?: string) => {
    await supabase
      .from('merchant_profiles')
      .update({
        approval_status: approved ? 'approved' : 'rejected',
        approved_by: user!.id,
        approved_at: new Date().toISOString(),
        rejection_reason: reason || null,
      })
      .eq('id', merchantId);

    fetchData();
  };

  const handleDealApproval = async (dealId: string, approved: boolean, reason?: string) => {
    await supabase
      .from('deals')
      .update({
        status: approved ? 'approved' : 'rejected',
        approved_by: user!.id,
        approved_at: new Date().toISOString(),
        rejection_reason: reason || null,
      })
      .eq('id', dealId);

    fetchData();
  };

  if (profile?.role !== 'admin') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-600">Access denied. Admin privileges required.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">Admin Dashboard</h1>
          <p className="text-slate-600">Manage merchants, deals, and platform activity</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Merchants</span>
              <Store size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalMerchants}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Deals</span>
              <Tag size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalDeals}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Active Deals</span>
              <TrendingUp size={20} className="text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.activeDeals}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Customers</span>
              <Users size={20} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{stats.totalCustomers}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="border-b border-slate-200">
            <div className="flex">
              <button
                onClick={() => setActiveTab('merchants')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'merchants'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending Merchants ({pendingMerchants.length})
              </button>
              <button
                onClick={() => setActiveTab('deals')}
                className={`px-6 py-4 font-medium transition ${
                  activeTab === 'deals'
                    ? 'text-blue-600 border-b-2 border-blue-600'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                Pending Deals ({pendingDeals.length})
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === 'merchants' ? (
              <div className="space-y-4">
                {pendingMerchants.length === 0 ? (
                  <p className="text-center py-12 text-slate-600">No pending merchant applications</p>
                ) : (
                  pendingMerchants.map((merchant) => (
                    <div
                      key={merchant.id}
                      className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-bold text-slate-900 text-lg mb-2">
                            {merchant.business_name}
                          </h3>
                          <div className="space-y-1 text-sm text-slate-600 mb-4">
                            <p><span className="font-medium">Category:</span> {merchant.business_category}</p>
                            <p><span className="font-medium">Location:</span> {merchant.business_location}</p>
                            <p><span className="font-medium">Phone:</span> {merchant.business_phone}</p>
                            {merchant.business_description && (
                              <p><span className="font-medium">Description:</span> {merchant.business_description}</p>
                            )}
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleMerchantApproval(merchant.id, true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            <Check size={18} />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejection (optional):');
                              handleMerchantApproval(merchant.id, false, reason || undefined);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            <X size={18} />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            ) : (
              <div className="space-y-4">
                {pendingDeals.length === 0 ? (
                  <p className="text-center py-12 text-slate-600">No pending deals</p>
                ) : (
                  pendingDeals.map((deal) => (
                    <div
                      key={deal.id}
                      className="border border-slate-200 rounded-lg p-5 hover:border-blue-300 transition"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-slate-900 text-lg">{deal.title}</h3>
                            <span className="px-3 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                              -{deal.discount_percentage}%
                            </span>
                          </div>
                          <p className="text-sm text-slate-600 mb-3">{deal.description}</p>
                          <div className="space-y-1 text-sm text-slate-600 mb-3">
                            <p><span className="font-medium">Merchant:</span> {deal.merchant_profiles.business_name}</p>
                            <p><span className="font-medium">Category:</span> {deal.category}</p>
                            <p><span className="font-medium">Location:</span> {deal.location}</p>
                            <p>
                              <span className="font-medium">Price:</span>{' '}
                              <span className="line-through">{deal.original_price.toLocaleString()} RWF</span>
                              {' → '}
                              <span className="font-bold text-blue-600">{deal.discounted_price.toLocaleString()} RWF</span>
                            </p>
                            <p>
                              <span className="font-medium">Valid:</span>{' '}
                              {new Date(deal.start_date).toLocaleDateString()} - {new Date(deal.end_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2 ml-4">
                          <button
                            onClick={() => handleDealApproval(deal.id, true)}
                            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition"
                          >
                            <Check size={18} />
                            Approve
                          </button>
                          <button
                            onClick={() => {
                              const reason = prompt('Reason for rejection (optional):');
                              handleDealApproval(deal.id, false, reason || undefined);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                          >
                            <X size={18} />
                            Reject
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
