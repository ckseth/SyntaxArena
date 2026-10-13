import React, { useState, useMemo } from 'react';
import { Mail, Lock, User, Eye, EyeOff, Loader, ShieldCheck, Sparkles, ArrowRight, AlertCircle, CheckCircle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import axios from 'axios';
import useAuth from '../../hooks/useAuth';

const PasswordStrengthIndicator = ({ strength }) => {
  const colors = {
    none: 'bg-gray-200',
    weak: 'bg-red-500',
    medium: 'bg-yellow-500',
    strong: 'bg-green-500'
  };
  const labels = {
    none: '',
    weak: 'Weak',
    medium: 'Medium',
    strong: 'Strong'
  };
  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        <div className={`h-1 flex-1 rounded-full ${strength !== 'none' ? colors[strength] : 'bg-gray-200'}`} />
        <div className={`h-1 flex-1 rounded-full ${['strong', 'medium'].includes(strength) ? colors[strength] : 'bg-gray-200'}`} />
        <div className={`h-1 flex-1 rounded-full ${strength === 'strong' ? colors[strength] : 'bg-gray-200'}`} />
      </div>
      {strength !== 'none' && <p className="text-xs font-black uppercase tracking-widest text-slate-600 dark:text-emerald-400 mt-1">{labels[strength]}</p>}
    </div>
  );
};

