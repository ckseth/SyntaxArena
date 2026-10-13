import React, { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { 
  Package, DollarSign, Clock, ImageIcon, Tag, Info, X, 
  MapPin, ChevronLeft, UploadCloud, CheckCircle2, Loader, Pencil
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import productService from '../../services/productService';
import useAuth from '../../hooks/useAuth';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000');

const AddProductPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const { isAuthenticated, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [loadingProduct, setLoadingProduct] = useState(false);
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'Electronics',
    condition: 'Good',
    location: 'Campus',
    price: '',
    availability: 'Sell',
  });

  const [imageFiles, setImageFiles] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);
  const [existingImages, setExistingImages] = useState([]); // For edit mode
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      toast.error('Please log in to list items');
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Load product data when editing
  useEffect(() => {
    if (editId && isAuthenticated) {
      const fetchProduct = async () => {
        setLoadingProduct(true);
        try {
          const data = await productService.getProductById(editId);
          if (data && data.product) {
            const p = data.product;
            setFormData({
              title: p.title || p.name || '',
              description: p.description || '',
              category: p.category || 'Electronics',
              condition: p.condition || 'Good',
              location: p.location || 'Campus',
              price: p.price || '',
              availability: p.availability || 'Sell',
            });
            if (p.images && p.images.length > 0) {
              setExistingImages(p.images);
              // Generate preview URLs for existing images
              const previews = p.images.map(img => 
                img.startsWith('/uploads') ? `${API_BASE}${img}` : img
              );
              setImagePreviews(previews);
            }
          }
        } catch (error) {
          toast.error('Failed to load product details');
          navigate('/');
        } finally {
          setLoadingProduct(false);
        }
      };
      fetchProduct();
    }
  }, [editId, isAuthenticated, navigate]);

  // Early returns AFTER hooks
  if (authLoading || loadingProduct) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse-glow p-4 rounded-full">
          <Loader className="w-8 h-8 animate-spin text-indigo-600" />
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files);
      const totalSlots = 5 - existingImages.length;
      const updatedFiles = [...imageFiles, ...filesArray].slice(0, totalSlots);
      setImageFiles(updatedFiles);
      
      const newPreviews = updatedFiles.map(file => URL.createObjectURL(file));
      const existingPreviews = existingImages.map(img => 
        img.startsWith('/uploads') ? `${API_BASE}${img}` : img
      );
      setImagePreviews([...existingPreviews, ...newPreviews]);
      toast.success('Images ready for upload!');
    }
  };

  const removeImage = (index) => {
    if (index < existingImages.length) {
      // Removing an existing image
      const updatedExisting = existingImages.filter((_, i) => i !== index);
      setExistingImages(updatedExisting);
      const existingPreviews = updatedExisting.map(img => 
        img.startsWith('/uploads') ? `${API_BASE}${img}` : img
      );
      const newPreviews = imageFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...existingPreviews, ...newPreviews]);
    } else {
      // Removing a newly added image
      const newIndex = index - existingImages.length;
      const updatedFiles = imageFiles.filter((_, i) => i !== newIndex);
      setImageFiles(updatedFiles);
      const existingPreviews = existingImages.map(img => 
        img.startsWith('/uploads') ? `${API_BASE}${img}` : img
      );
      const newPreviews = updatedFiles.map(file => URL.createObjectURL(file));
      setImagePreviews([...existingPreviews, ...newPreviews]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        data.append(key, formData[key]);
      });
      
      // Add new image files
      imageFiles.forEach(file => {
        data.append('images', file);
      });

      if (editId) {
        // Update existing product
        await productService.updateProduct(editId, data);
        toast.success('Listing updated successfully!');
      } else {
        // Create new product
        await productService.createProductWithImages(data);
        toast.success('Product listed successfully!');
      }
      navigate('/');
    } catch (error) {
      toast.error(error.response?.data?.message || `Failed to ${editId ? 'update' : 'list'} product. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  const isEditMode = !!editId;
  const totalImages = existingImages.length + imageFiles.length;

  return (
    <div className="min-h-screen pt-32 pb-20 px-4 relative">
      {/* Decorative orbs */}
      <div className="absolute top-[5%] right-[-5%] w-[400px] h-[400px] orb orb-indigo opacity-25" />
      <div className="absolute bottom-[10%] left-[-5%] w-[350px] h-[350px] orb orb-purple opacity-20" />

      <div className="max-w-4xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-indigo-600 font-bold mb-8 transition-colors group"
        >
          <ChevronLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
          Back to Home
        </button>

        <div className="bg-white/70 dark:bg-slate-900/80 backdrop-blur-2xl rounded-[3rem] overflow-hidden border border-white/40 dark:border-white/10 shadow-[0_8px_40px_rgba(99,102,241,0.08)] animate-scale-in">
          <div className={`${isEditMode ? 'bg-gradient-to-r from-amber-500 to-orange-500' : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-700'} p-12 text-white relative overflow-hidden`}>
             <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl pointer-events-none" />
             <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/5 rounded-full translate-y-1/2 -translate-x-1/4 blur-2xl pointer-events-none" />
             <div className="flex items-center gap-4 mb-4 relative z-10">
               {isEditMode && <Pencil className="w-10 h-10" />}
               <h1 className="text-4xl font-black">{isEditMode ? 'Edit Listing' : 'List a New Item'}</h1>
             </div>
             <p className={`${isEditMode ? 'text-amber-100' : 'text-indigo-100'} font-medium text-lg max-w-lg relative z-10`}>
               {isEditMode 
                 ? 'Update your listing details below. Changes will be reflected immediately.'
                 : 'Fill in the details below to start selling or renting to your fellow students.'}
             </p>
          </div>

          <form onSubmit={handleSubmit} className="p-12 space-y-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
              {/* Left Column: Basic Info */}
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Basic Information</h3>
                
                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Listing Title</label>
                  <div className="relative">
                    <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input 
                      type="text" 
                      name="title"
                      required 
                      value={formData.title} 
                      onChange={handleChange}
                      className="input-field pl-12" 
                      placeholder="e.g. Calculus 101 Textbook" 
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                  <textarea 
                    name="description"
                    required 
                    rows="5" 
                    value={formData.description} 
                    onChange={handleChange}
                    className="input-field resize-none" 
                    placeholder="Condition, age, features..." 
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Category</label>
                    <select 
                      name="category" 
                      value={formData.category} 
                      onChange={handleChange}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="Electronics">Electronics</option>
                      <option value="Books">Books</option>
                      <option value="Furniture">Furniture</option>
                      <option value="Vehicles">Vehicles</option>
                      <option value="Traditional & Ethnic Wear">Traditional & Ethnic Wear</option>
                      <option value="Miscellaneous">Miscellaneous</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Condition</label>
                    <select 
                      name="condition" 
                      value={formData.condition} 
                      onChange={handleChange}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="New">New</option>
                      <option value="Like New">Like New</option>
                      <option value="Good">Good</option>
                      <option value="Used">Used</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Right Column: Pricing & Location */}
              <div className="space-y-8">
                <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Pricing & Availability</h3>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Trade Type</label>
                    <select 
                      name="availability" 
                      value={formData.availability} 
                      onChange={handleChange}
                      className="input-field appearance-none cursor-pointer"
                    >
                      <option value="Sell">For Sale</option>
                      <option value="Rent">For Rent</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Pick-up Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        name="location"
                        required 
                        value={formData.location} 
                        onChange={handleChange}
                        className="input-field pl-12" 
                        placeholder="e.g. Campus Hub" 
                      />
                    </div>
                  </div>
                </div>

                <div>
                   <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">
                    {formData.availability === 'Sell' ? 'Flat Sale Price (₹)' : 'Daily Rate (₹)'}
                   </label>
                   <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">₹</span>
                    <input 
                      type="number" 
                      name="price"
                      value={formData.price} 
                      onChange={handleChange}
                      required 
                      className="input-field pl-12" 
                      placeholder="0.00" 
                    />
                  </div>
                </div>

                <div className="bg-amber-50/60 backdrop-blur-sm rounded-2xl p-6 border border-amber-100/40">
                  <p className="text-sm text-amber-900 font-bold flex gap-2">
                    <Info className="w-5 h-5 shrink-0" />
                    {isEditMode 
                      ? 'Updating your listing will notify interested buyers about the changes.'
                      : 'Remember to meet in public areas and verify student ID for high-value items.'}
                  </p>
                </div>
              </div>
            </div>

            {/* Media Section */}
            <div className="space-y-8">
               <h3 className="text-xs font-black uppercase tracking-widest text-slate-400">Media & Images</h3>
               
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                 <div className="relative group">
                    <input 
                      type="file" 
                      multiple 
                      accept="image/*" 
                      onChange={handleImageChange}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      disabled={totalImages >= 5}
                    />
                    <div className="h-64 border-4 border-dashed border-slate-200/40 rounded-[2.5rem] bg-white/40 backdrop-blur-sm flex flex-col items-center justify-center gap-4 transition-all group-hover:bg-indigo-50 dark:bg-indigo-900/30/40 group-hover:border-indigo-200/60">
                       <div className="w-16 h-16 bg-white/80 dark:bg-slate-900/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform border border-white/40 dark:border-white/10">
                          <UploadCloud className="w-8 h-8 text-indigo-600" />
                       </div>
                       <div className="text-center px-4">
                          <p className="text-lg font-black text-slate-800 dark:text-slate-200">
                            {isEditMode ? 'Add new images or keep existing' : 'Drop images or click to upload'}
                          </p>
                          <p className="text-sm text-slate-400 font-medium">
                            {totalImages}/5 images • {isEditMode ? 'New uploads replace old ones' : 'Capture pictures that show the condition clearly'}
                          </p>
                       </div>
                    </div>
                 </div>

                 <div className="grid grid-cols-3 gap-4">
                    <AnimatePresence>
                      {imagePreviews.map((preview, index) => (
                        <motion.div 
                          key={preview}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="relative aspect-square rounded-2xl overflow-hidden group shadow-md border border-white/40 dark:border-white/10"
                        >
                          <img src={preview} alt="preview" className="w-full h-full object-cover" />
                          {index < existingImages.length && (
                            <div className="absolute top-1 left-1 bg-amber-500 text-white text-[9px] font-bold px-1.5 py-0.5 rounded-md uppercase">
                              Existing
                            </div>
                          )}
                          <button 
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute inset-0 bg-red-600/80 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
                          >
                            <X className="w-6 h-6" />
                          </button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    {Array.from({ length: 5 - totalImages }).map((_, i) => (
                      <div key={i} className="aspect-square rounded-2xl bg-white/40 backdrop-blur-sm border border-slate-200/30 border-dashed flex items-center justify-center">
                         <ImageIcon className="w-6 h-6 text-slate-200" />
                      </div>
                    ))}
                 </div>
               </div>
            </div>

            <div className="pt-8 border-t border-slate-100 dark:border-slate-700/50/40">
              <button 
                type="submit" 
                disabled={loading}
                className={`w-full ${isEditMode ? 'bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 shadow-amber-200/40' : ''} btn-primary h-16 text-lg flex items-center justify-center gap-3 shadow-2xl ${!isEditMode ? 'shadow-indigo-200/40' : ''}`}
              >
                {loading ? <Loader className="w-6 h-6 animate-spin" /> : isEditMode ? <Pencil className="w-6 h-6" /> : <CheckCircle2 className="w-6 h-6" />}
                {loading 
                  ? (isEditMode ? 'Saving Changes...' : 'Registering Your Item...') 
                  : (isEditMode ? 'Save Changes' : 'List Product to Campus')}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddProductPage;
