import { useEffect, useState } from 'react';
import { Plus, TrendingUp, Eye, Bookmark, Clock, CreditCard as Edit, Trash2 } from 'lucide-react';
import { supabase, Deal, MerchantProfile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';
import Header from '../components/Header';
import CreateDealModal from '../components/CreateDealModal';

export default function MerchantDashboard() {
  const { user } = useAuth();
  const [merchantProfile, setMerchantProfile] = useState<MerchantProfile | null>(null);
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedDeal, setSelectedDeal] = useState<Deal | null>(null);

  useEffect(() => {
    if (user) {
      fetchMerchantProfile();
    }
  }, [user]);

  const fetchMerchantProfile = async () => {
    if (!user) return;

    const { data: profile } = await supabase
      .from('merchant_profiles')
      .select('*')
      .eq('user_id', user.id)
      .maybeSingle();

    if (profile) {
      setMerchantProfile(profile);
      fetchDeals(profile.id);
    }
    setLoading(false);
  };

  const fetchDeals = async (merchantId: string) => {
    const { data } = await supabase
      .from('deals')
      .select('*')
      .eq('merchant_id', merchantId)
      .order('created_at', { ascending: false });

    if (data) {
      setDeals(data);
    }
  };

  const handleDeleteDeal = async (dealId: string) => {
    if (!confirm('Are you sure you want to delete this deal?')) return;

    await supabase.from('deals').delete().eq('id', dealId);
    setDeals(deals.filter((d) => d.id !== dealId));
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      expired: 'bg-slate-100 text-slate-800',
    };
    return styles[status as keyof typeof styles] || styles.pending;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!merchantProfile) {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16 text-center">
          <p className="text-slate-600">No merchant profile found</p>
        </div>
      </div>
    );
  }

  if (merchantProfile.approval_status === 'pending') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-yellow-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Pending</h2>
            <p className="text-slate-600 mb-6">
              Your merchant application is currently under review. You'll be notified once it's approved.
            </p>
            <div className="bg-slate-50 rounded-lg p-4 text-left">
              <h3 className="font-semibold text-slate-900 mb-2">Business Information</h3>
              <div className="space-y-2 text-sm text-slate-600">
                <p><span className="font-medium">Name:</span> {merchantProfile.business_name}</p>
                <p><span className="font-medium">Category:</span> {merchantProfile.business_category}</p>
                <p><span className="font-medium">Location:</span> {merchantProfile.business_location}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (merchantProfile.approval_status === 'rejected') {
    return (
      <div className="min-h-screen bg-slate-50">
        <Header />
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Clock size={32} className="text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Application Rejected</h2>
            <p className="text-slate-600 mb-4">
              Unfortunately, your merchant application was not approved.
            </p>
            {merchantProfile.rejection_reason && (
              <div className="bg-red-50 rounded-lg p-4 text-left mb-6">
                <p className="text-sm text-red-800"><span className="font-medium">Reason:</span> {merchantProfile.rejection_reason}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  const totalViews = deals.reduce((sum, deal) => sum + deal.views_count, 0);
  const totalSaves = deals.reduce((sum, deal) => sum + deal.saves_count, 0);
  const activeDeals = deals.filter((d) => d.status === 'approved' && new Date(d.end_date) > new Date()).length;

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {merchantProfile.business_name}
          </h1>
          <p className="text-slate-600">{merchantProfile.business_category}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Deals</span>
              <TrendingUp size={20} className="text-blue-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{deals.length}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Active Deals</span>
              <Clock size={20} className="text-green-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{activeDeals}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Views</span>
              <Eye size={20} className="text-orange-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalViews}</p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-2">
              <span className="text-slate-600 text-sm">Total Saves</span>
              <Bookmark size={20} className="text-purple-600" />
            </div>
            <p className="text-3xl font-bold text-slate-900">{totalSaves}</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-slate-200 flex items-center justify-between">
            <h2 className="text-xl font-bold text-slate-900">My Deals</h2>
            <button
              onClick={() => {
                setSelectedDeal(null);
                setShowCreateModal(true);
              }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition"
            >
              <Plus size={20} />
              Create Deal
            </button>
          </div>

          <div className="p-6">
            {deals.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-slate-600 mb-4">No deals yet. Create your first deal!</p>
              </div>
            ) : (
              <div className="space-y-4">
                {deals.map((deal) => (
                  <div
                    key={deal.id}
                    className="border border-slate-200 rounded-lg p-4 hover:border-blue-300 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-slate-900">{deal.title}</h3>
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadge(deal.status)}`}>
                            {deal.status}
                          </span>
                        </div>
                        <p className="text-sm text-slate-600 mb-3">{deal.description}</p>
                        <div className="flex items-center gap-6 text-sm text-slate-600">
                          <span className="font-bold text-blue-600">-{deal.discount_percentage}%</span>
                          <span>{deal.original_price.toLocaleString()} → {deal.discounted_price.toLocaleString()} RWF</span>
                          <span className="flex items-center gap-1">
                            <Eye size={14} />
                            {deal.views_count}
                          </span>
                          <span className="flex items-center gap-1">
                            <Bookmark size={14} />
                            {deal.saves_count}
                          </span>
                          <span>Ends: {new Date(deal.end_date).toLocaleDateString()}</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 ml-4">
                        <button
                          onClick={() => {
                            setSelectedDeal(deal);
                            setShowCreateModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        >
                          <Edit size={18} />
                        </button>
                        <button
                          onClick={() => handleDeleteDeal(deal.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showCreateModal && (
        <CreateDealModal
          merchantId={merchantProfile.id}
          deal={selectedDeal}
          onClose={() => {
            setShowCreateModal(false);
            setSelectedDeal(null);
          }}
          onSuccess={() => {
            setShowCreateModal(false);
            setSelectedDeal(null);
            fetchDeals(merchantProfile.id);
          }}
        />
      )}
    </div>
  );
}
