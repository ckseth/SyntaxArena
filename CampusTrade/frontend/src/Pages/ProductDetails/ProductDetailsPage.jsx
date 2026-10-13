import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star, Heart, ShoppingCart, Calendar, MapPin, Search,
  ShieldCheck, Truck, Shield, Sparkles, Loader, ChevronLeft,
  Share2, Tag, ArrowRight, Copy, MessageCircle, Check,
  Minus, Plus, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { StoreContext } from '../../Context/Storecontext';
import { AuthContext } from '../../Context/AuthContext';
import productService from '../../services/productService';
import toast from 'react-hot-toast';

import { getCategoryFallbackImage } from '../../utils/categoryImages';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { productList, addToCart, toggleWishlist, wishlistItems, updateRentalDays } = useContext(StoreContext);
  const { user } = useContext(AuthContext);

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imgError, setImgError] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showRentModal, setShowRentModal] = useState(false);
  const [rentDays, setRentDays] = useState(1);
  const [showMessageModal, setShowMessageModal] = useState(false);
  const [message, setMessage] = useState('');

  const isWishlisted = wishlistItems.includes(id);

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true);
        let foundProduct = productList.find(item => item._id === id);

        if (!foundProduct) {
          const data = await productService.getProductById(id);
          foundProduct = data?.product || data;
        }

        if (foundProduct) {
          setProduct({
            ...foundProduct,
            name: foundProduct.name || foundProduct.title || 'Untitled Product',
            image: foundProduct.image || (foundProduct.images && foundProduct.images.length > 0 ? foundProduct.images[0] : null),
          });
        }
      } catch (error) {
        toast.error("Could not load product details");
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, productList]);

  const getImageSrc = () => {
    const fallback = getCategoryFallbackImage(product?.category);
    if (imgError || !product?.image) return fallback;
    const img = product.image;
    if (typeof img === 'object' || (typeof img === 'string' && img.includes('/assets/'))) return img;
    if (typeof img === 'string' && img.startsWith('http')) return img;
    if (typeof img === 'string' && (img.startsWith('data:') || img.startsWith('blob:'))) return img;
    if (typeof img === 'string' && img.startsWith('/uploads')) return `${API_BASE}${img}`;
    return img;
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success('Link copied to clipboard!');
      setTimeout(() => { setCopied(false); setShowShareMenu(false); }, 1500);
    } catch (err) {
      toast.error('Could not copy link');
    }
  };

  const handleWhatsAppShare = () => {
    const msg = `🏷️ Check out "${product.name}" on CampusTrade!\n💰 Price: ₹${product.price || product.rentDaily}\n📝 ${product.description}\n🔗 ${window.location.href}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
    setShowShareMenu(false);
  };

  const handleShare = async () => {
    const shareData = { title: product.name, text: `Check out this deal on CampusTrade: ${product.description}`, url: window.location.href };
    try {
      if (navigator.share) { await navigator.share(shareData); toast.success('Shared!'); }
      else setShowShareMenu(!showShareMenu);
    } catch (err) {
      if (err.name !== 'AbortError') setShowShareMenu(!showShareMenu);
    }
  };

  // Rent Item handler
  const handleRentItem = () => {
    addToCart(product._id || id);
    updateRentalDays(product._id || id, rentDays);
    toast.success(`Renting for ${rentDays} day${rentDays > 1 ? 's' : ''} — added to cart!`);
    setShowRentModal(false);
  };

  // Message Seller handler
  const handleSendMessage = () => {
    if (!message.trim()) { toast.error('Please type a message'); return; }
    const sellerName = product.ownerId?.name || 'Seller';
    const sellerEmail = product.ownerId?.email || '';
    
    // WhatsApp message to seller
    const whatsappMsg = `Hi ${sellerName}, I'm interested in your listing "${product.name}" (₹${product.price || product.rentDaily}) on CampusTrade.\n\n${message}\n\n🔗 ${window.location.href}`;
    
    if (sellerEmail) {
      // If email available, offer both options
      const mailSubject = `CampusTrade: Interested in "${product.name}"`;
      const mailBody = `Hi ${sellerName},\n\nI'm interested in your listing "${product.name}" on CampusTrade.\n\n${message}\n\nProduct link: ${window.location.href}\n\nThanks,\n${user?.name || 'A Student'}`;
      window.open(`mailto:${sellerEmail}?subject=${encodeURIComponent(mailSubject)}&body=${encodeURIComponent(mailBody)}`);
    } else {
      window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
    }
    
    toast.success('Message sent! The seller will respond soon.');
    setShowMessageModal(false);
    setMessage('');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="animate-pulse-glow p-6 rounded-full">
          <Loader className="w-12 h-12 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] orb orb-indigo" />
        <div className="text-center relative z-10">
          <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30/60 backdrop-blur-sm rounded-full flex items-center justify-center mx-auto mb-6 animate-float">
            <Search className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Product Not Found</h1>
          <p className="text-slate-500 dark:text-slate-400 mb-8">This item may have been sold or removed.</p>
          <Link to="/" className="btn-primary inline-flex">Return Home</Link>
        </div>
      </div>
    );
  }

  const imageSrc = getImageSrc();
  const unitPrice = product.price || product.rentDaily || 0;

  return (
    <div className="min-h-screen pt-28 sm:pt-32 pb-20 sm:pb-32 relative">
      {/* Decorative orbs */}
      <div className="absolute top-[5%] right-[-5%] w-[500px] h-[500px] orb orb-indigo opacity-20" />
      <div className="absolute bottom-[10%] left-[-8%] w-[400px] h-[400px] orb orb-purple opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Navigation */}
        <div className="flex justify-between items-center mb-8 sm:mb-12 animate-fade-in-up">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-bold transition-all group">
            <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            <span className="hidden sm:inline">Back</span>
          </button>
          <div className="flex gap-3 relative">
            <button onClick={handleShare} className="w-11 h-11 sm:w-12 sm:h-12 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-indigo-600 transition-all border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md hover:scale-105" title="Share Item">
              <Share2 className="w-5 h-5" />
            </button>
            {showShareMenu && (
              <div className="absolute top-14 right-14 z-20 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.15)] border border-white/40 dark:border-white/10 overflow-hidden min-w-[200px] animate-slide-down">
                <button onClick={handleCopyLink} className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-indigo-50 dark:bg-indigo-900/30/60 hover:text-indigo-600 transition-colors flex items-center gap-3">
                  {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                  {copied ? 'Copied!' : 'Copy Link'}
                </button>
                <button onClick={handleWhatsAppShare} className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-emerald-50/60 hover:text-emerald-600 transition-colors flex items-center gap-3">
                  <MessageCircle className="w-4 h-4" />
                  Share via WhatsApp
                </button>
              </div>
            )}
            <button
              onClick={() => toggleWishlist(product._id || id)}
              className={`w-11 h-11 sm:w-12 sm:h-12 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center transition-all border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md hover:scale-105 ${isWishlisted ? 'text-red-500 bg-red-50/50' : 'text-slate-500 dark:text-slate-400 hover:text-red-500'}`}
              title="Wishlist"
            >
              <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 lg:gap-16 items-start">
          {/* Gallery */}
          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="relative aspect-square rounded-[2rem] sm:rounded-[3rem] overflow-hidden bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm shadow-[0_20px_60px_rgba(99,102,241,0.08)] group border border-white/40 dark:border-white/10"
            >
              <img
                src={imageSrc}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
                onError={() => setImgError(true)}
              />
              {/* Hover gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <div className="absolute top-4 left-4 sm:top-8 sm:left-8 flex flex-col gap-2 sm:gap-3">
                <span className="badge-indigo bg-white/90 backdrop-blur-xl shadow-lg border-0 py-1.5 px-3 sm:py-2 sm:px-4 !text-xs sm:!text-sm capitalize">
                  {product.category}
                </span>
                <span className="inline-flex items-center px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold bg-emerald-500 text-white shadow-lg border-0 backdrop-blur-xl">
                  {product.availability === 'Rent' ? 'Rental Available' : 'Verified Listing'}
                </span>
              </div>
            </motion.div>
          </div>

          {/* Details */}
          <div className="space-y-6 sm:space-y-10">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <div className="flex items-center gap-2 text-indigo-600 font-black uppercase tracking-widest text-xs mb-3 sm:mb-4">
                <Sparkles className="w-4 h-4 animate-pulse" />
                Featured Listing
              </div>
              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 dark:text-white leading-[1.1] mb-4 sm:mb-6">{product.name}</h1>
              <div className="flex items-center gap-3 sm:gap-4 flex-wrap">
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-4 h-4 sm:w-5 sm:h-5 text-amber-400 fill-amber-400" />)}
                </div>
                <span className="text-sm sm:text-base text-slate-400 font-bold">4.8 (Verified)</span>
              </div>
            </motion.div>

            {/* Price Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 border border-white/40 dark:border-white/10 shadow-[0_8px_40px_rgba(99,102,241,0.06)] relative overflow-hidden animate-border-glow"
            >
              <div className="absolute top-0 right-0 w-24 sm:w-32 h-24 sm:h-32 bg-gradient-to-br from-indigo-100/30 to-purple-100/30 rounded-full translate-x-1/2 -translate-y-1/2 blur-xl" />
              <div className="flex items-baseline gap-3 sm:gap-4 mb-2 flex-wrap relative z-10">
                <span className="text-4xl sm:text-6xl font-black gradient-text">₹{unitPrice}</span>
                <span className="text-base sm:text-lg font-bold text-slate-400">
                  {product.availability === 'Rent' ? '/ day' : 'One-time payment'}
                </span>
              </div>
              <p className="text-sm font-bold text-emerald-600 flex items-center gap-2 relative z-10">
                <ShieldCheck className="w-4 h-4" />
                Secure transaction through CampusTrade
              </p>
            </motion.div>

            {/* Description */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="space-y-3 sm:space-y-4">
              <h4 className="text-sm font-black uppercase tracking-widest text-slate-400">Description</h4>
              <p className="text-base sm:text-xl text-slate-600 dark:text-slate-400 leading-relaxed font-medium">
                {product.description}
              </p>
            </motion.div>

            {/* Seller Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
              className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6 p-5 sm:p-6 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-[1.5rem] sm:rounded-[2rem] border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md transition-all"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center font-black text-xl sm:text-2xl text-white flex-shrink-0 shadow-lg shadow-indigo-200/30">
                {product.ownerId?.name?.[0] || 'S'}
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="font-black text-slate-900 dark:text-white text-base sm:text-lg">{product.ownerId?.name || 'Student Seller'}</h4>
                <p className="text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1 text-sm">
                  <MapPin className="w-4 h-4 flex-shrink-0" />
                  <span className="truncate">{product.location || 'Campus Central'} • Available for meetup</span>
                </p>
              </div>
              <button 
                onClick={() => setShowMessageModal(true)}
                className="w-full sm:w-auto btn-outline !py-2.5 !px-5 text-sm flex items-center justify-center gap-2"
              >
                <MessageCircle className="w-4 h-4" />
                Message Seller
              </button>
            </motion.div>

            {/* Actions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }} className="pt-4 sm:pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4">
                <button
                  onClick={() => { addToCart(product._id || id); }}
                  className="flex-[2] btn-primary flex items-center justify-center gap-3 h-14 sm:h-16 text-lg sm:text-xl shadow-2xl shadow-indigo-200/40"
                >
                  <ShoppingCart className="w-5 h-5 sm:w-6 sm:h-6" />
                  Add to Cart
                </button>
                {product.availability === 'Rent' && (
                  <button 
                    onClick={() => setShowRentModal(true)}
                    className="flex-1 btn-outline flex items-center justify-center gap-3 h-14 sm:h-16 text-lg sm:text-xl"
                  >
                    <Calendar className="w-5 h-5 sm:w-6 sm:h-6" />
                    Rent Item
                  </button>
                )}
              </div>
            </motion.div>

            {/* Features Info */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }} className="grid grid-cols-2 gap-3 sm:gap-4 pt-6 sm:pt-12">
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70 dark:bg-slate-900/80 transition-all">
                <Truck className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Campus Pickup</h5>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Verify before you pay</p>
                </div>
              </div>
              <div className="flex items-start gap-3 sm:gap-4 p-3 sm:p-4 rounded-2xl sm:rounded-3xl bg-white/50 backdrop-blur-sm border border-white/30 hover:bg-white/70 dark:bg-slate-900/80 transition-all">
                <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h5 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Buyer Safety</h5>
                  <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-medium">Escrow protected</p>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ═══ Rent Modal ═══ */}
      <AnimatePresence>
        {showRentModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowRentModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-[0_30px_80px_rgba(99,102,241,0.2)] border border-white/40 dark:border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Rent This Item</h2>
                <button onClick={() => setShowRentModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80/60 flex items-center justify-center hover:bg-slate-100 dark:bg-slate-800/60 transition-colors hover:scale-110">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Item preview */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/80/40 backdrop-blur-sm rounded-2xl mb-6 border border-slate-100 dark:border-slate-700/50/40">
                <img src={imageSrc} alt={product.name} className="w-16 h-16 rounded-xl object-cover shadow-sm" />
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-slate-900 dark:text-white truncate">{product.name}</p>
                  <p className="font-black gradient-text">₹{unitPrice} / day</p>
                </div>
              </div>

              {/* Day selector */}
              <div className="mb-6">
                <label className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">How many days?</label>
                <div className="flex items-center justify-center gap-6 p-4 bg-indigo-50 dark:bg-indigo-900/30/30 backdrop-blur-sm rounded-2xl border border-indigo-100/40">
                  <button 
                    onClick={() => setRentDays(Math.max(1, rentDays - 1))}
                    disabled={rentDays <= 1}
                    className="w-12 h-12 rounded-xl bg-white border border-indigo-200/60 flex items-center justify-center text-indigo-600 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all disabled:opacity-30"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <div className="text-center">
                    <span className="text-4xl font-black gradient-text">{rentDays}</span>
                    <p className="text-sm font-bold text-indigo-400">{rentDays === 1 ? 'day' : 'days'}</p>
                  </div>
                  <button 
                    onClick={() => setRentDays(Math.min(30, rentDays + 1))}
                    disabled={rentDays >= 30}
                    className="w-12 h-12 rounded-xl bg-white border border-indigo-200/60 flex items-center justify-center text-indigo-600 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all disabled:opacity-30"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Cost breakdown */}
              <div className="space-y-3 p-4 bg-slate-50 dark:bg-slate-800/80/40 backdrop-blur-sm rounded-2xl mb-6 border border-slate-100 dark:border-slate-700/50/40">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Daily Rate</span>
                  <span className="font-bold text-slate-900 dark:text-white">₹{unitPrice}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Duration</span>
                  <span className="font-bold text-slate-900 dark:text-white">{rentDays} day{rentDays > 1 ? 's' : ''}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent" />
                <div className="flex justify-between">
                  <span className="font-black text-slate-900 dark:text-white">Total</span>
                  <span className="text-2xl font-black gradient-text">₹{unitPrice * rentDays}</span>
                </div>
              </div>

              <button
                onClick={handleRentItem}
                className="w-full btn-primary h-14 text-lg flex items-center justify-center gap-3 shadow-xl shadow-indigo-200/40"
              >
                <Calendar className="w-5 h-5" />
                Rent for {rentDays} day{rentDays > 1 ? 's' : ''} — ₹{unitPrice * rentDays}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ═══ Message Seller Modal ═══ */}
      <AnimatePresence>
        {showMessageModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-md flex items-center justify-center p-4"
            onClick={() => setShowMessageModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white/95 backdrop-blur-2xl rounded-[2rem] p-6 sm:p-8 max-w-md w-full shadow-[0_30px_80px_rgba(99,102,241,0.2)] border border-white/40 dark:border-white/10"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Message Seller</h2>
                <button onClick={() => setShowMessageModal(false)} className="w-10 h-10 rounded-xl bg-slate-50 dark:bg-slate-800/80/60 flex items-center justify-center hover:bg-slate-100 dark:bg-slate-800/60 transition-colors hover:scale-110">
                  <X className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                </button>
              </div>

              {/* Seller info */}
              <div className="flex items-center gap-4 p-4 bg-slate-50 dark:bg-slate-800/80/40 backdrop-blur-sm rounded-2xl mb-6 border border-slate-100 dark:border-slate-700/50/40">
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center font-black text-lg text-white shadow-md">
                  {product.ownerId?.name?.[0] || 'S'}
                </div>
                <div>
                  <p className="font-bold text-slate-900 dark:text-white">{product.ownerId?.name || 'Student Seller'}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{product.ownerId?.email || 'Via WhatsApp'}</p>
                </div>
              </div>

              {/* Quick templates */}
              <div className="mb-4">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Quick Messages</p>
                <div className="flex flex-wrap gap-2">
                  {[
                    'Is this still available?',
                    'Can we meet today?',
                    'Can you lower the price?',
                    'What\'s the condition?'
                  ].map(tmpl => (
                    <button
                      key={tmpl}
                      onClick={() => setMessage(tmpl)}
                      className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all duration-200 ${
                        message === tmpl 
                          ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white border-transparent shadow-md' 
                          : 'bg-white/60 text-slate-600 dark:text-slate-400 border-slate-200/60 hover:border-indigo-300 hover:text-indigo-600 backdrop-blur-sm'
                      }`}
                    >
                      {tmpl}
                    </button>
                  ))}
                </div>
              </div>

              {/* Message input */}
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Type your message to the seller..."
                rows={4}
                className="w-full px-4 py-3 rounded-2xl bg-white/60 backdrop-blur-sm border border-slate-200/40 text-sm font-medium resize-none focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all mb-6 hover:bg-white/80 dark:bg-slate-900/90"
              />

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    if (!message.trim()) { toast.error('Please type a message'); return; }
                    const sellerName = product.ownerId?.name || 'Seller';
                    const whatsappMsg = `Hi ${sellerName}, I'm interested in "${product.name}" (₹${unitPrice}) on CampusTrade.\n\n${message}\n\n🔗 ${window.location.href}`;
                    window.open(`https://wa.me/?text=${encodeURIComponent(whatsappMsg)}`, '_blank');
                    toast.success('Opening WhatsApp...');
                    setShowMessageModal(false);
                    setMessage('');
                  }}
                  className="flex-1 btn-outline !py-3 flex items-center justify-center gap-2 text-sm !text-emerald-600 !border-emerald-200/60 hover:!bg-emerald-50/50"
                >
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
                <button
                  onClick={handleSendMessage}
                  className="flex-1 btn-primary !py-3 flex items-center justify-center gap-2 text-sm"
                >
                  <ArrowRight className="w-4 h-4" />
                  Send Email
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProductDetailsPage;
