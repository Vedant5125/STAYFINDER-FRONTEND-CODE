import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { PlusIcon, PencilIcon, TrashIcon } from '@heroicons/react/24/outline';
import type { Listing } from '../../types';
import api from '../../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../../components/Common/LoadingSpinner';

const HostListings: React.FC = () => {
  const [listings, setListings] = useState<Listing[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    fetchHostListings();
  }, []);

  const fetchHostListings = async () => {
    try {
      const response = await api.post('/host/showHostListings');
      setListings(response.data.data);
    } catch (error) {
      console.error('Error fetching host listings:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this listing?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/host/deleteStay/${id}`);
      setListings(listings.filter(listing => listing._id !== id));
      toast.success('Listing deleted successfully');
    } catch (error) {
      console.error('Error deleting listing:', error);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-gray-900">My Listings</h1>
          <Link
            to="/host/add-listing"
            className="btn-primary flex items-center"
          >
            <PlusIcon className="h-5 w-5 mr-2" />
            Add New Listing
          </Link>
        </div>

        {listings.length === 0 ? (
          <div className="text-center py-16">
            <div className="text-gray-500 text-lg mb-4">No listings found</div>
            <p className="text-gray-400 mb-6">
              Create your first listing to start hosting guests
            </p>
            <Link
              to="/host/add-listing"
              className="btn-primary inline-flex items-center"
            >
              <PlusIcon className="h-5 w-5 mr-2" />
              Add Your First Listing
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => (
              <div key={listing._id} className="card">
                <div className="relative">
                  <img
                    src={listing.thumbnail}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="absolute top-3 right-3 flex space-x-2">
                    <Link
                      to={`/host/edit-listing/${listing._id}`}
                      className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors"
                    >
                      <PencilIcon className="h-4 w-4 text-gray-600" />
                    </Link>
                    <button
                      onClick={() => handleDelete(listing._id)}
                      disabled={deletingId === listing._id}
                      className="p-2 bg-white/80 rounded-full hover:bg-white transition-colors disabled:opacity-50"
                    >
                      {deletingId === listing._id ? (
                        <LoadingSpinner size="sm" />
                      ) : (
                        <TrashIcon className="h-4 w-4 text-red-600" />
                      )}
                    </button>
                  </div>
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

                  <p className="text-gray-600 text-sm mb-2">
                    {listing.location.city}, {listing.location.country}
                  </p>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">
                      {listing.guest} guests
                    </span>
                    <span className="inline-block bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full capitalize">
                      {listing.type}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                    {listing.description}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <Link
                      to={`/listing/${listing._id}`}
                      className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                    >
                      View Details →
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HostListings;