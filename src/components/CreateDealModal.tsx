import { useState, useEffect, useRef } from 'react';
import { X, Upload, Image as ImageIcon, Trash2 } from 'lucide-react';
import { supabase, Deal, uploadDealImage, deleteDealImage, validateImageFile } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

interface CreateDealModalProps {
  merchantId: string;
  deal?: Deal | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateDealModal({ merchantId, deal, onClose, onSuccess }: CreateDealModalProps) {
  const { user } = useAuth();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    originalPrice: '',
    discountedPrice: '',
    location: '',
    imageUrl: '',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePath, setImagePath] = useState<string>(''); // Store the storage path for cleanup
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
  ];

  useEffect(() => {
    if (deal) {
      setFormData({
        title: deal.title,
        description: deal.description,
        category: deal.category,
        originalPrice: deal.original_price.toString(),
        discountedPrice: deal.discounted_price.toString(),
        location: deal.location,
        imageUrl: deal.image_url || '',
        startDate: deal.start_date.split('T')[0],
        endDate: deal.end_date.split('T')[0],
      });
    }
  }, [deal]);

  const calculateDiscountPercentage = () => {
    const original = parseFloat(formData.originalPrice);
    const discounted = parseFloat(formData.discountedPrice);
    if (original && discounted && original > discounted) {
      return Math.round(((original - discounted) / original) * 100);
    }
    return 0;
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validationError = validateImageFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }

    setError('');
    setSelectedFile(file);
    
    // Create preview URL
    const previewUrl = URL.createObjectURL(file);
    setImagePreview(previewUrl);
  };

  const handleUploadImage = async () => {
    if (!selectedFile || !user) return;

    setUploadingImage(true);
    setError('');

    try {
      const result = await uploadDealImage(selectedFile, user.id);
      setFormData({ ...formData, imageUrl: result.publicUrl });
      setImagePath(result.path);
      setSelectedFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (imagePath) {
      await deleteDealImage(imagePath);
    }
    
    // Clean up preview URL
    if (imagePreview && imagePreview.startsWith('blob:')) {
      URL.revokeObjectURL(imagePreview);
    }
    
    setFormData({ ...formData, imageUrl: '' });
    setImagePreview('');
    setSelectedFile(null);
    setImagePath('');
    
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const original = parseFloat(formData.originalPrice);
    const discounted = parseFloat(formData.discountedPrice);

    if (discounted >= original) {
      setError('Discounted price must be less than original price');
      setLoading(false);
      return;
    }

    const dealData = {
      merchant_id: merchantId,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      original_price: original,
      discounted_price: discounted,
      discount_percentage: calculateDiscountPercentage(),
      location: formData.location,
      image_url: formData.imageUrl || null,
      start_date: new Date(formData.startDate).toISOString(),
      end_date: new Date(formData.endDate).toISOString(),
      status: 'pending',
    };

    let result;
    if (deal) {
      result = await supabase.from('deals').update(dealData).eq('id', deal.id);
    } else {
      result = await supabase.from('deals').insert(dealData);
    }

    if (result.error) {
      setError(result.error.message);
      setLoading(false);
    } else {
      onSuccess();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-slate-200 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">
            {deal ? 'Edit Deal' : 'Create New Deal'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deal Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              placeholder="e.g., 50% Off All Pizzas"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Description *
            </label>
            <textarea
              required
              rows={3}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none"
              placeholder="Describe your deal..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Category *
              </label>
              <select
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Select category</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="e.g., Kigali, Kimironko"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Original Price (RWF) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.originalPrice}
                onChange={(e) => setFormData({ ...formData, originalPrice: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="10000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Discounted Price (RWF) *
              </label>
              <input
                type="number"
                required
                min="0"
                step="0.01"
                value={formData.discountedPrice}
                onChange={(e) => setFormData({ ...formData, discountedPrice: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                placeholder="5000"
              />
            </div>
          </div>

          {formData.originalPrice && formData.discountedPrice && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-sm text-green-800">
                Discount: <span className="font-bold">{calculateDiscountPercentage()}%</span>
              </p>
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Start Date *
              </label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-2">
                End Date *
              </label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                min={formData.startDate}
                className="w-full px-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Deal Image (Optional)
            </label>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileSelect}
              className="hidden"
            />
            
            {/* Current image display */}
            {formData.imageUrl && (
              <div className="relative mb-3 max-w-xs">
                <img
                  src={formData.imageUrl}
                  alt="Deal preview"
                  className="w-full h-32 object-cover rounded-lg border border-slate-300"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            )}
            
            {/* File preview (for newly selected files) */}
            {selectedFile && imagePreview && (
              <div className="mb-3">
                <div className="relative max-w-xs">
                  <img
                    src={imagePreview}
                    alt="Selected file preview"
                    className="w-full h-32 object-cover rounded-lg border border-slate-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-lg">
                    <div className="text-white text-center">
                      <ImageIcon size={24} className="mx-auto mb-1" />
                      <p className="text-xs">Ready to upload</p>
                    </div>
                  </div>
                </div>
                <div className="flex gap-2 mt-2">
                  <button
                    type="button"
                    onClick={handleUploadImage}
                    disabled={uploadingImage}
                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                  >
                    {uploadingImage ? 'Uploading...' : 'Upload'}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedFile(null);
                      setImagePreview('');
                      if (fileInputRef.current) {
                        fileInputRef.current.value = '';
                      }
                    }}
                    className="px-3 py-1 bg-gray-500 text-white text-sm rounded-lg hover:bg-gray-600 transition"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
            
            {/* Upload button */}
            {!selectedFile && !formData.imageUrl && (
              <button
                type="button"
                onClick={triggerFileSelect}
                className="w-full h-32 border-2 border-dashed border-slate-300 rounded-lg flex flex-col items-center justify-center text-slate-500 hover:border-slate-400 hover:text-slate-600 transition"
              >
                <Upload size={32} className="mb-2" />
                <p className="text-sm font-medium">Click to upload image</p>
                <p className="text-xs text-slate-400">PNG, JPG, WebP up to 5MB</p>
              </button>
            )}
            
            {/* Add new image button (when image already exists) */}
            {(formData.imageUrl && !selectedFile) && (
              <button
                type="button"
                onClick={triggerFileSelect}
                className="mt-2 px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition flex items-center gap-2"
              >
                <Upload size={16} />
                Change Image
              </button>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : deal ? 'Update Deal' : 'Create Deal'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
