import React, { useState, useEffect } from 'react';
import { HeartIcon } from '@heroicons/react/24/outline';
import ListingGrid from '../components/Listings/ListingGrid';
import type { Listing } from '../types';
import api from '../utils/api';

const Wishlist: React.FC = () => {
  const [wishlistItems, setWishlistItems] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWishlist();
  }, []);

  const fetchWishlist = async () => {
    try {
      const response = await api.post('/users/showWishList');
      setWishlistItems(response.data.data);
    } catch (error) {
      console.error('Error fetching wishlist:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center mb-8">
          <HeartIcon className="h-8 w-8 text-primary-600 mr-3" />
          <h1 className="text-3xl font-bold text-gray-900">My Wishlist</h1>
        </div>

        {loading ? (
          <ListingGrid listings={[]} loading={true} />
        ) : wishlistItems.length === 0 ? (
          <div className="text-center py-16">
            <HeartIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Your wishlist is empty
            </h2>
            <p className="text-gray-600 mb-6">
              Start exploring and save your favorite places to stay
            </p>
            <a
              href="/"
              className="btn-primary inline-block"
            >
              Explore Listings
            </a>
          </div>
        ) : (
          <ListingGrid 
            listings={wishlistItems} 
            onWishlistChange={fetchWishlist}
          />
        )}
      </div>
    </div>
  );
};

export default Wishlist;