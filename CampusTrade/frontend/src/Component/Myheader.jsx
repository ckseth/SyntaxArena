import React from 'react';
import { Search, Sparkles, TrendingUp, ShieldCheck, MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const Myheader = ({ applyFilters, filters, setFilters }) => {
  return (

    <section
      className="relative overflow-hidden bg-transparent pt-20 pb-12 sm:pt-28 sm:pb-16"
      style={{ marginTop: '20px' }}
    >
      {/* Animated decorative orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[300px] h-[300px] md:w-[400px] md:h-[400px] orb orb-indigo animate-float opacity-50" style={{ animationDuration: '8s' }} />
      <div className="absolute top-[5%] right-[-10%] w-[250px] h-[250px] md:w-[350px] md:h-[350px] orb orb-purple animate-float opacity-50" style={{ animationDuration: '10s', animationDelay: '2s' }} />
      <div className="absolute bottom-[-5%] left-[25%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] orb orb-pink animate-float opacity-40" style={{ animationDuration: '12s', animationDelay: '4s' }} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center max-w-4xl mx-auto">

          {/* Top Badge: Clearly visible with shadow and border */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 bg-white/80 dark:bg-slate-900/90 backdrop-blur-md text-indigo-600 px-5 py-2 rounded-2xl text-sm font-bold mb-6 border border-indigo-100 shadow-xl shadow-indigo-500/5"
          >
            <Sparkles className="w-4 h-4 animate-pulse text-indigo-500" />
            <span className="tracking-wide">Verified Student Marketplace</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight"
          >
            Trade anything within <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600">
              your campus.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-lg sm:text-xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed font-medium"
          >
            The safest way to buy, sell, and rent items locally. Verified students,
            secure meetups, and unbeatable deals.
          </motion.p>

          {/* Search Bar Container */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <div className="relative w-full sm:w-[550px] group">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-indigo-600 transition-colors" />
              <input
                type="text"
                placeholder="What are you looking for today?"
                value={filters?.search || ''}
                onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && applyFilters()}
                className="w-full pl-16 pr-32 h-16 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-white/10 rounded-3xl shadow-2xl shadow-indigo-500/10 focus:ring-4 focus:ring-indigo-500/5 focus:border-indigo-400 dark:focus:border-indigo-500 outline-none text-lg transition-all hover:bg-white dark:hover:bg-slate-800 dark:text-white dark:placeholder:text-slate-500"
              />
              <button
                onClick={applyFilters}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 bg-indigo-600 text-white rounded-2xl py-2.5 px-6 text-sm font-bold hover:bg-indigo-700 transition-all duration-300 shadow-md hover:shadow-indigo-500/25 active:scale-95"
              >
                Search
              </button>
            </div>
          </motion.div>

          {/* Trust Badges */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            className="mt-14 flex flex-wrap justify-center gap-6 md:gap-12"
          >
            {[
              { icon: ShieldCheck, text: '.edu Verified' },
              { icon: TrendingUp, text: '2k+ Active Users' },
              { icon: MapPin, text: 'On-Campus Pickups' },
            ].map(({ icon: Icon, text }) => (
              <div
                key={text}
                className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-semibold bg-white/50 backdrop-blur-sm px-5 py-2.5 rounded-2xl border border-white/40 dark:border-white/10 shadow-sm hover:shadow-md hover:bg-white/80 dark:bg-slate-900/90 transition-all duration-300"
              >
                <Icon className="w-5 h-5 text-indigo-500" />
                <span className="text-sm md:text-base">{text}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Myheader;