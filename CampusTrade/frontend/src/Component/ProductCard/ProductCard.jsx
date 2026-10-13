import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Heart, MapPin, Tag, Star, ArrowRight, Share2, Copy, MessageCircle, Check, Pencil, Trash2 } from 'lucide-react';
import { StoreContext } from '../../Context/Storecontext';
import { AuthContext } from '../../Context/AuthContext';
import { getCategoryFallbackImage } from '../../utils/categoryImages';
import productService from '../../services/productService';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

const ProductCard = ({ id, name, price, description, image, availability, rentDaily, category, location, ownerId }) => {
  const { toggleWishlist, wishlistItems, fetchProducts } = useContext(StoreContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  const isWishlisted = wishlistItems.includes(id);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleting, setDeleting] = useState(false);

  // Check if logged-in user is the product owner
  const getOwnerIdString = (oid) => {
    if (!oid) return '';
    if (typeof oid === 'string') return oid;
    if (typeof oid === 'object' && oid._id) return String(oid._id);
    return String(oid);
  };
  const ownerIdStr = getOwnerIdString(ownerId);
  const userIdStr = user?._id ? String(user._id) : '';
  const isOwner = !!(userIdStr && ownerIdStr && userIdStr === ownerIdStr);

  // Robust image source handler with category-based fallback
  const getImageSrc = () => {
    if (imgError) return getCategoryFallbackImage(category);
    if (!image) return getCategoryFallbackImage(category);
    
    // Vite-resolved module or local assets
    if (typeof image === 'object' || (typeof image === 'string' && image.includes('/assets/'))) return image;
    
    // Full URLs (Cloudinary, S3, etc.)
    if (typeof image === 'string' && image.startsWith('http')) return image;
    
    // Base64 or Blobs
    if (typeof image === 'string' && (image.startsWith('data:') || image.startsWith('blob:'))) return image;
    
    // Server uploads (Handle both /uploads and uploads/ formats)
    if (typeof image === 'string') {
      if (image.startsWith('/uploads')) return `${API_BASE}${image}`;
      if (image.startsWith('uploads/')) return `${API_BASE}/${image}`;
    }
    
    return image;
  };

  const imageSrc = getImageSrc();

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(id);
  };

  const handleShareToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowShareMenu(!showShareMenu);
  };

  const handleCopyLink = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${id}`;
    try {
      await navigator.clipboard.writeText(productUrl);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => {
        setCopied(false);
        setShowShareMenu(false);
      }, 1500);
    } catch (err) {
      toast.error('Failed to copy link');
    }
  };

  const handleWhatsAppShare = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${id}`;
    const message = `🏷️ Check out "${name}" on CampusTrade!\n💰 Price: ₹${price || rentDaily}\n🔗 ${productUrl}`;
    const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    setShowShareMenu(false);
  };

  const handleImageError = () => {
    setImgError(true);
  };

  const handleEdit = (e) => {
    e.preventDefault();
    e.stopPropagation();
    navigate(`/sell?edit=${id}`);
  };

  const handleDeleteClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(true);
  };

  const handleDeleteConfirm = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleting(true);
    try {
      await productService.deleteProduct(id);
      toast.success('Listing deleted successfully!');
      setShowDeleteConfirm(false);
      fetchProducts(); // Refresh the product list
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to delete listing');
    } finally {
      setDeleting(false);
    }
  };

  const handleDeleteCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowDeleteConfirm(false);
  };

  return (
    <Link to={`/product/${id}`} className="block group h-full">
      <div className="card-premium h-full flex flex-col overflow-hidden relative">
        {/* Hover glow effect */}
        <div className="absolute inset-0 rounded-[2rem] opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
          style={{ 
            background: 'linear-gradient(135deg, rgba(129,140,248,0.03), rgba(167,139,250,0.04), transparent)',
          }}
        />

        {/* Delete Confirmation Overlay */}
        <AnimatePresence>
          {showDeleteConfirm && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 bg-slate-900/70 backdrop-blur-md rounded-[2rem] flex items-center justify-center p-6"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0.8 }}
                className="bg-white/95 backdrop-blur-xl rounded-3xl p-6 text-center shadow-2xl max-w-xs w-full border border-white/40 dark:border-white/10"
              >
                <div className="w-14 h-14 bg-red-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Trash2 className="w-7 h-7 text-red-500" />
                </div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white mb-2">Delete Listing?</h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">This action cannot be undone. The listing will be permanently removed.</p>
                <div className="flex gap-3">
                  <button
                    onClick={handleDeleteCancel}
                    className="flex-1 px-4 py-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-sm hover:bg-slate-200 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDeleteConfirm}
                    disabled={deleting}
                    className="flex-1 px-4 py-3 rounded-xl bg-red-500 text-white font-bold text-sm hover:bg-red-600 transition-colors disabled:opacity-50"
                  >
                    {deleting ? 'Deleting...' : 'Delete'}
                  </button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Image Container */}
        <div className="relative aspect-[4/5] overflow-hidden bg-gradient-to-br from-slate-100 to-slate-50">
          <img
            src={imageSrc}
            alt={name}
            className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110 group-hover:brightness-[1.02]"
            onError={handleImageError}
            loading="lazy"
          />

          {/* Gradient overlay on hover */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Status Badges */}
          <div className="absolute top-4 left-4 flex flex-col gap-2">
            <span className="badge-indigo bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl border-0 shadow-md capitalize">
              {category || 'General'}
            </span>
            {isOwner && (
              <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold tracking-wider uppercase bg-amber-50/80 text-amber-600 border border-amber-200/50 backdrop-blur-xl shadow-md">
                Your Listing
              </span>
            )}
          </div>

          {/* Quick Actions (Wishlist + Share) */}
          <div className="absolute top-4 right-4 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0">
            <button
              onClick={handleWishlist}
              className={`w-10 h-10 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-full flex items-center justify-center transition-all duration-200 border border-white/40 dark:border-white/10 shadow-lg hover:scale-110 ${isWishlisted ? 'bg-red-50/80' : 'hover:bg-white/90'}`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 transition-colors ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-slate-700 dark:text-slate-300 hover:text-red-500'}`} />
            </button>
            <button
              onClick={handleShareToggle}
              className="w-10 h-10 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-full flex items-center justify-center hover:bg-white/90 transition-all duration-200 border border-white/40 dark:border-white/10 shadow-lg hover:scale-110"
              title="Share"
            >
              <Share2 className="w-4 h-4 text-slate-700 dark:text-slate-300" />
            </button>
          </div>

          {/* Share Dropdown Menu */}
          {showShareMenu && (
            <div 
              className="absolute top-20 right-4 z-20 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.15)] border border-white/40 dark:border-white/10 overflow-hidden min-w-[180px] animate-slide-down"
              onClick={(e) => { e.preventDefault(); e.stopPropagation(); }}
            >
              <button
                onClick={handleCopyLink}
                className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:bg-indigo-900/30/60 hover:text-indigo-600 transition-colors flex items-center gap-3"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                {copied ? 'Copied!' : 'Copy Link'}
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-50/60 hover:text-emerald-600 transition-colors flex items-center gap-3"
              >
                <MessageCircle className="w-4 h-4" />
                Share via WhatsApp
              </button>
            </div>
          )}

          {/* Price Overlay */}
          <div className="absolute bottom-4 left-4 right-4 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-400">
            <div className="bg-white/60 backdrop-blur-2xl rounded-2xl p-3 flex justify-between items-center border border-white/40 dark:border-white/10 shadow-xl">
              <div>
                <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  {availability === 'Rent' ? 'Daily Rate' : 'Price'}
                </p>
                <p className="text-xl font-black gradient-text">₹{availability === 'Rent' ? (rentDaily || price) : price}</p>
              </div>
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-300/30 hover:scale-110 transition-transform">
                <ArrowRight className="w-5 h-5" />
              </div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex-1 flex flex-col relative z-10">
          <div className="mb-3 flex justify-between items-start">
            <h3 className="text-xl font-bold text-slate-800 dark:text-slate-200 line-clamp-1 group-hover:text-indigo-600 transition-colors duration-300">
              {name}
            </h3>
          </div>

          <div className="flex items-center gap-4 mb-4 text-sm font-medium text-slate-500 dark:text-slate-400">
            <div className="flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>{location || 'Campus'}</span>
            </div>
            <div className="flex items-center gap-1">
              <Tag className="w-3.5 h-3.5" />
              <span>{availability}</span>
            </div>
          </div>

          <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-6 flex-1 leading-relaxed">
            {description}
          </p>

          <div className="pt-4 border-t border-slate-100 dark:border-slate-700/50/60 flex items-center justify-between mt-auto">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 text-amber-400 fill-amber-400" />
              <span className="text-sm font-bold text-slate-700 dark:text-slate-300">4.8</span>
              <span className="text-xs text-slate-400 font-medium">(Verified)</span>
            </div>
            <span className="text-sm font-bold text-indigo-600 bg-indigo-50 dark:bg-indigo-900/30/60 px-2.5 py-1 rounded-lg">{availability === 'Rent' ? 'For Rent' : 'For Sale'}</span>
          </div>

          {/* Owner Actions — Always visible */}
          {isOwner && (
            <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/50/60 flex gap-3">
              <button
                onClick={handleEdit}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-900/30/60 text-indigo-600 font-bold text-sm hover:bg-indigo-100 transition-all duration-200 hover:scale-[1.02]"
              >
                <Pencil className="w-4 h-4" />
                Edit
              </button>
              <button
                onClick={handleDeleteClick}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl bg-red-50/60 text-red-500 font-bold text-sm hover:bg-red-100 transition-all duration-200 hover:scale-[1.02]"
              >
                <Trash2 className="w-4 h-4" />
                Delete
              </button>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
