import React, { useContext } from 'react';
import { StoreContext } from '../../Context/Storecontext';
import { useNavigate } from 'react-router-dom';
import { Heart, Trash2, ArrowRight, Package, ShoppingCart } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Wishlist = () => {
  const { wishlistItems, productList, toggleWishlist, addToCart, getItemPrice } = useContext(StoreContext);
  const navigate = useNavigate();

  const wishlistContent = productList.filter(item => wishlistItems.includes(item._id));

  if (wishlistContent.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] orb orb-pink" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(236,72,153,0) 70%)' }} />
        <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] orb orb-rose" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(244,63,94,0) 70%)' }} />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="w-40 h-40 bg-gradient-to-br from-pink-50 to-rose-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-pink-500/10 relative animate-float border border-white/40 dark:border-white/10 backdrop-blur-sm">
            <Heart className="w-20 h-20 text-pink-200" fill="currentColor" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6">Your wishlist is empty</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-sm mx-auto font-medium leading-relaxed">
            Save items you like to your wishlist to easily find them later.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center gap-3 mx-auto h-16 px-10 text-xl"
          >
            Explore Marketplace
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-32 pb-32 relative'>
      {/* Decorative orbs */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] orb orb-pink opacity-30" style={{ background: 'radial-gradient(circle, rgba(236,72,153,0.15) 0%, rgba(236,72,153,0) 70%)' }} />
      <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] orb orb-rose opacity-20" style={{ background: 'radial-gradient(circle, rgba(244,63,94,0.15) 0%, rgba(244,63,94,0) 70%)' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-4 mb-12 animate-fade-in-up">
          <div className="w-12 h-12 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg shadow-pink-100/20 border border-white/40 dark:border-white/10">
            <Heart className="w-6 h-6 text-pink-600" fill="currentColor" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Your Wishlist</h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {wishlistContent.map((item) => {
              const displayName = item.name || item.title || 'Product';
              const imgSrc = item.image || (item.images && item.images[0]) || null;
              const resolvedImg = imgSrc && typeof imgSrc === 'string' && imgSrc.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${imgSrc}` : imgSrc;
              const unitPrice = getItemPrice(item);
              const isRental = item.availability === 'Rent';

              return (
                <motion.div
                  key={item._id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-[0_4px_24px_rgba(236,72,153,0.04)] flex flex-col group hover:shadow-[0_12px_40px_rgba(236,72,153,0.08)] transition-all duration-300 hover:bg-white/80 dark:bg-slate-900/90"
                >
                  <div className="w-full h-48 rounded-3xl overflow-hidden shadow-md bg-gradient-to-br from-slate-100 to-slate-50 mb-6 border border-white/40 dark:border-white/10 relative">
                    {resolvedImg ? (
                      <img src={resolvedImg} alt={displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-slate-300" /></div>
                    )}
                    <button 
                      onClick={() => toggleWishlist(item._id)} 
                      className="absolute top-3 right-3 p-2 bg-white/90 backdrop-blur-md text-pink-500 hover:text-pink-600 rounded-xl transition-all hover:scale-110 shadow-sm"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                  
                  <div className="flex-1 flex flex-col">
                    <h3 className="text-xl font-black text-slate-900 dark:text-white mb-2 truncate">{displayName}</h3>
                    
                    <div className="flex items-center gap-2 mb-4">
                      <span className="badge-pink bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-bold">
                        ₹{unitPrice} {isRental ? '/ day' : ''}
                      </span>
                    </div>

                    <p className="text-slate-500 dark:text-slate-400 line-clamp-2 text-sm mb-6 flex-1">{item.description}</p>
                    
                    <button 
                      onClick={() => addToCart(item._id)}
                      className="w-full btn-primary h-12 text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-200/40"
                    >
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Wishlist;
