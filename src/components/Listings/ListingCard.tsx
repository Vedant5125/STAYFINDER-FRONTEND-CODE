import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, MapPinIcon, UserGroupIcon } from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import type { Listing } from '../../types';
import { useAuth } from '../../context/useAuth.tsx';
import api from '../../utils/api';
import toast from 'react-hot-toast';

interface ListingCardProps {
  listing: Listing;
  onWishlistChange?: () => void;
}

const ListingCard: React.FC<ListingCardProps> = ({ listing, onWishlistChange }) => {
  const { user } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(
    user?.wishList?.includes(listing._id) || false
  );
  const [isLoading, setIsLoading] = useState(false);

  const handleWishlistToggle = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!user) {
      toast.error('Please login to add to wishlist');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only users can add to wishlist');
      return;
    }

    setIsLoading(true);

    try {
      if (isInWishlist) {
        await api.post('/users/removeFromWishList', { listingId: listing._id });
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post('/users/addToWishlist', { listingId: listing._id });
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
      
      if (onWishlistChange) {
        onWishlistChange();
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card group cursor-pointer">
      <Link to={`/listing/${listing._id}`}>
        <div className="relative">
          <img
            src={listing.thumbnail}
            alt={listing.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          
          {user?.role === 'user' && (
            <button
              onClick={handleWishlistToggle}
              disabled={isLoading}
              className="absolute top-3 right-3 p-2 rounded-full bg-white/80 hover:bg-white transition-colors duration-200 disabled:opacity-50"
            >
              {isInWishlist ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
            </button>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-start justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900 line-clamp-1">
              {listing.title}
            </h3>
            <span className="text-lg font-bold text-primary-600">
              ${listing.price}/night
            </span>
          </div>

          <div className="flex items-center text-gray-600 mb-2">
            <MapPinIcon className="h-4 w-4 mr-1" />
            <span className="text-sm">
              {listing.location.city}, {listing.location.country}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center text-gray-600">
              <UserGroupIcon className="h-4 w-4 mr-1" />
              <span className="text-sm">{listing.guest} guests</span>
            </div>
            
            <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">
              {listing.type}
            </span>
          </div>

          <p className="text-gray-600 text-sm mt-2 line-clamp-2">
            {listing.description}
          </p>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;