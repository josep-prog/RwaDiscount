import { useEffect, useMemo, useState } from 'react';
import { X, ZoomIn, ZoomOut, Phone, Copy, MapPin, Clock, Heart, Bookmark } from 'lucide-react';
import { Deal, MerchantProfile, supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export type DealWithMerchant = Deal & {
  merchant_profiles: MerchantProfile;
};

interface Props {
  open: boolean;
  deal: DealWithMerchant;
  onClose: () => void;
}

export default function DealDetailsModal({ open, deal, onClose }: Props) {
  const { user } = useAuth();
  const [zoom, setZoom] = useState(1);
  const [likesCount, setLikesCount] = useState<number>(0);
  const [isSaved, setIsSaved] = useState(false);
  const [isLiked, setIsLiked] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) return;

    const fetchCounts = async () => {
      // Likes count (only available to authenticated due to RLS in repo)
      const { count } = await supabase
        .from('deal_feedback')
        .select('*', { count: 'exact', head: true })
        .eq('deal_id', deal.id)
        .eq('is_positive', true);
      setLikesCount(count || 0);

      if (user) {
        const { data: existing } = await supabase
          .from('deal_feedback')
          .select('is_positive')
          .eq('user_id', user.id)
          .eq('deal_id', deal.id)
          .maybeSingle();
        setIsLiked(existing ? existing.is_positive : null);

        const { data: saved } = await supabase
          .from('saved_deals')
          .select('id')
          .eq('user_id', user.id)
          .eq('deal_id', deal.id)
          .maybeSingle();
        setIsSaved(!!saved);
      }
    };

    fetchCounts();
  }, [open, deal.id, user]);

  const increaseZoom = () => setZoom((z) => Math.min(3, z + 0.25));
  const decreaseZoom = () => setZoom((z) => Math.max(1, z - 0.25));

  const phone = deal.merchant_profiles.business_phone;
  const mapsUrl = useMemo(() => `https://www.google.com/maps/search/${encodeURIComponent(deal.location)}`,[deal.location]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(phone);
    } catch {}
  };

  const toggleSave = async () => {
    if (!user) return;
    if (isSaved) {
      await supabase.from('saved_deals').delete().eq('user_id', user.id).eq('deal_id', deal.id);
      setIsSaved(false);
    } else {
      await supabase.from('saved_deals').insert({ user_id: user.id, deal_id: deal.id });
      setIsSaved(true);
    }
  };

  const toggleLike = async () => {
    if (!user) return;
    if (isLiked === true) {
      await supabase.from('deal_feedback').delete().eq('user_id', user.id).eq('deal_id', deal.id);
      setIsLiked(null);
      setLikesCount((c) => Math.max(0, c - 1));
    } else {
      await supabase.from('deal_feedback').upsert({ user_id: user.id, deal_id: deal.id, is_positive: true }, { onConflict: 'user_id,deal_id' });
      setLikesCount((c) => c + 1);
      setIsLiked(true);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      onClick={(e) => {
        // Prevent clicks inside the modal from bubbling to underlying card
        e.stopPropagation();
      }}
    >
      <div className="bg-white w-full max-w-5xl rounded-2xl overflow-hidden shadow-xl">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-semibold">{deal.title}</h3>
          <button className="p-2 rounded-lg hover:bg-slate-100" onClick={onClose} aria-label="Close">
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
          <div className="bg-slate-100 flex items-center justify-center min-h-[360px] overflow-hidden">
            {deal.image_url ? (
              <img
                src={deal.image_url}
                alt={deal.title}
                loading="lazy"
                className="max-h-[70vh] object-contain transition-transform"
                style={{ transform: `scale(${zoom})` }}
              />
            ) : (
              <div className="text-slate-500">No image</div>
            )}
          </div>

          <div className="p-6 space-y-4">
            <div className="flex items-center gap-2 text-sm text-slate-600">
              <MapPin size={16} />
              <span>{deal.location}</span>
              <Clock size={16} className="ml-4" />
              <span>Valid until {new Date(deal.end_date).toLocaleDateString()}</span>
            </div>

            <p className="text-slate-700 whitespace-pre-line">{deal.description}</p>

            <div className="flex items-baseline gap-2">
              <span className="text-2xl font-bold text-blue-600">{deal.discounted_price.toLocaleString()} RWF</span>
              <span className="line-through text-slate-500">{deal.original_price.toLocaleString()} RWF</span>
              <span className="ml-2 text-sm bg-red-100 text-red-700 px-2 py-0.5 rounded-full">-{deal.discount_percentage}%</span>
            </div>

            <div className="border rounded-xl p-4">
              <h4 className="font-semibold mb-2">Merchant</h4>
              <div className="text-sm text-slate-700 space-y-1">
                <p className="font-medium">{deal.merchant_profiles.business_name}</p>
                <p>Phone: {phone}</p>
                <p>Location: {deal.merchant_profiles.business_location}</p>
              </div>

              <div className="mt-3 flex flex-wrap gap-2">
                <a href={`tel:${phone}`} className="inline-flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                  <Phone size={16} /> Call merchant
                </a>
                <button onClick={handleCopy} className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                  <Copy size={16} /> Copy number
                </button>
                <a href={mapsUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 px-3 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200">
                  <MapPin size={16} /> Open in Maps
                </a>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button onClick={decreaseZoom} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200" aria-label="Zoom out">
                  <ZoomOut size={18} />
                </button>
                <button onClick={increaseZoom} className="p-2 rounded-lg bg-slate-100 hover:bg-slate-200" aria-label="Zoom in">
                  <ZoomIn size={18} />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <button onClick={toggleLike} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${isLiked ? 'bg-pink-100 text-pink-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  <Heart size={16} fill={isLiked ? 'currentColor' : 'none'} /> {likesCount}
                </button>
                <button onClick={toggleSave} className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg ${isSaved ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}>
                  <Bookmark size={16} fill={isSaved ? 'currentColor' : 'none'} /> Save
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}