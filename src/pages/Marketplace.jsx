import React, { useState, useEffect } from 'react';
import { 
  fetchListings, 
  createListing, 
  deleteListing, 
  markAsSold, 
  reportListing 
} from '../services/marketplaceService';
import { useToast } from '../context/ToastContext';
import { 
  Search, Plus, MapPin, Tag, Filter, X, 
  Phone, MessageCircle, AlertTriangle, CheckCircle, Trash2, Edit2, Image as ImageIcon, Upload
} from 'lucide-react';
import { supabase } from '../config/supabase';
const CATEGORIES = ["All", "Electronics", "Furniture", "Books", "Stationery/Drafters", "Other"];
const CONDITIONS = ["New", "Used - Like New", "Used - Good", "Used - Fair"];

const cleanScholarName = (rawName) => {
  if (!rawName) return 'Anonymous Scholar';
  let clean = String(rawName);
  if (clean.includes(' {')) {
    clean = clean.substring(0, clean.indexOf(' {')).trim();
  } else if (clean.includes('{')) {
    clean = clean.substring(0, clean.indexOf('{')).trim();
  }
  return clean || 'Anonymous Scholar';
};

const Marketplace = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [selectedListing, setSelectedListing] = useState(null); // For details modal

  const { addToast } = useToast();
  
  // Assume user is stored in localStorage
  const user = (() => { try { const item = localStorage.getItem('lumixora_user'); return item ? JSON.parse(item) : {}; } catch (e) { return {}; } })();
  const college = user?.college || 'GPREC';

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Electronics',
    description: '',
    condition: 'Used - Good',
    brand: '',
    price: '',
    isNegotiable: true,
    images: [''], // support 1 image URL for now to keep it simple
    contactDetails: '',
    location: ''
  });
  const [imageFile, setImageFile] = useState(null);
  const [uploadingImage, setUploadingImage] = useState(false);

  const loadListings = async () => {
    try {
      setLoading(true);
      const data = await fetchListings(college);
      setListings(data);
    } catch (err) {
      addToast({ message: 'Failed to load listings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);

          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, {
              type: 'image/jpeg',
              lastModified: Date.now()
            }));
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadListings();
  }, []);

  const handlePostSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title || !formData.price || !formData.contactDetails || !formData.location) {
      addToast({ message: 'Please fill in all required fields.', type: 'warning' });
      return;
    }
    
    try {
      setUploadingImage(true);
      
      // Start background process
      (async () => {
        try {
          let imageUrl = formData.images[0];
          if (imageFile) {
            const compressedFile = await compressImage(imageFile);
            const path = `marketplace/${Date.now()}_${imageFile.name}`;
            
            const { error: uploadError } = await supabase.storage
              .from('academic_resources')
              .upload(path, compressedFile, { cacheControl: '3600', upsert: false });
              
            if (uploadError) throw uploadError;
            
            const { data: { publicUrl } } = supabase.storage
              .from('academic_resources')
              .getPublicUrl(path);
              
            imageUrl = publicUrl;
          }

          await createListing({
            ...formData,
            images: [imageUrl],
            price: Number(formData.price),
            sellerId: user.uid,
            sellerName: cleanScholarName(user.name || user.email),
            college: college,
          });
          
          addToast({ message: 'Listing submitted successfully!', type: 'success' });
          loadListings();
        } catch (err) {
          console.error("Background upload failed:", err);
          addToast({ message: 'Error posting listing in background', type: 'error' });
        }
      })();

      // Instantly close modal and reset form
      addToast({ message: 'Posting listing in background...', type: 'info' });
      setIsPostModalOpen(false);
      setFormData({
        title: '', category: 'Electronics', description: '', condition: 'Used - Good',
        brand: '', price: '', isNegotiable: true, images: [''], contactDetails: '', location: ''
      });
      setImageFile(null);
    } catch (err) {
      addToast({ message: 'Error initiating post', type: 'error' });
    } finally {
      setUploadingImage(false);
    }
  };

  const handleMarkAsSold = async (id) => {
    try {
      await markAsSold(id);
      addToast({ message: 'Marked as sold!', type: 'success' });
      loadListings();
    } catch (err) {
      addToast({ message: 'Failed to update', type: 'error' });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this listing?")) return;
    try {
      await deleteListing(id);
      addToast({ message: 'Listing deleted', type: 'success' });
      loadListings();
    } catch (err) {
      addToast({ message: 'Failed to delete', type: 'error' });
    }
  };

  const handleReport = async (id) => {
    if (!window.confirm("Report this listing as inappropriate or misleading?")) return;
    try {
      await reportListing(id);
      addToast({ message: 'Listing reported. Admins will review it.', type: 'info' });
      setSelectedListing(null);
    } catch (err) {
      addToast({ message: 'Failed to report', type: 'error' });
    }
  };

  const filteredListings = listings.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getWhatsAppLink = (number) => {
    // Basic sanitization
    const cleanNum = number.replace(/\D/g, '');
    return `https://wa.me/${cleanNum.length === 10 ? '91'+cleanNum : cleanNum}`;
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 pb-24 md:pb-6 relative overflow-x-hidden">
      {/* Background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-brand-teal/10 rounded-full blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-brand-purple/10 rounded-full blur-[120px] pointer-events-none"></div>

      <div className="max-w-6xl mx-auto space-y-8 relative z-10">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tight text-white flex items-center gap-3">
              <span className="bg-gradient-to-br from-brand-teal to-brand-purple text-transparent bg-clip-text">
                Student Marketplace
              </span>
            </h1>
            <p className="text-gray-400 text-sm mt-1">Buy and sell products within {college}</p>
          </div>
          <button 
            onClick={() => setIsPostModalOpen(true)}
            className="bg-brand-teal text-black px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity shadow-lg shadow-brand-teal/20"
          >
            <Plus className="w-5 h-5" />
            Sell an Item
          </button>
        </div>

        {/* Filters & Search */}
        <div className="glass-panel p-4 rounded-3xl border border-white/10 flex flex-col md:flex-row gap-4 items-center">
          <div className="relative flex-1 w-full">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input 
              type="text" 
              placeholder="Search products..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-12 pr-4 text-sm text-gray-200 focus:outline-none focus:border-brand-teal transition-colors"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 hide-scrollbar">
            {CATEGORIES.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`whitespace-nowrap px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  selectedCategory === cat 
                    ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/30' 
                    : 'bg-white/5 text-gray-400 border border-transparent hover:bg-white/10'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Grid */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : filteredListings.length === 0 ? (
          <div className="text-center py-20 glass-panel rounded-3xl border border-white/5">
            <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
              <Tag className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold text-gray-200">No products found</h3>
            <p className="text-sm text-gray-500 mt-1">Try adjusting your search or be the first to sell something!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredListings.map(listing => (
              <div 
                key={listing.id} 
                className="glass-panel rounded-3xl border border-white/10 overflow-hidden flex flex-col hover:border-brand-teal/30 transition-all cursor-pointer group"
                onClick={() => setSelectedListing(listing)}
              >
                <div className="h-48 bg-black/40 relative overflow-hidden flex items-center justify-center">
                  {listing.images && listing.images[0] ? (
                    <img 
                      src={listing.images[0]} 
                      alt={listing.title} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <ImageIcon className="w-12 h-12 text-gray-600" />
                  )}
                  <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold text-brand-teal border border-white/10 uppercase tracking-wide">
                    {listing.category}
                  </div>
                </div>
                <div className="p-5 flex flex-col flex-1">
                  <h3 className="text-lg font-bold text-gray-100 line-clamp-1">{listing.title}</h3>
                  <div className="text-brand-pink font-black text-xl mt-1">₹{listing.price}</div>
                  
                  <div className="mt-4 space-y-2 text-xs text-gray-400">
                    <div className="flex items-center gap-2">
                      <Tag className="w-3 h-3" />
                      <span>{listing.condition}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" />
                      <span className="line-clamp-1">{listing.location}</span>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <span className="text-xs text-gray-500 truncate pr-2">By {cleanScholarName(listing.sellerName)}</span>
                    {user?.uid === listing.sellerId ? (
                      <span className="text-[10px] font-bold text-brand-teal uppercase tracking-wide bg-brand-teal/10 px-2 py-1 rounded-md">Your Post</span>
                    ) : (
                      <button 
                        className="bg-white/5 hover:bg-white/10 p-2 rounded-xl text-gray-300 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation(); // prevent modal opening if just wanting to click contact?
                          setSelectedListing(listing);
                        }}
                      >
                        View
                      </button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Post Modal */}
      {isPostModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsPostModalOpen(false)}></div>
          <div className="glass-panel w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl p-6 border border-white/10 relative z-10 hide-scrollbar">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white">Sell an Item</h2>
              <button onClick={() => setIsPostModalOpen(false)} className="text-gray-400 hover:text-white bg-white/5 p-2 rounded-full">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <form onSubmit={handlePostSubmit} className="space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Title *</label>
                  <input required type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none" 
                    placeholder="e.g. Drafting Table"
                    value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Price (₹) *</label>
                  <input required type="number" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none" 
                    placeholder="e.g. 500"
                    value={formData.price} onChange={e => setFormData({...formData, price: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Category</label>
                  <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none appearance-none"
                    value={formData.category} onChange={e => setFormData({...formData, category: e.target.value})}
                  >
                    {CATEGORIES.filter(c => c !== 'All').map(c => <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>)}
                  </select>
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Condition</label>
                  <select className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none appearance-none"
                    value={formData.condition} onChange={e => setFormData({...formData, condition: e.target.value})}
                  >
                    {CONDITIONS.map(c => <option key={c} value={c} className="bg-[#0a0a0f]">{c}</option>)}
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Description</label>
                <textarea className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none min-h-[100px]"
                  placeholder="Describe the item..."
                  value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})}
                ></textarea>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Brand (Optional)</label>
                  <input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none" 
                    placeholder="e.g. Casio"
                    value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs text-gray-400 font-bold uppercase tracking-wide flex items-center justify-between">
                    <span>Negotiable?</span>
                    <input type="checkbox" className="accent-brand-teal w-4 h-4"
                      checked={formData.isNegotiable} onChange={e => setFormData({...formData, isNegotiable: e.target.checked})}
                    />
                  </label>
                  <div className="text-[10px] text-gray-500 py-3">Check if you are open to bargaining.</div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Contact Number (WhatsApp) *</label>
                <input required type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none" 
                  placeholder="e.g. 9876543210"
                  value={formData.contactDetails} onChange={e => setFormData({...formData, contactDetails: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Location *</label>
                <input required type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none" 
                  placeholder="e.g. Boys Hostel A / Main Gate"
                  value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs text-gray-400 font-bold uppercase tracking-wide">Image (Upload or URL)</label>
                <div className="flex flex-col gap-3">
                  <input type="text" className="w-full bg-black/30 border border-white/10 rounded-xl px-4 py-3 text-sm focus:border-brand-teal outline-none" 
                    placeholder="Paste an image URL here..."
                    value={formData.images[0]} onChange={e => setFormData({...formData, images: [e.target.value]})}
                    disabled={!!imageFile}
                  />
                  
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-xs text-gray-500 font-bold uppercase tracking-wide">OR</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                  </div>

                  <label className={`w-full flex items-center justify-center gap-2 border border-dashed border-white/20 rounded-xl py-4 cursor-pointer transition-colors ${imageFile ? 'bg-brand-teal/10 border-brand-teal/50 text-brand-teal' : 'hover:bg-white/5 text-gray-400'}`}>
                    <input type="file" accept="image/*" className="hidden" onChange={e => {
                      if(e.target.files && e.target.files[0]) {
                        setImageFile(e.target.files[0]);
                        setFormData({...formData, images: ['']}); // clear url if file is selected
                      }
                    }} />
                    <Upload className="w-5 h-5" />
                    <span className="text-sm font-bold">{imageFile ? imageFile.name : 'Upload Image from Device'}</span>
                  </label>
                  {imageFile && (
                    <button type="button" onClick={() => setImageFile(null)} className="text-xs text-red-400 hover:text-red-300 self-end font-bold transition-colors">Remove uploaded file</button>
                  )}
                </div>
              </div>

              <button type="submit" disabled={uploadingImage} className="w-full bg-brand-teal text-black font-black py-4 rounded-xl hover:opacity-90 transition-opacity uppercase tracking-wide mt-6 disabled:opacity-50">
                {uploadingImage ? 'Uploading & Posting...' : 'Post Product'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Details Modal */}
      {selectedListing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setSelectedListing(null)}></div>
          <div className="glass-panel w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl border border-white/10 relative z-10 hide-scrollbar flex flex-col md:flex-row">
            
            {/* Left Image Area */}
            <div className="w-full md:w-1/2 bg-black/50 min-h-[300px] flex items-center justify-center relative">
              <button onClick={() => setSelectedListing(null)} className="absolute top-4 left-4 text-white bg-black/50 p-2 rounded-full md:hidden">
                <X className="w-5 h-5" />
              </button>
              {selectedListing.images && selectedListing.images[0] ? (
                <img src={selectedListing.images[0]} alt="Product" className="w-full h-full object-contain" />
              ) : (
                <ImageIcon className="w-16 h-16 text-gray-600" />
              )}
            </div>

            {/* Right Details Area */}
            <div className="w-full md:w-1/2 p-6 md:p-8 flex flex-col">
              <div className="flex justify-between items-start mb-2">
                <div className="text-[10px] font-bold text-brand-teal uppercase tracking-wide border border-brand-teal/30 bg-brand-teal/10 px-2 py-1 rounded-md">
                  {selectedListing.category}
                </div>
                <button onClick={() => setSelectedListing(null)} className="text-gray-400 hover:text-white hidden md:block bg-white/5 p-2 rounded-full">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <h2 className="text-2xl font-black text-white mt-3">{selectedListing.title}</h2>
              <div className="text-3xl font-black text-brand-pink mt-2">₹{selectedListing.price}</div>
              {selectedListing.isNegotiable && <span className="text-xs text-gray-400 mt-1">Price is Negotiable</span>}

              <div className="flex flex-wrap gap-4 mt-6 py-4 border-y border-white/5">
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Condition</span>
                  <div className="text-sm font-semibold">{selectedListing.condition}</div>
                </div>
                {selectedListing.brand && (
                  <div className="space-y-1">
                    <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Brand</span>
                    <div className="text-sm font-semibold">{selectedListing.brand}</div>
                  </div>
                )}
                <div className="space-y-1">
                  <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide">Location</span>
                  <div className="text-sm font-semibold">{selectedListing.location}</div>
                </div>
              </div>

              <div className="mt-6 flex-1">
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-wide mb-2 block">Description</span>
                <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                  {selectedListing.description || 'No description provided.'}
                </p>
              </div>

              <div className="mt-8 pt-4 border-t border-white/5 flex flex-col gap-4">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-gray-400">Listed by <span className="text-white font-bold">{cleanScholarName(selectedListing.sellerName)}</span></span>
                  <span className="text-gray-500 text-xs">{selectedListing.createdAt?.toDate ? selectedListing.createdAt.toDate().toLocaleDateString() : 'Recently'}</span>
                </div>

                {user?.uid === selectedListing.sellerId ? (
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleMarkAsSold(selectedListing.id)}
                      className="flex-1 bg-brand-teal/20 text-brand-teal border border-brand-teal/30 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-teal/30"
                    >
                      <CheckCircle className="w-4 h-4" /> Sold
                    </button>
                    <button 
                      onClick={() => handleDelete(selectedListing.id)}
                      className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 font-bold py-3 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20"
                    >
                      <Trash2 className="w-4 h-4" /> Delete
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <a 
                      href={getWhatsAppLink(selectedListing.contactDetails)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-[3] bg-[#25D366] text-black font-black py-3 rounded-xl flex items-center justify-center gap-2 hover:opacity-90"
                    >
                      <MessageCircle className="w-5 h-5" /> WhatsApp
                    </a>
                    <button 
                      onClick={() => handleReport(selectedListing.id)}
                      title="Report Listing"
                      className="flex-1 bg-white/5 text-gray-400 font-bold py-3 rounded-xl flex items-center justify-center hover:bg-red-500/20 hover:text-red-400 transition-colors border border-white/5"
                    >
                      <AlertTriangle className="w-5 h-5" />
                    </button>
                  </div>
                )}
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Marketplace;

