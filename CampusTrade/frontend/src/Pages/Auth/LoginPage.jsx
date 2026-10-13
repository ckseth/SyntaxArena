import React, { useState, useMemo } from 'react';
import { Mail, Lock, Eye, EyeOff, Loader, ShieldCheck, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [touched, setTouched] = useState({ email: false, password: false });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validation logic
  const validations = useMemo(() => {
    return {
      email: {
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email),
        error: email === '' ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? 'Please enter a valid email address' : ''
      },
      password: {
        isValid: password.length >= 6,
        error: password === '' ? 'Password is required' : password.length < 6 ? 'Password must be at least 6 characters' : ''
      }
    };
  }, [email, password]);

  const isFormValid = validations.email.isValid && validations.password.isValid;

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please enter valid email and password');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/login`, { email, password });
      const { token, user } = response.data;
      
      login(user, token);
      toast.success('Welcome back to CampusTrade!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#064e3b]/85 via-[#166534]/70 to-[#f88379]/80 backdrop-blur-[50px] relative overflow-hidden font-['Inter']">
      {/* Background patterns */}
      <div className="absolute top-0 left-0 w-full h-full opacity-40 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-emerald-100 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-indigo-100 rounded-full blur-[120px]" />
      </div>

      {/* Left Pane - Form Section */}
      <div className="w-full md:w-[45%] p-4 md:p-8 flex flex-col justify-center relative z-10 w-full min-h-screen">
        <div className="max-w-md w-full mx-auto">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-10 group cursor-pointer">
            <div className="w-12 h-12 bg-[#1a3a32] rounded-2xl flex items-center justify-center text-white shadow-elevation rotate-[-5deg] group-hover:rotate-0 transition-transform duration-500">
              <ShieldCheck className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Campus<span className="text-emerald-700">Trade</span></span>
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-premium p-8 md:p-12 rounded-[3.5rem] shadow-ambient border border-white/40 dark:border-white/10"
          >
            <div className="mb-10">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-3 tracking-tight">Welcome Back</h1>
              <p className="text-slate-600 dark:text-slate-200 font-semibold">
                New user? <Link to="/signup" className="text-emerald-700 dark:text-emerald-400 font-black hover:underline transition-all">Join the community</Link>
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-5">
                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 mb-2 ml-1 flex items-center justify-between">
                    Student Email
                    {touched.email && validations.email.isValid && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type="email"
                      required
                      placeholder="vivek@campus.edu"
                      className={`w-full pl-14 pr-6 py-4.5 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border transition-all outline-none shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 text-slate-900 dark:text-white font-bold ${
                        touched.email
                          ? validations.email.isValid
                            ? 'border-green-500 focus:ring-green-500/10 focus:border-green-600'
                            : 'border-red-500 focus:ring-red-500/10 focus:border-red-600'
                          : 'border-white/40 dark:border-white/10 focus:ring-emerald-500/10 focus:border-emerald-600'
                      }`}
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={() => setTouched({ ...touched, email: true })}
                    />
                  </div>
                  {touched.email && validations.email.error && (
                    <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validations.email.error}
                    </p>
                  )}
                </div>

                <div className="group">
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 mb-2 ml-1 flex items-center justify-between">
                    Secure Password
                    {touched.password && validations.password.isValid && <CheckCircle className="w-4 h-4 text-green-500" />}
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      className={`w-full pl-14 pr-14 py-4.5 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border transition-all outline-none shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 text-slate-900 dark:text-white font-bold ${
                        touched.password
                          ? validations.password.isValid
                            ? 'border-green-500 focus:ring-green-500/10 focus:border-green-600'
                            : 'border-red-500 focus:ring-red-500/10 focus:border-red-600'
                          : 'border-white/40 dark:border-white/10 focus:ring-emerald-500/10 focus:border-emerald-600'
                      }`}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      onBlur={() => setTouched({ ...touched, password: true })}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-emerald-600 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {touched.password && validations.password.error && (
                    <p className="text-xs font-bold text-red-600 mt-2 flex items-center gap-1">
                      <AlertCircle className="w-3 h-3" />
                      {validations.password.error}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between px-1">
                <label className="flex items-center gap-3 cursor-pointer group">
                  <input type="checkbox" className="w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500/20 transition-all" />
                  <span className="text-sm font-bold text-slate-500 dark:text-slate-400 group-hover:text-slate-700 dark:text-slate-300 transition-colors">Keep me signed in</span>
                </label>
                <Link to="/forgot-password" title="Recover account" className="text-sm font-black text-emerald-700 hover:underline">Forgot?</Link>
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full h-16 rounded-[1.25rem] font-black text-lg shadow-elevation flex items-center justify-center gap-3 transition-all ${
                  isFormValid
                    ? 'bg-[#1a3a32] text-white hover:scale-[1.02] active:scale-[0.98]'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                } disabled:opacity-50 mt-4`}
              >
                {loading ? <Loader className="w-6 h-6 animate-spin" /> : 'Enter Marketplace'}
              </button>

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100 dark:border-slate-700/50"></div></div>
                <div className="relative flex justify-center text-xs uppercase font-black tracking-widest text-slate-400"><span className="px-4 bg-white/0 backdrop-blur-sm">OR SIGN IN WITH</span></div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button type="button" className="h-14 bg-white/50 border border-slate-200 rounded-xl font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-3 hover:bg-white transition-all text-sm shadow-sm backdrop-blur-sm">
                  <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                  Google
                </button>
                <button type="button" className="h-14 bg-white/50 border border-slate-200 rounded-xl font-bold text-slate-600 dark:text-slate-400 flex items-center justify-center gap-3 hover:bg-white transition-all text-sm shadow-sm backdrop-blur-sm">
                   <Github className="w-5 h-5" />
                   Github
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </div>

      {/* Right Pane - Visual Section */}
      <div className="hidden md:flex flex-1 bg-black/10 backdrop-blur-3xl border-l border-white/20 relative items-center justify-center p-6 md:p-8 overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
        {/* Animated Background Elements */}
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-400/10 rounded-full blur-[120px] translate-x-1/3 -translate-y-1/3" />
        <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-indigo-400/10 rounded-full blur-[100px] -translate-x-1/4 translate-y-1/4" />
        
        <div className="max-w-xl w-full relative z-10 text-center">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-premium bg-white/10 backdrop-blur-2xl rounded-[4rem] p-12 shadow-elevation border border-white/10 relative overflow-hidden mb-16 group hover:shadow-2xl transition-all duration-700"
          >
            <div className="relative z-10 space-y-8">
              <h2 className="text-5xl font-black text-white leading-[1.15] tracking-tight">Verified Trade <br /> <span className="text-emerald-400">On Campus.</span></h2>
              <p className="text-white/80 text-xl font-medium leading-relaxed max-w-md mx-auto">
                Join thousands of students trading securely with zero commission.
              </p>
              
              <div className="flex justify-center gap-5">
                 <div className="px-8 py-4 bg-white/20 backdrop-blur-md rounded-2xl font-black text-white border border-white/20 hover:bg-white/30 transition-all cursor-default">Campus Exclusive</div>
              </div>
            </div>
            
            {/* Decorative Card Element */}
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-emerald-400/10 rounded-full blur-3xl group-hover:bg-emerald-400/20 transition-all duration-700" />
          </motion.div>

          <div className="space-y-6 text-white">
            <h3 className="text-2xl font-black leading-tight drop-shadow-lg">Trust Matters</h3>
            <div className="w-16 h-1.5 bg-emerald-400 mx-auto rounded-full" />
            <p className="text-white/60 text-lg font-medium leading-relaxed max-w-sm mx-auto uppercase tracking-widest">
              Secured • Peer-to-Peer • Instant
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

const Github = ({ className }) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
  </svg>
);
