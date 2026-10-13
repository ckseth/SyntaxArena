import React, { useContext } from 'react'
import { StoreContext } from '../../Context/Storecontext';
import { useNavigate, Link } from 'react-router-dom';
import { ShoppingCart, Trash2, ArrowRight, Package, Search, Calendar, Minus, Plus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Cart = () => {
  const {
    cartItems, productList, removeFromCart, getTotalCartAmount,
    getItemPrice, rentalDays, updateRentalDays
  } = useContext(StoreContext);
  const navigate = useNavigate();

  const cartContent = productList.filter(item => cartItems[item._id] > 0);

  if (cartContent.length === 0) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden">
        {/* Decorative orbs */}
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] orb orb-indigo" />
        <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] orb orb-purple" />

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center relative z-10"
        >
          <div className="w-40 h-40 bg-gradient-to-br from-indigo-50 to-purple-50 rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-2xl shadow-indigo-500/10 relative animate-float border border-white/40 dark:border-white/10 backdrop-blur-sm">
            <ShoppingCart className="w-20 h-20 text-indigo-200" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6">Your cart is empty</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-sm mx-auto font-medium leading-relaxed">
            Add some items from marketplace to start trading with fellow students.
          </p>
          <button
            onClick={() => navigate('/')}
            className="btn-primary flex items-center gap-3 mx-auto h-16 px-10 text-xl"
          >
            Start Shopping
            <ArrowRight className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className='min-h-screen pt-32 pb-32 relative'>
      {/* Decorative orbs */}
      <div className="absolute top-[10%] right-[-5%] w-[400px] h-[400px] orb orb-indigo opacity-30" />
      <div className="absolute bottom-[10%] left-[-5%] w-[300px] h-[300px] orb orb-purple opacity-20" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-4 mb-16 animate-fade-in-up">
          <div className="w-12 h-12 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/20 border border-white/40 dark:border-white/10">
            <ShoppingCart className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Your Shopping Cart</h1>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* Cart Items List */}
          <div className="flex-[2] space-y-6">
            <AnimatePresence>
              {cartContent.map((item) => {
                const displayName = item.name || item.title || 'Product';
                const imgSrc = item.image || (item.images && item.images[0]) || null;
                const resolvedImg = imgSrc && typeof imgSrc === 'string' && imgSrc.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${imgSrc}` : imgSrc;
                const isRental = item.availability === 'Rent';
                const unitPrice = getItemPrice(item);
                const days = rentalDays[item._id] || 1;
                const qty = cartItems[item._id];
                const lineTotal = isRental ? unitPrice * qty * days : unitPrice * qty;

                return (
                  <motion.div
                    key={item._id}
                    layout
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-6 rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-[0_4px_24px_rgba(99,102,241,0.04)] flex flex-col sm:flex-row items-start sm:items-center gap-6 group hover:shadow-[0_12px_40px_rgba(99,102,241,0.08)] transition-all duration-300 hover:bg-white/80 dark:bg-slate-900/90"
                  >
                    <div className="w-28 h-28 rounded-3xl overflow-hidden shadow-md bg-gradient-to-br from-slate-100 to-slate-50 flex-shrink-0 border border-white/40 dark:border-white/10">
                      {resolvedImg ? (
                        <img src={resolvedImg} alt={displayName} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center"><Package className="w-10 h-10 text-slate-300" /></div>
                      )}
                    </div>
                    <div className="flex-1 w-full">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-2xl font-black text-slate-900 dark:text-white">{displayName}</h3>
                        <button onClick={() => removeFromCart(item._id)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50/60 rounded-xl transition-all hover:scale-110">
                          <Trash2 className="w-6 h-6" />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-center gap-3 mb-4">
                        <span className="badge-indigo">
                          ₹{unitPrice} {isRental ? '/ day' : ''}
                        </span>
                        <span className="text-slate-400 font-bold">Qty: {qty}</span>
                      </div>

                      {/* Rental Day Selector */}
                      {isRental && (
                        <div className="flex items-center gap-4 mb-4 p-4 bg-indigo-50 dark:bg-indigo-900/30/40 backdrop-blur-sm rounded-2xl border border-indigo-100/40">
                          <Calendar className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                          <div className="flex-1">
                            <p className="text-xs font-bold uppercase tracking-wider text-indigo-400 mb-1">Rental Duration</p>
                            <div className="flex items-center gap-3">
                              <button
                                type="button"
                                onClick={() => updateRentalDays(item._id, days - 1)}
                                disabled={days <= 1}
                                className="w-9 h-9 rounded-xl bg-white border border-indigo-200/60 flex items-center justify-center text-indigo-600 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Minus className="w-4 h-4" />
                              </button>
                              <div className="flex items-baseline gap-1">
                                <span className="text-2xl font-black text-indigo-600 min-w-[2ch] text-center">{days}</span>
                                <span className="text-sm font-bold text-indigo-400">{days === 1 ? 'day' : 'days'}</span>
                              </div>
                              <button
                                type="button"
                                onClick={() => updateRentalDays(item._id, days + 1)}
                                disabled={days >= 30}
                                className="w-9 h-9 rounded-xl bg-white border border-indigo-200/60 flex items-center justify-center text-indigo-600 hover:bg-gradient-to-br hover:from-indigo-600 hover:to-purple-600 hover:text-white hover:border-transparent transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                              >
                                <Plus className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-400 font-bold">Total</p>
                            <p className="text-lg font-black text-indigo-600">₹{unitPrice} × {days}d = ₹{unitPrice * days}</p>
                          </div>
                        </div>
                      )}

                      <div className="flex justify-between items-end">
                        <p className="text-slate-500 dark:text-slate-400 line-clamp-1 max-w-sm">{item.description}</p>
                        <span className="text-2xl font-black gradient-text">₹{lineTotal}</span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>

          {/* Cart Summary */}
          <div className="flex-1">
            <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] p-10 border border-white/40 dark:border-white/10 shadow-[0_8px_40px_rgba(99,102,241,0.06)] sticky top-32 animate-border-glow">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-8">Order Summary</h2>

              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Subtotal</span>
                  <span className="text-xl font-black text-slate-900 dark:text-white">₹{getTotalCartAmount()}</span>
                </div>
                <div className="h-px bg-gradient-to-r from-transparent via-slate-200/60 to-transparent w-full" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-slate-900 dark:text-white">Total</span>
                  <span className="text-4xl font-black gradient-text">₹{getTotalCartAmount() === 0 ? 0 : getTotalCartAmount()}</span>
                </div>
              </div>

              <button
                onClick={() => navigate('/order')}
                className="w-full btn-primary h-16 text-xl flex items-center justify-center gap-3 shadow-2xl shadow-indigo-200/40"
              >
                Checkout Now
                <ArrowRight className="w-6 h-6" />
              </button>

              <div className="mt-8 p-6 bg-slate-50 dark:bg-slate-800/80/40 backdrop-blur-sm rounded-3xl border border-slate-100 dark:border-slate-700/50/40 italic text-sm text-slate-500 dark:text-slate-400 font-medium">
                Note: All transactions are processed through CampusTrade secure meeting system.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
