import React, { useContext } from 'react'
import { Loader, PackageSearch } from 'lucide-react'
import './ProductGrid.css'
import { StoreContext } from '../../Context/Storecontext';
import ProductCard from '../ProductCard/ProductCard';

const ProductGrid = ({category, filters}) => {
    const { productList, loading } = useContext(StoreContext);

    // Normalize product data to handle BOTH local assets and DB products
    const normalizeProduct = (item) => {
        return {
            _id: item._id,
            name: item.name || item.title || 'Untitled Product',
            title: item.title || item.name || 'Untitled Product',
            description: item.description || '',
            price: item.price || 0,
            // Handle image: local assets use 'image', DB uses 'images[]' array
            image: item.image || (item.images && item.images.length > 0 ? item.images[0] : null),
            category: item.category || 'Miscellaneous',
            availability: item.availability || 'Sell',
            rentDaily: item.rentDaily || 0,
            rentHourly: item.rentHourly || 0,
            condition: item.condition || 'Good',
            location: item.location || 'Campus',
            ownerId: item.ownerId || null,
        };
    };

    // Filter logic for categories and search
    const filteredList = (productList || [])
        .map(normalizeProduct)
        .filter(item => {
            // Category filter — supports both single string and array of categories
            let matchesCategory = false;
            if (category === "All" || !category) {
                matchesCategory = true;
            } else if (Array.isArray(category)) {
                matchesCategory = category.length === 0 || category.includes(item.category);
            } else {
                matchesCategory = item.category === category;
            }
            
            // Search filter (searches both name/title AND description)
            const searchTerm = filters?.search?.toLowerCase() || '';
            const matchesSearch = !searchTerm || 
                (item.name || '').toLowerCase().includes(searchTerm) || 
                (item.description || '').toLowerCase().includes(searchTerm);
            
            // Type filter (Availability)
            const matchesType = !filters?.availability || item.availability === filters.availability;

            // Price filter
            const price = item.availability === 'Rent' ? (item.rentDaily || 0) : (item.price || 0);
            const matchesMinPrice = !filters?.priceMin || price >= Number(filters.priceMin);
            const matchesMaxPrice = !filters?.priceMax || price <= Number(filters.priceMax);

            return matchesCategory && matchesSearch && matchesType && matchesMinPrice && matchesMaxPrice;
        });

    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center py-32 space-y-4">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-indigo-50 dark:bg-indigo-900/30/60 backdrop-blur-sm flex items-center justify-center animate-pulse-glow">
              <Loader className="w-8 h-8 text-indigo-600 animate-spin" />
            </div>
          </div>
          <p className="text-slate-400 font-bold">Synchronizing with Campus Network...</p>
        </div>
      );
    }

    return (
        <div className='product-grid' id='product-grid'>
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-black text-slate-900 dark:text-white">
                {filters?.search ? `Search results for "${filters.search}"` : 'Recent Listings'}
              </h2>
              <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
                <span className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-white/40 dark:border-white/10 shadow-sm">
                  {filteredList.length} Items Found
                </span>
              </div>
            </div>

            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 stagger-children'>
                {filteredList.map((item) => (
                    <ProductCard 
                      key={item._id} 
                      id={item._id} 
                      name={item.name} 
                      description={item.description} 
                      price={item.price} 
                      image={item.image} 
                      availability={item.availability} 
                      rentDaily={item.rentDaily}
                      category={item.category}
                      location={item.location}
                      ownerId={item.ownerId}
                    />
                ))}
            </div>
            
            {filteredList.length === 0 && (
              <div className="text-center py-32 bg-white/60 backdrop-blur-sm rounded-[3rem] border-dashed border-2 border-slate-200/40 animate-scale-in">
                <div className="w-20 h-20 bg-indigo-50 dark:bg-indigo-900/30/60 backdrop-blur-sm rounded-3xl flex items-center justify-center mx-auto mb-6 animate-float shadow-lg shadow-indigo-100/20">
                  <PackageSearch className="w-10 h-10 text-indigo-400" />
                </div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-slate-200 mb-2">No items found</h3>
                <p className="text-slate-500 dark:text-slate-400 max-w-sm mx-auto font-medium">
                  We couldn't find anything matching your filters. Try exploring other categories or clearing filters.
                </p>
              </div>
            )}
        </div>
    )
}

export default ProductGrid
