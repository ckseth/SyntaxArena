import React, { useState } from "react";
import Myheader from "../../Component/Myheader";
import ProductGrid from "../../Component/ProductGrid/ProductGrid";
import { Filter, X } from 'lucide-react';
import { motion } from 'framer-motion';
import { useSearchParams } from 'react-router-dom';

const HomePage = () => {
  const [category, setCategory] = useState([]);
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || '';

  const [filters, setFilters] = useState({
    search: queryParam,
    priceMin: '',
    priceMax: '',
    availability: '',
  });
  
  const [appliedFilters, setAppliedFilters] = useState(filters);
  const [appliedCategory, setAppliedCategory] = useState('All');

  const categories = ['Electronics', 'Books', 'Furniture', 'Vehicles', 'Traditional & Ethnic Wear', 'Miscellaneous'];

  const toggleCategory = (cat) => {
    setCategory(prev => 
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const applyFilters = () => {
    setAppliedFilters(filters);
    setAppliedCategory(category.length > 0 ? category : "All");
    // Scroll to products
    const display = document.getElementById('product-grid');
    if (display) display.scrollIntoView({ behavior: 'smooth' });
  };

  const clearFilters = () => {
    setCategory([]);
    setFilters({
      search: '',
      priceMin: '',
      priceMax: '',
      availability: '',
    });
    setAppliedFilters({
      search: '',
      priceMin: '',
      priceMax: '',
      availability: '',
    });
    setAppliedCategory('All');
  };

  React.useEffect(() => {
    if (queryParam) {
      setFilters(prev => ({ ...prev, search: queryParam }));
      setAppliedFilters(prev => ({ ...prev, search: queryParam }));
    }
  }, [queryParam]);

  return (
    <div className="min-h-screen relative">
      <Myheader 
        filters={filters} 
        setFilters={setFilters} 
        applyFilters={applyFilters} 
      />

      <div className="w-full max-w-[1600px] mx-auto px-2 sm:px-4 lg:px-6 py-4 text-center md:text-left">
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
          
          {/* Filters Sidebar */}
          <aside className="w-full lg:w-72 flex-shrink-0">
            <div className="sticky top-28 space-y-6 bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl p-6 rounded-[2rem] shadow-sm border border-white/80 animate-fade-in-up">
              {/* Subtle glow on top */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-indigo-300/50 to-transparent" />
              
              <div className="flex items-center justify-between">
                <h3 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
                  <div className="w-8 h-8 bg-indigo-50 dark:bg-indigo-900/30/80 rounded-lg flex items-center justify-center">
                    <Filter className="w-4 h-4 text-indigo-600" />
                  </div>
                  Filters
                </h3>
                <button 
                  onClick={clearFilters}
                  className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition-colors bg-slate-50 dark:bg-slate-800/80/60 px-3 py-1.5 rounded-lg hover:bg-indigo-50 dark:bg-indigo-900/30/60"
                >
                  Reset
                </button>
              </div>

              {/* Categories */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Categories</h4>
                <div className="space-y-3">
                  {categories.map(cat => (
                    <label key={cat} className="flex items-center group cursor-pointer">
                      <div className="relative flex items-center justify-center">
                        <input 
                          type="checkbox" 
                          checked={category.includes(cat)}
                          onChange={() => toggleCategory(cat)}
                          className="peer appearance-none w-5 h-5 rounded-lg border-2 border-slate-200 checked:bg-gradient-to-br checked:from-indigo-600 checked:to-purple-600 checked:border-indigo-600 transition-all cursor-pointer"
                        />
                        <X className="absolute w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
                      </div>
                      <span className="ml-3 text-sm font-bold text-slate-600 dark:text-slate-400 group-hover:text-indigo-600 transition-colors line-clamp-1">
                        {cat}
                      </span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price Range */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Price Range (₹)</h4>
                <div className="flex gap-4 items-center">
                  <input 
                    type="number" 
                    placeholder="Min" 
                    value={filters.priceMin}
                    onChange={(e) => setFilters({...filters, priceMin: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/40 text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-500/8"
                  />
                  <span className="text-slate-300 font-bold">-</span>
                  <input 
                    type="number" 
                    placeholder="Max" 
                    value={filters.priceMax}
                    onChange={(e) => setFilters({...filters, priceMax: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl bg-white/60 backdrop-blur-sm border border-slate-200/40 text-sm font-bold focus:bg-white focus:border-indigo-500 outline-none transition-all focus:ring-4 focus:ring-indigo-500/8"
                  />
                </div>
              </div>

              {/* Availability */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-widest text-slate-400 mb-6">Trading Type</h4>
                <div className="grid grid-cols-2 gap-2">
                  {['Any', 'Sell', 'Rent'].map(type => (
                    <button
                      key={type}
                      onClick={() => setFilters({...filters, availability: type === 'Any' ? '' : type})}
                      className={`px-4 py-2.5 rounded-xl text-xs font-black border transition-all duration-300 ${
                        (type === 'Any' && filters.availability === '') || filters.availability === type
                        ? 'bg-gradient-to-r from-indigo-600 to-purple-600 border-transparent text-white shadow-lg shadow-indigo-200/50'
                        : 'bg-white/60 backdrop-blur-sm border-slate-200/40 text-slate-500 dark:text-slate-400 hover:border-indigo-300 hover:text-indigo-600'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                onClick={applyFilters}
                className="w-full btn-primary !py-4 text-sm shadow-xl shadow-indigo-200/30 animate-shimmer"
              >
                Apply Filters
              </button>
            </div>
          </aside>

          {/* Product Feed */}
          <main className="flex-1">
            <ProductGrid 
              category={appliedCategory} 
              filters={appliedFilters}
            />
          </main>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
