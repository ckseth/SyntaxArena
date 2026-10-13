import React, { useState } from 'react';
import { Mail, ArrowLeft, Loader, ShieldCheck, MessageCircle, KeyRound, CheckCircle2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ForgotPass = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [isSent, setIsSent] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    // Real MERN logic will go here
    setTimeout(() => {
      setLoading(false);
      setIsSent(true);
      toast.success('Reset link sent to your email!');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-transparent">
      {/* Left Pane - Form */}
      <div className="w-full md:w-[45%] p-8 md:p-16 flex flex-col justify-center relative overflow-hidden">
        {/* Logo */}
        <div className="absolute top-12 left-12 flex items-center gap-3">
          <div className="w-10 h-10 bg-[#1a3a32] rounded-xl flex items-center justify-center text-white">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Solara</span>
        </div>

        <div className="max-w-md w-full mx-auto">
          <Link to="/login" className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-[#1a3a32] font-bold mb-10 transition-colors">
            <ArrowLeft className="w-5 h-5" />
            Back to Sign in
          </Link>

          <AnimatePresence mode="wait">
            {!isSent ? (
              <motion.div
                key="request"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
              >
                <div className="mb-10">
                  <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3">Forgot Password?</h1>
                  <p className="text-slate-500 dark:text-slate-400 font-medium">
                    Enter the email associated with your account and we'll send you instructions to reset your password.
                  </p>
                </div>

                <form onSubmit={handleReset} className="space-y-8">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">E-mail Address</label>
                    <div className="relative">
                      <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300" />
                      <input
                        type="email"
                        required
                        placeholder="example@gmail.com"
                        className="input-field pl-12"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full h-14 bg-[#1a3a32] text-white rounded-xl font-black text-lg shadow-xl shadow-[#1a3a32]/20 flex items-center justify-center gap-3 hover:translate-y-[-2px] active:scale-[0.98] transition-all disabled:opacity-50"
                  >
                    {loading ? <Loader className="w-6 h-6 animate-spin" /> : <KeyRound className="w-6 h-6" />}
                    {loading ? 'Sending link...' : 'Send Reset Link'}
                  </button>
                </form>
              </motion.div>
            ) : (
              <motion.div
                key="success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center"
              >
                <div className="w-20 h-20 bg-emerald-50 rounded-[2rem] flex items-center justify-center mx-auto mb-8 shadow-sm">
                  <CheckCircle2 className="w-10 h-10 text-emerald-600" />
                </div>
                <h2 className="text-3xl font-black text-slate-900 dark:text-white mb-4">Check your email</h2>
                <p className="text-slate-500 dark:text-slate-400 font-medium mb-10 leading-relaxed">
                  We have sent password recovery instructions to <br />
                  <span className="text-slate-900 dark:text-white font-bold">{email}</span>
                </p>
                <div className="space-y-4">
                   <button 
                    onClick={() => window.open('https://gmail.com', '_blank')}
                    className="w-full h-14 bg-[#1a3a32] text-white rounded-xl font-black text-lg shadow-xl shadow-[#1a3a32]/20"
                   >
                     Open Email App
                   </button>
                   <button 
                    onClick={() => setIsSent(false)}
                    className="w-full h-14 bg-white border border-slate-200 text-slate-600 dark:text-slate-400 rounded-xl font-bold hover:bg-slate-50 dark:bg-slate-800/80 transition-all"
                   >
                     Didn't receive? Try again
                   </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Right Pane - Visual Section */}
      <div className="hidden md:flex flex-1 bg-white/10 backdrop-blur-3xl border-l border-white/20 relative items-center justify-center p-16 overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.03)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full translate-x-1/2 -translate-y-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-white/5 rounded-full -translate-x-1/2 translate-y-1/2 blur-2xl" />

        <div className="absolute top-12 right-12 flex items-center gap-3 text-white/80 hover:text-white transition-colors cursor-pointer">
          <MessageCircle className="w-5 h-5" />
          <span className="font-bold">Support</span>
        </div>

        <div className="max-w-xl w-full relative z-10 text-center">
           <div className="w-24 h-24 bg-white/10 backdrop-blur-xl rounded-[2.5rem] flex items-center justify-center mx-auto mb-10">
              <ShieldCheck className="w-12 h-12 text-white" />
           </div>
           <h2 className="text-5xl font-black text-white mb-6 leading-tight tracking-tight">Security is our <br /> top priority</h2>
           <p className="text-white/60 text-xl leading-relaxed max-w-md mx-auto">
             Rest assured, your account details and transactions are protected by industry-standard encryption and student verification.
           </p>
        </div>
      </div>
    </div>
  );
};

export default ForgotPass;
