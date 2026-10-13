import React, { useContext } from 'react';
import { StoreContext } from '../../Context/Storecontext';
import { useNavigate } from 'react-router-dom';
import { ClipboardList, ArrowRight, Package, CalendarDays, MapPin, Banknote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const OrderHistory = () => {
  const { orderHistory } = useContext(StoreContext);
  const navigate = useNavigate();

  if (!orderHistory || orderHistory.length === 0) {
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
            <ClipboardList className="w-20 h-20 text-indigo-200" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-6">No orders yet</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 mb-12 max-w-sm mx-auto font-medium leading-relaxed">
            You haven't placed any orders on CampusTrade yet.
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

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex items-center gap-4 mb-12 animate-fade-in-up">
          <div className="w-12 h-12 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-lg shadow-indigo-100/20 border border-white/40 dark:border-white/10">
            <ClipboardList className="w-6 h-6 text-indigo-600" />
          </div>
          <h1 className="text-4xl font-black text-slate-900 dark:text-white">Order History</h1>
        </div>

        <div className="space-y-8">
          <AnimatePresence>
            {orderHistory.map((order) => (
              <motion.div
                key={order.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl p-8 rounded-[2.5rem] border border-white/40 dark:border-white/10 shadow-[0_4px_24px_rgba(99,102,241,0.04)] flex flex-col group hover:shadow-[0_12px_40px_rgba(99,102,241,0.08)] transition-all duration-300 hover:bg-white/80 dark:bg-slate-900/90"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6 pb-6 border-b border-slate-100 dark:border-slate-700/50">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white">{order.id}</h3>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mt-1">
                      <CalendarDays className="w-4 h-4" />
                      <span className="text-sm font-medium">{new Date(order.date).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="badge-indigo bg-indigo-100 text-indigo-700 px-4 py-2 rounded-xl text-sm font-bold uppercase tracking-wider">
                      {order.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-4 mb-8">
                  {order.items.map((item, index) => {
                    const displayName = item.name || item.title || 'Product';
                    const imgSrc = item.image || (item.images && item.images[0]) || null;
                    const resolvedImg = imgSrc && typeof imgSrc === 'string' && imgSrc.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${imgSrc}` : imgSrc;

                    return (
                      <div key={index} className="flex items-center gap-4">
                        <div className="w-16 h-16 rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 border border-slate-200/50 flex-shrink-0">
                          {resolvedImg ? (
                            <img src={resolvedImg} alt={displayName} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center"><Package className="w-6 h-6 text-slate-300" /></div>
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                          <p className="text-sm text-slate-500 dark:text-slate-400">Qty: {item.qty}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-slate-50/50 dark:bg-slate-800/50 rounded-2xl p-6 grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                       <MapPin className="w-4 h-4" />
                       <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Pickup Details</span>
                    </div>
                    <p className="font-medium text-slate-700 dark:text-slate-300">{order.pickupLocation || 'Campus Delivery'}</p>
                  </div>
                  <div>
                    <div className="flex items-center gap-2 text-slate-500 dark:text-slate-400 mb-2">
                       <Banknote className="w-4 h-4" />
                       <span className="text-sm font-bold uppercase tracking-wider text-slate-400">Payment</span>
                    </div>
                    <div>
                      <p className="font-medium text-slate-700 dark:text-slate-300 mb-1">{order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</p>
                      <p className="text-2xl font-black text-indigo-600">₹{order.total}</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default OrderHistory;
