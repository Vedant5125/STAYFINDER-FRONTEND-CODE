import React from 'react';
import type { Listing } from '../../types/index.ts';
import ListingCard from './ListingCard';

interface ListingGridProps {
  listings: Listing[];
  loading?: boolean;
  onWishlistChange?: () => void;
}

const ListingGrid: React.FC<ListingGridProps> = ({ listings, loading, onWishlistChange }) => {
  if (loading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="card animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
              <div className="h-4 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-2/3"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (listings.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-500 text-lg">No listings found</div>
        <p className="text-gray-400 mt-2">Try adjusting your search criteria</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {listings.map((listing) => (
        <ListingCard 
          key={listing._id} 
          listing={listing} 
          onWishlistChange={onWishlistChange}
        />
      ))}
    </div>
  );
};

export default ListingGrid;