const InputField = ({ label, name, type, placeholder, value, error, isValid, showError, icon: Icon, children, onChange, onBlur }) => {
  return (
    <div className="group">
      <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 mb-2 ml-1 flex items-center justify-between">
        {label}
        {showError && isValid && <CheckCircle className="w-4 h-4 text-green-500" />}
      </label>
      <div className="relative">
        {Icon && <Icon className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />}
        <input
          name={name}
          type={type}
          required
          placeholder={placeholder}
          className={`w-full pl-14 pr-6 py-4 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border transition-all outline-none shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 text-slate-900 dark:text-white font-bold ${
            showError
              ? isValid
                ? 'border-green-500 focus:ring-green-500/10 focus:border-green-600'
                : 'border-red-500 focus:ring-red-500/10 focus:border-red-600'
              : 'border-white/40 dark:border-white/10 focus:ring-emerald-500/10 focus:border-emerald-600'
          }`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
        />
      </div>
      {showError && error && (
        <p className={`text-xs font-bold mt-2 flex items-center gap-1 ${isValid ? 'text-green-600' : 'text-red-600'}`}>
          {isValid ? <CheckCircle className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
          {error}
        </p>
      )}
      {children}
    </div>
  );
};

const SignupPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [touched, setTouched] = useState({
    name: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const navigate = useNavigate();
  const { login } = useAuth();

  // Validation logic
  const validations = useMemo(() => {
    return {
      name: {
        isValid: formData.name.trim().length >= 2,
        error: formData.name.trim().length === 0 ? 'Name is required' : formData.name.trim().length < 2 ? 'Name must be at least 2 characters' : ''
      },
      email: {
        isValid: /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email),
        error: formData.email === '' ? 'Email is required' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) ? 'Please enter a valid email address' : ''
      },
      password: {
        isValid: formData.password.length >= 8 && /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password),
        error: formData.password === '' ? 'Password is required' : formData.password.length < 8 ? 'Password must be at least 8 characters' : !/[A-Z]/.test(formData.password) ? 'Password must contain at least one uppercase letter' : !/[0-9]/.test(formData.password) ? 'Password must contain at least one number' : '',
        strength: formData.password.length === 0 ? 'none' : formData.password.length < 8 ? 'weak' : /[A-Z]/.test(formData.password) && /[0-9]/.test(formData.password) && formData.password.length >= 10 ? 'strong' : 'medium'
      },
      confirmPassword: {
        isValid: formData.password === formData.confirmPassword && formData.confirmPassword.length > 0,
        error: formData.confirmPassword === '' ? 'Please confirm your password' : formData.password !== formData.confirmPassword ? 'Passwords do not match' : ''
      }
    };
  }, [formData]);

  const isFormValid = validations.name.isValid && validations.email.isValid && validations.password.isValid && validations.confirmPassword.isValid;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (e) => {
    setTouched({ ...touched, [e.target.name]: true });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    
    if (!isFormValid) {
      toast.error('Please fix all errors before signing up');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post(`${import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000'}/api/auth/register`, {
        name: formData.name,
        email: formData.email,
        password: formData.password
      });

      const { token, user } = response.data;
      login(user, token);
      toast.success('Account created successfully!');
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gradient-to-br from-[#064e3b]/85 via-[#166534]/70 to-[#f88379]/80 backdrop-blur-[50px] relative overflow-hidden font-['Inter']">
      <div className="absolute top-0 right-0 w-[40%] h-[40%] bg-emerald-100/50 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[40%] h-[40%] bg-indigo-100/50 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full md:w-[45%] p-4 md:p-8 flex flex-col justify-center relative z-10 overflow-y-auto no-scrollbar w-full min-h-screen">
        <div className="max-w-md w-full mx-auto">
          <div className="flex items-center gap-3 mb-8 group cursor-pointer lg:mb-12">
            <div className="w-12 h-12 bg-[#1a3a32] rounded-[1.25rem] flex items-center justify-center text-white shadow-elevation rotate-[8deg] group-hover:rotate-0 transition-all duration-500">
              <Sparkles className="w-7 h-7" />
            </div>
            <span className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">Campus<span className="text-emerald-700">Trade</span></span>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-premium p-8 md:p-12 rounded-[3.5rem] shadow-ambient border border-white/40 dark:border-white/10"
          >
            <div className="mb-8">
              <h1 className="text-4xl font-black text-slate-900 dark:text-white mb-2 tracking-tight">New Account</h1>
              <p className="text-slate-600 dark:text-slate-200 font-semibold">
                Part of the community yet? <Link to="/login" className="text-emerald-700 dark:text-emerald-400 font-black hover:underline transition-all">Sign in here</Link>
              </p>
            </div>

            <form onSubmit={handleSignup} className="space-y-4">
              <div className="space-y-4">
                <InputField
                  label="Your Full Name"
                  name="name"
                  type="text"
                  placeholder="Vivek Kumar"
                  value={formData.name}
                  error={validations.name.error}
                  isValid={validations.name.isValid}
                  showError={touched.name}
                  icon={User}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <InputField
                  label="Campus Mail ID"
                  name="email"
                  type="email"
                  placeholder="student@university.edu"
                  value={formData.email}
                  error={validations.email.error}
                  isValid={validations.email.isValid}
                  showError={touched.email}
                  icon={Mail}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 dark:text-slate-300 mb-2 ml-1">Password</label>
                  <div className="space-y-3">
                    <div className="relative group">
                      <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-emerald-600 transition-colors" />
                      <input
                        name="password"
                        type={showPassword ? "text" : "password"}
                        required
                        placeholder="••••••••"
                        className={`w-full pl-14 pr-14 py-4 rounded-2xl bg-white/40 dark:bg-black/20 backdrop-blur-md border transition-all outline-none shadow-sm placeholder:text-slate-400 dark:placeholder:text-slate-500 focus:bg-white dark:focus:bg-slate-900 focus:ring-4 text-slate-900 dark:text-white font-bold ${
                          touched.password
                            ? validations.password.isValid
                              ? 'border-green-500 focus:ring-green-500/10 focus:border-green-600'
                              : 'border-red-500 focus:ring-red-500/10 focus:border-red-600'
                            : 'border-white/40 dark:border-white/10 focus:ring-emerald-500/10 focus:border-emerald-600'
                        }`}
                        value={formData.password}
                        onChange={handleChange}
                        onBlur={handleBlur}
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
                      <p className="text-xs font-bold text-red-600 flex items-center gap-1">
                        <AlertCircle className="w-3 h-3" />
                        {validations.password.error}
                      </p>
                    )}
                    {touched.password && !validations.password.error && (
                      <p className="text-xs font-bold text-green-600 flex items-center gap-1">
                        <CheckCircle className="w-3 h-3" />
                        Password looks good!
                      </p>
                    )}
                    {formData.password && <PasswordStrengthIndicator strength={validations.password.strength} />}
                  </div>
                </div>

                <InputField
                  label="Confirm Password"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Confirm password"
                  value={formData.confirmPassword}
                  error={validations.confirmPassword.error}
                  isValid={validations.confirmPassword.isValid}
                  showError={touched.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>

              <div className="flex items-start gap-3 px-1 py-1">
                <input type="checkbox" required className="mt-1 w-5 h-5 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500/20" />
                <p className="text-xs font-bold text-slate-500 dark:text-slate-400 leading-relaxed">
                  I certify that I am a student and I agree to the <Link className="text-emerald-700 underline">Terms of Use</Link> and <Link className="text-emerald-700 underline">Community Rules</Link>.
                </p>
              </div>

              <button
                type="submit"
                disabled={loading || !isFormValid}
                className={`w-full h-16 rounded-[1.25rem] font-black text-lg shadow-elevation flex items-center justify-center gap-3 transition-all ${
                  isFormValid
                    ? 'bg-[#1a3a32] text-white hover:translate-y-[-2px] active:scale-[0.98]'
                    : 'bg-gray-300 text-gray-600 cursor-not-allowed'
                } disabled:opacity-50`}
              >
                {loading ? <Loader className="w-6 h-6 animate-spin" /> : 'Create Account'}
                {!loading && isFormValid && <ArrowRight className="w-5 h-5" />}
              </button>
            </form>
          </motion.div>
        </div>
      </div>

      <div className="hidden md:flex flex-1 bg-black/10 backdrop-blur-3xl border-l border-white/20 relative items-center justify-center p-6 md:p-8 overflow-hidden shadow-[-20px_0_40px_rgba(0,0,0,0.1)]">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-white/5 rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-1 bg-gradient-to-r from-transparent via-emerald-500/20 to-transparent rotate-45" />

        <div className="max-w-xl w-full relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-premium bg-white/10 backdrop-blur-2xl rounded-[3.5rem] p-12 shadow-elevation border border-white/20 relative overflow-hidden mb-16"
          >
            <div className="relative z-10 space-y-8">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500/20 rounded-full border border-emerald-400/30">
                <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
                <span className="text-white text-xs font-black tracking-widest uppercase">Verified Students Only</span>
              </div>
              
              <h2 className="text-5xl font-black text-white leading-tight">Join the largest <br /> campus network.</h2>
              <p className="text-white/70 text-xl font-medium leading-relaxed">
                Connect with thousands of students. Safe, secure, and commission-free.
              </p>
              
              <div className="relative pt-6">
                <div className="bg-gradient-to-br from-emerald-600 to-indigo-700 h-48 rounded-[2rem] p-8 text-white shadow-2xl relative overflow-hidden group hover:scale-[1.02] transition-transform duration-500">
                   <div className="flex justify-between items-center mb-6">
                     <ShieldCheck className="w-8 h-8 text-emerald-300" />
                     <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">CT</div>
                   </div>
                   <div>
                     <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-60 mb-1">Student Identity</p>
                     <p className="text-2xl font-black">Verified Member</p>
                   </div>
                   <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;
