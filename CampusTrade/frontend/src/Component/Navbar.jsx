import React, { useState, useEffect } from 'react';
import { ShoppingCart, Search, Menu, X, User, LogOut, Package, PlusCircle, LayoutDashboard, Moon, Sun, Heart, ClipboardList } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../hooks/useAuth';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
    }
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
      setIsDarkMode(true);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    setShowUserMenu(false);
    setIsMobileMenuOpen(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Marketplace', path: '/' },
    { name: 'Start Selling', path: '/sell' },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled ? 'py-3' : 'py-5'}`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`relative rounded-[2rem] transition-all duration-500 px-6 py-3 flex items-center justify-between ${
          isScrolled 
            ? 'bg-white/75 dark:bg-slate-900/75 backdrop-blur-2xl shadow-[0_8px_40px_rgba(99,102,241,0.12)] border border-white/50 dark:border-white/10' 
            : 'bg-white/40 dark:bg-slate-900/40 backdrop-blur-xl border border-white/20 dark:border-white/10'
        }`}>
          {/* Subtle animated gradient border effect */}
          <div className="absolute inset-0 rounded-[2rem] opacity-0 hover:opacity-100 transition-opacity duration-700 pointer-events-none"
            style={{ background: 'linear-gradient(135deg, rgba(129,140,248,0.05), rgba(167,139,250,0.05), rgba(244,114,182,0.03))' }}
          />

          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 md:gap-3 group relative z-10">
            <div className="w-9 h-9 md:w-10 md:h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl md:rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-300/30 group-hover:scale-110 group-hover:shadow-indigo-400/40 group-hover:rotate-[-3deg] transition-all duration-300">
              <Package className="w-5 h-5 md:w-6 md:h-6" />
            </div>
            <span className="text-xl md:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              Campus<span className="gradient-text">Trade</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8 relative z-10">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className={`text-sm font-bold transition-all duration-300 relative group ${
                  location.pathname === link.path 
                    ? 'text-indigo-600 dark:text-indigo-400' 
                    : 'text-slate-500 dark:text-slate-400 hover:text-indigo-600 dark:hover:text-white'
                }`}
              >
                {link.name}
                {/* Active indicator dot */}
                <span className={`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-indigo-600 transition-all duration-300 ${
                  location.pathname === link.path ? 'opacity-100 scale-100' : 'opacity-0 scale-0 group-hover:opacity-60 group-hover:scale-100'
                }`} />
              </Link>
            ))}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center gap-3 relative z-10">
            <button onClick={toggleDarkMode} className="p-3 text-slate-500 dark:text-slate-400 dark:text-slate-300 hover:text-amber-500 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105">
              {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
            </button>
            <div className="relative">
              <button onClick={() => setShowSearch(!showSearch)} className="p-3 text-slate-500 dark:text-slate-400 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:bg-indigo-900/30/60 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105">
                <Search className="w-5 h-5" />
              </button>
              
              <AnimatePresence>
                {showSearch && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-3 w-72 bg-white/95 dark:bg-slate-900/95 backdrop-blur-3xl rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.2)] border border-white/50 dark:border-white/10 p-3 flex gap-2 z-50"
                  >
                    <input 
                      type="text" 
                      placeholder="Search CampusTrade..." 
                      autoFocus
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl py-2 px-4 shadow-inner outline-none focus:ring-2 focus:ring-indigo-500 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-medium"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' && searchQuery.trim()) {
                          navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                          setShowSearch(false);
                          setSearchQuery('');
                        }
                      }}
                    />
                    <button 
                      onClick={() => {
                         if (searchQuery.trim()) {
                            navigate(`/?q=${encodeURIComponent(searchQuery.trim())}`);
                            setShowSearch(false);
                            setSearchQuery('');
                         }
                      }}
                      className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-2.5 rounded-xl hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105"
                    >
                      <Search className="w-4 h-4" />
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link to="/wishlist" className="p-3 text-slate-500 dark:text-slate-400 dark:text-slate-300 hover:text-pink-600 hover:bg-pink-50/60 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105 relative">
              <Heart className="w-5 h-5" />
            </Link>
            <Link to="/cart" className="p-3 text-slate-500 dark:text-slate-400 dark:text-slate-300 hover:text-indigo-600 hover:bg-indigo-50 dark:bg-indigo-900/30/60 dark:hover:bg-slate-800 rounded-xl transition-all duration-200 hover:scale-105 relative">
              <ShoppingCart className="w-5 h-5" />
              <div className="absolute top-2 right-2 w-2.5 h-2.5 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full border-2 border-white shadow-sm animate-pulse"></div>
            </Link>

            {isAuthenticated && user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center gap-3 pl-4 border-l border-slate-200/50 group cursor-pointer hover:opacity-80 transition-opacity"
                >
                  <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black uppercase shadow-md shadow-indigo-200/40 group-hover:shadow-lg group-hover:shadow-indigo-300/50 transition-all duration-300 group-hover:scale-105">
                    {user.initial}
                  </div>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300 hidden group-hover:inline-block max-w-[100px] truncate">{user.name}</span>
                </button>
                
                {/* User Dropdown Menu */}
                <AnimatePresence>
                  {showUserMenu && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: -10, scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                      className="absolute right-0 mt-3 w-60 bg-white/90 backdrop-blur-2xl rounded-2xl shadow-[0_20px_60px_rgba(99,102,241,0.15)] border border-white/50 overflow-hidden"
                    >
                      <div className="p-4 border-b border-slate-100 dark:border-slate-700/50/60 bg-gradient-to-r from-indigo-50/40 to-purple-50/40">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-md">
                            {user.initial}
                          </div>
                          <div>
                            <p className="font-bold text-slate-900 dark:text-white">{user.name}</p>
                            <p className="text-sm text-slate-500 dark:text-slate-400">{user.email}</p>
                          </div>
                        </div>
                      </div>
                      
                      <Link
                        to="/order-history"
                        onClick={() => setShowUserMenu(false)}
                        className="w-full px-4 py-3 text-left text-sm font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800/80/60 transition-colors flex items-center gap-3 border-b border-slate-100 dark:border-slate-700/50/60"
                      >
                        <ClipboardList className="w-4 h-4 text-indigo-500" />
                        Order History
                      </Link>
                      <button
                        onClick={handleLogout}
                        className="w-full px-4 py-3 text-left text-sm font-bold text-red-600 hover:bg-red-50/60 transition-colors flex items-center gap-3"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <Link
                to="/login"
                className="btn-primary !py-2.5 !px-6 text-sm !rounded-xl"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-3 text-slate-500 dark:text-slate-400 dark:text-slate-300 hover:bg-slate-50 dark:bg-slate-800/80/60 dark:hover:bg-slate-800 rounded-xl transition-all relative z-10"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            transition={{ duration: 0.25 }}
            className="absolute top-full left-0 right-0 px-4 pt-2 md:hidden"
          >
            <div className="bg-white/80 dark:bg-slate-900/90 backdrop-blur-2xl rounded-[2rem] p-6 shadow-[0_20px_60px_rgba(99,102,241,0.12)] border border-white/40 dark:border-white/10 space-y-4">
              <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-slate-700/50/60 dark:border-white/10">
                 <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Theme</span>
                 <button onClick={toggleDarkMode} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                   {isDarkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5 text-indigo-600" />}
                 </button>
              </div>
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="block text-lg font-bold text-slate-600 dark:text-slate-400 py-2 hover:text-indigo-600 transition-colors"
                >
                  {link.name}
                </Link>
              ))}
              <hr className="border-slate-100 dark:border-slate-700/50/60" />
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pt-2 gap-4">
                <div className="flex items-center gap-4">
                  <Link to="/wishlist" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold hover:text-pink-600 transition-colors">
                    <Heart className="w-5 h-5" />
                    <span>Wishlist</span>
                  </Link>
                  <Link to="/cart" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-600 transition-colors">
                    <ShoppingCart className="w-5 h-5" />
                    <span>Cart</span>
                  </Link>
                </div>
                {isAuthenticated && user ? (
                  <div className="flex items-center justify-between sm:justify-start gap-4 w-full sm:w-auto">
                    <Link to="/order-history" onClick={() => setIsMobileMenuOpen(false)} className="text-slate-600 dark:text-slate-400 font-bold hover:text-indigo-600">
                      Orders
                    </Link>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center text-white font-black text-sm shadow-sm">
                        {user.initial}
                      </div>
                      <button
                        onClick={handleLogout}
                        className="text-indigo-600 font-black text-sm hover:text-red-600 transition-colors flex items-center gap-1"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                ) : (
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-indigo-600 font-black">
                    Sign In
                  </Link>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
