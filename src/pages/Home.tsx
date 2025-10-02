import { useEffect, useState } from 'react';
import { Search, Tag, TrendingUp, Bookmark } from 'lucide-react';
import { supabase, Deal, MerchantProfile } from '../lib/supabase';
import DealCard from '../components/DealCard';
import Header from '../components/Header';

type DealWithMerchant = Deal & {
  merchant_profiles: MerchantProfile;
};

export default function Home() {
  // Note: viewing deals is public; auth only needed for like/save
  const [deals, setDeals] = useState<DealWithMerchant[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'discount' | 'ending'>('newest');

  const categories = [
    'all',
    'Restaurants',
    'Supermarkets',
    'Electronics',
    'Fashion',
    'Health & Beauty',
    'Services',
    'Entertainment',
  ];

  useEffect(() => {
    fetchDeals();
  }, [sortBy, selectedCategory]);

  const fetchDeals = async () => {
    setLoading(true);
    let query = supabase
      .from('deals')
      .select('*, merchant_profiles(*)')
      .eq('status', 'approved')
      .gt('end_date', new Date().toISOString());

    if (selectedCategory !== 'all') {
      query = query.eq('category', selectedCategory);
    }

    if (sortBy === 'newest') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'discount') {
      query = query.order('discount_percentage', { ascending: false });
    } else if (sortBy === 'ending') {
      query = query.order('end_date', { ascending: true });
    }

    const { data, error } = await query;

    if (!error && data) {
      setDeals(data as DealWithMerchant[]);
    }
    setLoading(false);
  };

  const filteredDeals = deals.filter((deal) =>
    deal.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    deal.merchant_profiles.business_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-50">
      <Header />

      <div className="relative bg-gradient-to-r from-blue-600 to-blue-700 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Discover Amazing Deals in Rwanda
            </h1>
            <p className="text-xl text-blue-100">
              Save more on your favorite products and services
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
              <input
                type="text"
                placeholder="Search for deals, businesses, or products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-12 pr-4 py-4 rounded-xl text-slate-900 border-0 shadow-lg focus:ring-2 focus:ring-blue-300 outline-none"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-64 space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <Tag size={18} />
                Categories
              </h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`w-full text-left px-4 py-2 rounded-lg transition ${
                      selectedCategory === category
                        ? 'bg-blue-600 text-white'
                        : 'text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {category === 'all' ? 'All Categories' : category}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-xl p-6 shadow-sm">
              <h3 className="font-semibold text-slate-900 mb-4 flex items-center gap-2">
                <TrendingUp size={18} />
                Sort By
              </h3>
              <div className="space-y-2">
                <button
                  onClick={() => setSortBy('newest')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    sortBy === 'newest'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Newest First
                </button>
                <button
                  onClick={() => setSortBy('discount')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    sortBy === 'discount'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Highest Discount
                </button>
                <button
                  onClick={() => setSortBy('ending')}
                  className={`w-full text-left px-4 py-2 rounded-lg transition ${
                    sortBy === 'ending'
                      ? 'bg-blue-600 text-white'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Ending Soon
                </button>
              </div>
            </div>
          </aside>

          <main className="flex-1">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-slate-900">
                {selectedCategory === 'all' ? 'All Deals' : selectedCategory}
              </h2>
              <p className="text-slate-600 mt-1">
                {filteredDeals.length} {filteredDeals.length === 1 ? 'deal' : 'deals'} available
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="bg-white rounded-xl p-6 shadow-sm animate-pulse">
                    <div className="h-48 bg-slate-200 rounded-lg mb-4"></div>
                    <div className="h-4 bg-slate-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-slate-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            ) : filteredDeals.length === 0 ? (
              <div className="bg-white rounded-xl p-12 text-center shadow-sm">
                <Bookmark size={48} className="mx-auto text-slate-300 mb-4" />
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No deals found</h3>
                <p className="text-slate-600">
                  Try adjusting your filters or search terms
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredDeals.map((deal) => (
                  <DealCard key={deal.id} deal={deal} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
}
