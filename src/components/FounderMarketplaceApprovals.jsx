import React, { useState, useEffect } from 'react';
import { fetchPendingListings, approveListing, rejectListing } from '../services/marketplaceService';
import { useToast } from '../context/ToastContext';
import { Check, X, Image as ImageIcon, ShoppingCart } from 'lucide-react';

export default function FounderMarketplaceApprovals({ college = 'GPREC' }) {
  const [pendingListings, setPendingListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToast } = useToast();

  const loadPendingListings = async () => {
    try {
      setLoading(true);
      const data = await fetchPendingListings(college);
      setPendingListings(data);
    } catch (err) {
      addToast({ message: 'Failed to load pending listings', type: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    loadPendingListings();
  }, [college]);

  const handleApprove = async (id) => {
    try {
      await approveListing(id);
      addToast({ message: 'Listing approved and is now public.', type: 'success' });
      setPendingListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      addToast({ message: 'Failed to approve listing.', type: 'error' });
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject and delete this listing?")) return;
    try {
      await rejectListing(id);
      addToast({ message: 'Listing rejected and removed.', type: 'info' });
      setPendingListings(prev => prev.filter(l => l.id !== id));
    } catch (err) {
      addToast({ message: 'Failed to reject listing.', type: 'error' });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <div className="w-8 h-8 border-4 border-brand-teal border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (pendingListings.length === 0) {
    return (
      <div className="glass-panel p-10 text-center rounded-3xl border border-white/5">
        <div className="w-16 h-16 bg-white/5 rounded-full flex items-center justify-center mx-auto mb-4 text-brand-teal">
          <ShoppingCart className="w-8 h-8" />
        </div>
        <h3 className="text-lg font-bold text-gray-200">No Pending Approvals</h3>
        <p className="text-sm text-gray-500 mt-2">All student listings have been reviewed!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-lg font-bold text-white">Pending Marketplace Items</h2>
          <p className="text-xs text-gray-400">Review products submitted by students before they go live.</p>
        </div>
        <div className="bg-brand-pink/20 text-brand-pink px-3 py-1 rounded-xl text-xs font-bold border border-brand-pink/30">
          {pendingListings.length} Pending
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingListings?.map(listing => (
          <div key={listing.id} className="glass-panel rounded-2xl border border-white/10 overflow-hidden flex flex-col">
            <div className="h-40 bg-black/40 relative flex items-center justify-center">
              {listing.images && listing.images[0] ? (
                <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
              ) : (
                <ImageIcon className="w-10 h-10 text-gray-600" />
              )}
              <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-md px-2 py-1 rounded-md text-[10px] font-bold text-yellow-400 uppercase">
                PENDING
              </div>
            </div>
            
            <div className="p-4 flex-1 flex flex-col">
              <h3 className="text-md font-bold text-white">{listing.title}</h3>
              <div className="text-brand-pink font-black text-lg">₹{listing.price}</div>
              
              <div className="mt-2 space-y-1 text-xs text-gray-400">
                <div className="flex justify-between">
                  <span>Seller:</span> <span className="text-white font-medium">{listing.sellerName ? listing.sellerName.split(' {')[0] : 'Unknown'}</span>
                </div>
                <div className="flex justify-between">
                  <span>Category:</span> <span className="text-white font-medium">{listing.category}</span>
                </div>
                <div className="flex justify-between">
                  <span>Condition:</span> <span className="text-white font-medium">{listing.condition}</span>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t border-white/5 flex gap-2">
                <button 
                  onClick={() => handleApprove(listing.id)}
                  className="flex-1 bg-brand-teal/20 text-brand-teal border border-brand-teal/30 font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-brand-teal/30 transition-colors"
                >
                  <Check className="w-4 h-4" /> Approve
                </button>
                <button 
                  onClick={() => handleReject(listing.id)}
                  className="flex-1 bg-red-500/10 text-red-500 border border-red-500/30 font-bold py-2 rounded-xl flex items-center justify-center gap-2 hover:bg-red-500/20 transition-colors"
                >
                  <X className="w-4 h-4" /> Reject
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
