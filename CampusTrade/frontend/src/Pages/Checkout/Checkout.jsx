import React, { useState, useContext } from 'react';
import { StoreContext } from '../../Context/Storecontext';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  CreditCard, Banknote, User, Phone, Mail, Building2,
  ShieldCheck, ChevronRight, CheckCircle2, Package,
  Lock, Sparkles, ArrowLeft
} from 'lucide-react';
import toast from 'react-hot-toast';
import './Checkout.css';

const Checkout = () => {
  const { cartItems, productList, getTotalCartAmount, setCartItems, addOrder } = useContext(StoreContext);
  const navigate = useNavigate();

  const [paymentMethod, setPaymentMethod] = useState('');
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [processing, setProcessing] = useState(false);

  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '', phone: '',
    hostel: '', roomNo: '',
  });

  const [cardDetails, setCardDetails] = useState({
    number: '', name: '', expiry: '', cvv: ''
  });

  const cartContent = productList.filter(item => cartItems[item._id] > 0);
  const subtotal = getTotalCartAmount();
  const total = subtotal;

  const handleFormChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleCardChange = (e) => {
    let { name, value } = e.target;
    if (name === 'number') {
      value = value.replace(/\D/g, '').slice(0, 16);
      value = value.replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 3) value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (name === 'cvv') {
      value = value.replace(/\D/g, '').slice(0, 3);
    }
    setCardDetails(prev => ({ ...prev, [name]: value }));
  };

  const isFormValid = () => {
    const { firstName, lastName, email, phone } = form;
    if (!firstName || !lastName || !email || !phone) return false;
    if (!paymentMethod) return false;
    if (paymentMethod === 'card') {
      const { number, name, expiry, cvv } = cardDetails;
      if (!number || !name || !expiry || !cvv) return false;
    }
    return true;
  };

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!isFormValid()) {
      toast.error('Please fill all fields and select a payment method.');
      return;
    }
    setProcessing(true);
    await new Promise(r => setTimeout(r, 2200));
    const newOrder = {
      id: `#CT${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      items: cartContent.map(item => ({
        ...item,
        qty: cartItems[item._id]
      })),
      total: total,
      paymentMethod: paymentMethod,
      pickupLocation: `${form.hostel} ${form.roomNo ? `- Room ${form.roomNo}` : ''}`,
      status: 'Processing'
    };
    addOrder(newOrder);

    setProcessing(false);
    setOrderPlaced(true);
    setCartItems({});
    toast.success('Order placed successfully!');
  };

  // Order success screen
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 relative overflow-hidden">
        <div className="absolute top-[20%] left-[10%] w-[300px] h-[300px] orb orb-indigo" />
        <div className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] orb orb-purple" />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', duration: 0.7 }}
          className="text-center max-w-lg"
        >
          <div className="checkout-success-icon mx-auto mb-10">
            <CheckCircle2 className="w-24 h-24 text-emerald-500" />
          </div>
          <h1 className="text-5xl font-black text-slate-900 dark:text-white mb-4">Order Confirmed! 🎉</h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium mb-3">
            {paymentMethod === 'cod'
              ? 'Pay when you meet the seller on campus.'
              : 'Your card has been charged successfully.'}
          </p>
          <p className="text-slate-400 mb-12">Order ID: #CT{Date.now().toString().slice(-8)}</p>

          <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[2rem] p-8 border border-white/40 dark:border-white/10 mb-10 shadow-[0_8px_40px_rgba(99,102,241,0.06)]">
            <div className="flex items-center justify-between mb-4">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Payment</span>
              <span className="badge-emerald">{paymentMethod === 'cod' ? 'Cash on Delivery' : 'Card'}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-500 dark:text-slate-400 font-bold">Total Paid</span>
              <span className="text-3xl font-black gradient-text">₹{total}</span>
            </div>
          </div>

          <button
            onClick={() => navigate('/')}
            className="btn-primary h-16 px-12 text-xl flex items-center gap-3 mx-auto"
          >
            Continue Shopping
            <Sparkles className="w-6 h-6" />
          </button>
        </motion.div>
      </div>
    );
  }

  // Empty cart redirect
  if (cartContent.length === 0 && !orderPlaced) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center p-4">
        <Package className="w-20 h-20 text-slate-200 mb-8" />
        <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-4">Nothing to checkout</h1>
        <p className="text-slate-500 dark:text-slate-400 mb-10 text-lg">Add items to your cart first.</p>
        <button onClick={() => navigate('/')} className="btn-primary h-14 px-10 text-lg">
          Browse Marketplace
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-32 relative">
      {/* Decorative orbs */}
      <div className="absolute top-[5%] right-[-5%] w-[400px] h-[400px] orb orb-indigo opacity-20" />
      <div className="absolute bottom-[15%] left-[-5%] w-[350px] h-[350px] orb orb-purple opacity-15" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="flex items-center gap-4 mb-12 animate-fade-in-up">
          <button onClick={() => navigate('/cart')} className="w-12 h-12 bg-white/70 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl flex items-center justify-center shadow-sm hover:shadow-md transition-all group border border-white/40 dark:border-white/10">
            <ArrowLeft className="w-5 h-5 text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors" />
          </button>
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white">Checkout</h1>
            <p className="text-slate-400 font-medium mt-1">Complete your order securely</p>
          </div>
        </div>

        <form onSubmit={handlePlaceOrder} className="checkout-grid">
          {/* LEFT: Pickup Info + Payment */}
          <div className="checkout-left space-y-8">
            {/* ── Campus Pickup Info ── */}
            <section className="checkout-section">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <Building2 className="w-5 h-5 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white">Campus Pickup</h2>
                  <p className="text-sm text-slate-400 font-medium">Meet the seller for pickup on campus</p>
                </div>
              </div>

              {/* Campus pickup banner */}
              <div className="campus-pickup-banner mb-6">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  </div>
                  <div>
                    <p className="font-bold text-emerald-800 text-sm">No delivery needed</p>
                    <p className="text-emerald-600 text-xs">You'll coordinate a campus meetup with the seller after ordering</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="checkout-input-group">
                  <label className="checkout-label"><User className="w-4 h-4" /> First Name</label>
                  <input name="firstName" value={form.firstName} onChange={handleFormChange} className="checkout-input" placeholder="John" />
                </div>
                <div className="checkout-input-group">
                  <label className="checkout-label"><User className="w-4 h-4" /> Last Name</label>
                  <input name="lastName" value={form.lastName} onChange={handleFormChange} className="checkout-input" placeholder="Doe" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="checkout-input-group">
                  <label className="checkout-label"><Mail className="w-4 h-4" /> Email</label>
                  <input name="email" type="email" value={form.email} onChange={handleFormChange} className="checkout-input" placeholder="john@college.edu" />
                </div>
                <div className="checkout-input-group">
                  <label className="checkout-label"><Phone className="w-4 h-4" /> Phone</label>
                  <input name="phone" type="tel" value={form.phone} onChange={handleFormChange} className="checkout-input" placeholder="+91 98765 43210" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="checkout-input-group">
                  <label className="checkout-label"><Building2 className="w-4 h-4" /> Hostel / Block</label>
                  <input name="hostel" value={form.hostel} onChange={handleFormChange} className="checkout-input" placeholder="Block A / Hostel 3" />
                </div>
                <div className="checkout-input-group">
                  <label className="checkout-label">Room No (optional)</label>
                  <input name="roomNo" value={form.roomNo} onChange={handleFormChange} className="checkout-input" placeholder="Room 204" />
                </div>
              </div>
            </section>

            {/* ── Payment Method ── */}
            <section className="checkout-section">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl flex items-center justify-center">
                  <ShieldCheck className="w-5 h-5 text-indigo-600" />
                </div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Payment Method</h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                {/* COD Option */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPaymentMethod('cod')}
                  className={`payment-option ${paymentMethod === 'cod' ? 'payment-option--active' : ''}`}
                >
                  <div className="payment-option-icon cod-icon">
                    <Banknote className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-lg text-slate-900 dark:text-white">Cash on Delivery</p>
                    <p className="text-sm text-slate-400 font-medium">Pay when you meet</p>
                  </div>
                  {paymentMethod === 'cod' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                  )}
                </motion.button>

                {/* Card Option */}
                <motion.button
                  type="button"
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setPaymentMethod('card')}
                  className={`payment-option ${paymentMethod === 'card' ? 'payment-option--active' : ''}`}
                >
                  <div className="payment-option-icon card-icon">
                    <CreditCard className="w-7 h-7" />
                  </div>
                  <div className="text-left">
                    <p className="font-black text-lg text-slate-900 dark:text-white">Credit / Debit Card</p>
                    <p className="text-sm text-slate-400 font-medium">Visa, Mastercard, RuPay</p>
                  </div>
                  {paymentMethod === 'card' && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="ml-auto">
                      <CheckCircle2 className="w-6 h-6 text-emerald-500" />
                    </motion.div>
                  )}
                </motion.button>
              </div>

              {/* Card Details (conditional) */}
              <AnimatePresence>
                {paymentMethod === 'card' && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.35 }}
                    className="overflow-hidden"
                  >
                    <div className="card-details-box">
                      <div className="card-details-header">
                        <div className="flex items-center gap-2">
                          <Lock className="w-4 h-4 text-emerald-500" />
                          <span className="text-sm font-bold text-emerald-600">Secure Payment</span>
                        </div>
                        <div className="flex gap-2">
                          <div className="card-brand">VISA</div>
                          <div className="card-brand">MC</div>
                          <div className="card-brand">RuPay</div>
                        </div>
                      </div>
                      <div className="checkout-input-group">
                        <label className="checkout-label"><CreditCard className="w-4 h-4" /> Card Number</label>
                        <input name="number" value={cardDetails.number} onChange={handleCardChange} className="checkout-input card-number-input" placeholder="4242 4242 4242 4242" maxLength={19} />
                      </div>
                      <div className="checkout-input-group">
                        <label className="checkout-label">Name on Card</label>
                        <input name="name" value={cardDetails.name} onChange={handleCardChange} className="checkout-input" placeholder="JOHN DOE" style={{ textTransform: 'uppercase' }} />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="checkout-input-group">
                          <label className="checkout-label">Expiry</label>
                          <input name="expiry" value={cardDetails.expiry} onChange={handleCardChange} className="checkout-input" placeholder="MM/YY" maxLength={5} />
                        </div>
                        <div className="checkout-input-group">
                          <label className="checkout-label"><Lock className="w-4 h-4" /> CVV</label>
                          <input name="cvv" type="password" value={cardDetails.cvv} onChange={handleCardChange} className="checkout-input" placeholder="•••" maxLength={3} />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </section>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="checkout-right">
            <div className="checkout-summary">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-8">Order Summary</h2>

              {/* Items */}
              <div className="checkout-items-list">
                {cartContent.map(item => {
                  const displayName = item.name || item.title || 'Product';
                  const imgSrc = item.image || (item.images && item.images[0]) || null;
                  const resolvedImg = imgSrc && typeof imgSrc === 'string' && imgSrc.startsWith('/uploads') ? `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}${imgSrc}` : imgSrc;
                  const price = item.price || item.rentDaily || 0;
                  return (
                    <div key={item._id} className="checkout-item">
                      <div className="checkout-item-img">
                        {resolvedImg ? (
                          <img src={resolvedImg} alt={displayName} />
                        ) : (
                          <Package className="w-6 h-6 text-slate-300" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-slate-900 dark:text-white truncate">{displayName}</p>
                        <p className="text-sm text-slate-400">Qty: {cartItems[item._id]}</p>
                      </div>
                      <span className="font-black text-slate-900 dark:text-white">₹{price * cartItems[item._id]}</span>
                    </div>
                  );
                })}
              </div>

              <div className="checkout-divider" />

              {/* Totals */}
              <div className="space-y-4 mb-8">
                <div className="flex justify-between">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">Subtotal</span>
                  <span className="font-black text-slate-900 dark:text-white">₹{subtotal}</span>
                </div>
                <div className="checkout-divider" />
                <div className="flex justify-between items-center">
                  <span className="text-xl font-black text-slate-900 dark:text-white">Total</span>
                  <span className="text-3xl font-black gradient-text">₹{total}</span>
                </div>
              </div>

              {/* Place Order Button */}
              <button
                type="submit"
                disabled={!isFormValid() || processing}
                className="checkout-place-btn"
              >
                {processing ? (
                  <div className="flex items-center gap-3">
                    <div className="checkout-spinner" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6" />
                    {paymentMethod === 'cod' ? 'Place Order (COD)' : paymentMethod === 'card' ? `Pay ₹${total}` : 'Select Payment'}
                    <ChevronRight className="w-5 h-5" />
                  </div>
                )}
              </button>

              <div className="checkout-secure-note">
                <Lock className="w-4 h-4 text-emerald-500" />
                <span>Your data is encrypted & secure</span>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
