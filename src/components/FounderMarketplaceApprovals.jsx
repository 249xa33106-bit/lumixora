import React, { useState, useEffect } from 'react';
import { fetchPendingListings, approveListing, rejectListing } from '../services/marketplaceService';
import { useToast } from '../context/ToastContext';
import { 
  Check, 
  X, 
  Image as ImageIcon, 
  ShoppingCart, 
  RefreshCw, 
  Search, 
  Filter, 
  Eye, 
  Tag, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Clock,
  Sparkles
} from 'lucide-react';

export default function FounderMarketplaceApprovals({ college = 'All' }) {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCollege, setActiveCollege] = useState(college || 'All');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedListing, setSelectedListing] = useState(null);
  const [processingId, setProcessingId] = useState(null);
  const { addToast } = useToast();

  const loadPendingListings = async () => {
    try {
      setLoading(true);
      const data = await fetchPendingListings(activeCollege);
      setPendingListings(data);
    } catch (err) {
      console.error('Failed to load pending listings:', err);
      addToast({ message: 'Failed to load pending listings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPendingListings();
  }, [activeCollege]);

  const handleApprove = async (id) => {
    try {
      setProcessingId(id);
      await approveListing(id);
      addToast({ message: '✅ Listing approved and is now live on Campus Marketplace!', type: 'success' });
      setPendingListings(prev => prev.filter(l => l.id !== id));
      if (selectedListing?.id === id) setSelectedListing(null);
    } catch (err) {
      addToast({ message: 'Failed to approve listing.', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and remove this listing?")) return;
    try {
      setProcessingId(id);
      await rejectListing(id);
      addToast({ message: 'Listing rejected and removed.', type: 'info' });
      setPendingListings(prev => prev.filter(l => l.id !== id));
      if (selectedListing?.id === id) setSelectedListing(null);
    } catch (err) {
      addToast({ message: 'Failed to reject listing.', type: 'error' });
    } finally {
      setProcessingId(null);
    }
  };

  const filteredListings = pendingListings.filter(l => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    const title = (l.title || '').toLowerCase();
    const seller = (l.sellerName || '').toLowerCase();
    const category = (l.category || '').toLowerCase();
    const desc = (l.description || '').toLowerCase();
    return title.includes(q) || seller.includes(q) || category.includes(q) || desc.includes(q);
  });

  return (
    <div className="space-y-6">
      {/* Header & Controls Bar */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel p-5 rounded-2xl border border-white/10">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-brand-pink/20 border border-brand-pink/30 flex items-center justify-center text-brand-pink">
              <ShoppingCart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                Marketplace Approvals
                <span className="bg-amber-500/20 text-amber-300 text-xs px-2.5 py-0.5 rounded-full border border-amber-500/30 font-bold">
                  {pendingListings.length} Pending
                </span>
              </h2>
              <p className="text-xs text-gray-400">Review products submitted by students before they go live on Campus Market.</p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {/* Search */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search items, sellers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-pink/50"
            />
          </div>

          {/* College Filter */}
          <select
            value={activeCollege}
            onChange={(e) => setActiveCollege(e.target.value)}
            className="px-3 py-2 bg-white/5 border border-white/10 rounded-xl text-xs text-gray-200 focus:outline-none focus:border-brand-pink/50 cursor-pointer"
          >
            <option value="All" className="bg-[#121218]">All Colleges</option>
            <option value="GPREC" className="bg-[#121218]">GPREC Kurnool</option>
            <option value="Sri Venkateshwara College Of Engineering" className="bg-[#121218]">SVCE Tirupati</option>
            <option value="Annamacharya University" className="bg-[#121218]">Annamacharya Univ</option>
            <option value="Narayana Engineering College" className="bg-[#121218]">Narayana Engg</option>
          </select>

          {/* Refresh */}
          <button
            onClick={loadPendingListings}
            disabled={loading}
            className="p-2 bg-white/5 hover:bg-white/10 text-gray-300 rounded-xl border border-white/10 transition-colors cursor-pointer"
            title="Refresh pending items"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-brand-pink' : ''}`} />
          </button>
        </div>
      </div>

      {/* Main Content */}
      {loading ? (
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-brand-pink border-t-transparent rounded-full animate-spin"></div>
        </div>
      ) : filteredListings.length === 0 ? (
        <div className="glass-panel p-12 text-center rounded-3xl border border-white/5">
          <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center mx-auto mb-4 text-emerald-400 border border-emerald-500/20">
            <Check className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-gray-200">All Clear! No Pending Approvals</h3>
          <p className="text-sm text-gray-500 mt-2 max-w-md mx-auto">
            {searchQuery 
              ? `No pending products matched "${searchQuery}".` 
              : 'All student marketplace listings have been reviewed and published.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredListings.map(listing => (
            <div 
              key={listing.id} 
              className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col hover:border-brand-pink/30 transition-all shadow-md group"
            >
              {/* Product Image */}
              <div className="h-44 bg-black/40 relative flex items-center justify-center overflow-hidden">
                {listing.images && listing.images[0] && listing.images[0] !== '' ? (
                  <img 
                    src={listing.images[0]} 
                    alt={listing.title} 
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                ) : (
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <ImageIcon className="w-10 h-10 opacity-40" />
                    <span className="text-[10px] uppercase font-bold tracking-wider">No Image Attached</span>
                  </div>
                )}
                
                <div className="absolute top-2.5 left-2.5 bg-amber-500/90 text-black px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider shadow-sm">
                  Awaiting Review
                </div>

                <div className="absolute top-2.5 right-2.5 bg-black/70 backdrop-blur-md text-emerald-400 font-sora font-extrabold px-3 py-1 rounded-full text-sm border border-emerald-500/30 shadow-sm">
                  ₹{listing.price}
                </div>
              </div>
              
              {/* Details Body */}
              <div className="p-4 flex-1 flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] font-bold text-brand-pink uppercase tracking-wider bg-brand-pink/10 px-2 py-0.5 rounded-md border border-brand-pink/20">
                      {listing.category || 'General'}
                    </span>
                    <span className="text-[10px] text-gray-400 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {listing.createdAt ? new Date(listing.createdAt).toLocaleDateString() : 'Recent'}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-white line-clamp-1 group-hover:text-amber-300 transition-colors">
                    {listing.title}
                  </h3>

                  {listing.description && (
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                      {listing.description}
                    </p>
                  )}

                  <div className="mt-3 pt-3 border-t border-white/5 space-y-1.5 text-xs text-gray-400">
                    <div className="flex items-center justify-between">
                      <span className="flex items-center gap-1.5 text-gray-500">
                        <User className="w-3.5 h-3.5" /> Seller:
                      </span>
                      <span className="text-white font-medium truncate max-w-[150px]">{listing.sellerName}</span>
                    </div>

                    {(listing.contactDetails || listing.sellerEmail) && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <Mail className="w-3.5 h-3.5" /> Contact:
                        </span>
                        <span className="text-gray-300 font-mono text-[11px] truncate max-w-[150px]">
                          {listing.contactDetails || listing.sellerEmail}
                        </span>
                      </div>
                    )}

                    {listing.college && (
                      <div className="flex items-center justify-between">
                        <span className="flex items-center gap-1.5 text-gray-500">
                          <MapPin className="w-3.5 h-3.5" /> College:
                        </span>
                        <span className="text-gray-300 text-[11px] font-medium truncate max-w-[150px]">
                          {listing.college}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="mt-4 pt-3 border-t border-white/5 flex gap-2">
                  <button 
                    onClick={() => handleApprove(listing.id)}
                    disabled={processingId === listing.id}
                    className="flex-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer shadow-sm disabled:opacity-50"
                  >
                    <Check className="w-3.5 h-3.5" />
                    {processingId === listing.id ? 'Approving...' : 'Approve Live'}
                  </button>

                  <button 
                    onClick={() => handleReject(listing.id)}
                    disabled={processingId === listing.id}
                    className="flex-1 bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 font-bold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
                  >
                    <X className="w-3.5 h-3.5" />
                    Reject
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
