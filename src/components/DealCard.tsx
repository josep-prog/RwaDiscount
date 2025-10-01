import { useState } from 'react';
import { MapPin, Clock, Bookmark, ThumbsUp, ThumbsDown, Eye } from 'lucide-react';
import { supabase, Deal, MerchantProfile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

type DealWithMerchant = Deal & {
  merchant_profiles: MerchantProfile;
};

interface DealCardProps {
  deal: DealWithMerchant;
}

export default function DealCard({ deal }: DealCardProps) {
  const { user } = useAuth();
  const [isSaved, setIsSaved] = useState(false);
  const [feedback, setFeedback] = useState<boolean | null>(null);
  const [savesCount, setSavesCount] = useState(deal.saves_count);

  const daysLeft = Math.ceil(
    (new Date(deal.end_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
  );

  const handleSave = async () => {
    if (!user) return;

    if (isSaved) {
      await supabase.from('saved_deals').delete().eq('user_id', user.id).eq('deal_id', deal.id);
      setIsSaved(false);
      setSavesCount(savesCount - 1);
    } else {
      await supabase.from('saved_deals').insert({ user_id: user.id, deal_id: deal.id });
      setIsSaved(true);
      setSavesCount(savesCount + 1);
    }
  };

  const handleFeedback = async (isPositive: boolean) => {
    if (!user) return;

    if (feedback === isPositive) {
      await supabase.from('deal_feedback').delete().eq('user_id', user.id).eq('deal_id', deal.id);
      setFeedback(null);
    } else {
      await supabase.from('deal_feedback').upsert(
        { user_id: user.id, deal_id: deal.id, is_positive: isPositive },
        { onConflict: 'user_id,deal_id' }
      );
      setFeedback(isPositive);
    }
  };

  const handleView = async () => {
    await supabase
      .from('deals')
      .update({ views_count: deal.views_count + 1 })
      .eq('id', deal.id);
  };

  return (
    <div
      className="bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
      onClick={handleView}
    >
      <div className="relative h-48 bg-slate-200">
        {deal.image_url ? (
          <img
            src={deal.image_url}
            alt={deal.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-400">
            No Image
          </div>
        )}
        <div className="absolute top-3 right-3 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm shadow-lg">
          -{deal.discount_percentage}%
        </div>
        {daysLeft <= 3 && (
          <div className="absolute top-3 left-3 bg-orange-500 text-white px-3 py-1 rounded-full font-semibold text-xs shadow-lg">
            Ending Soon
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="mb-3">
          <h3 className="text-lg font-bold text-slate-900 mb-1 line-clamp-1">{deal.title}</h3>
          <p className="text-sm text-slate-600 line-clamp-2">{deal.description}</p>
        </div>

        <div className="flex items-center gap-2 mb-3 text-sm text-slate-600">
          <img
            src={deal.merchant_profiles.business_logo_url || ''}
            alt={deal.merchant_profiles.business_name}
            className="w-5 h-5 rounded-full bg-slate-200"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <span className="font-medium">{deal.merchant_profiles.business_name}</span>
        </div>

        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-2xl font-bold text-blue-600">
            {deal.discounted_price.toLocaleString()} RWF
          </span>
          <span className="text-sm text-slate-500 line-through">
            {deal.original_price.toLocaleString()} RWF
          </span>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-600 mb-4">
          <div className="flex items-center gap-1">
            <MapPin size={16} />
            <span className="line-clamp-1">{deal.location}</span>
          </div>
          <div className="flex items-center gap-1">
            <Clock size={16} />
            <span>{daysLeft} days left</span>
          </div>
        </div>

        {user && (
          <div className="flex items-center justify-between pt-4 border-t border-slate-100">
            <div className="flex items-center gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeedback(true);
                }}
                className={`p-2 rounded-lg transition ${
                  feedback === true
                    ? 'bg-green-100 text-green-600'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <ThumbsUp size={18} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  handleFeedback(false);
                }}
                className={`p-2 rounded-lg transition ${
                  feedback === false
                    ? 'bg-red-100 text-red-600'
                    : 'text-slate-400 hover:bg-slate-100'
                }`}
              >
                <ThumbsDown size={18} />
              </button>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleSave();
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition ${
                isSaved
                  ? 'bg-blue-100 text-blue-600'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              <Bookmark size={18} fill={isSaved ? 'currentColor' : 'none'} />
              <span>{savesCount}</span>
            </button>
          </div>
        )}

        <div className="flex items-center gap-1 text-xs text-slate-500 mt-3">
          <Eye size={14} />
          <span>{deal.views_count} views</span>
        </div>
      </div>
    </div>
  );
}
