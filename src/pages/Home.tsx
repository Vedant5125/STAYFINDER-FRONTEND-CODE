import React, { useState, useEffect } from 'react';
import { MagnifyingGlassIcon, MapPinIcon } from '@heroicons/react/24/outline';
import ListingGrid from '../components/Listings/ListingGrid';
import type { Listing } from '../types';
import api from '../utils/api';
import { useAuth } from '../context/useAuth'; // Import the useAuth hook
import { Link } from 'react-router-dom'; // Import Link for navigation

const Home: React.FC = () => {
 const { user } = useAuth(); // Access the user from the AuthContext
 const [listings, setListings] = useState<Listing[]>([]);
 const [filteredListings, setFilteredListings] = useState<Listing[]>([]);
 const [loading, setLoading] = useState(true);
 const [searchTerm, setSearchTerm] = useState('');
 const [selectedType, setSelectedType] = useState('');

 const propertyTypes = ['apartment', 'house', 'villa', 'cabin', 'bungalow', 'room'];

 useEffect(() => {
  fetchListings();
 }, []);

 useEffect(() => {
  filterListings();
 }, [listings, searchTerm, selectedType]);

 const fetchListings = async () => {
  try {
   const response = await api.get('/listing/getAllListings');
   setListings(response.data.data);
  } catch (error) {
   console.error('Error fetching listings:', error);
  } finally {
   setLoading(false);
  }
 };

 const filterListings = () => {
  let filtered = listings;

  if (searchTerm) {
   filtered = filtered.filter(listing =>
    listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    listing.location.country.toLowerCase().includes(searchTerm.toLowerCase())
   );
  }

  if (selectedType) {
   filtered = filtered.filter(listing => listing.type === selectedType);
  }

  setFilteredListings(filtered);
 };

 return (
  <div className="min-h-screen bg-gray-50">
   {/* Hero Section */}
   <div className="bg-gradient-to-r from-primary-600 to-primary-800 text-white">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
     <div className="text-center">
      <h1 className="text-4xl md:text-6xl font-bold mb-6">
       Find Your Perfect Stay
      </h1>
      <p className="text-xl md:text-2xl mb-8 text-primary-100">
       Discover unique accommodations around the world
      </p>

      {/* Search Bar and Bookings Button */}
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-4">
       <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex-1 relative">
         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
         <input
          type="text"
          placeholder="Search by location or property name..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
         />
        </div>
        <select
         value={selectedType}
         onChange={(e) => setSelectedType(e.target.value)}
         className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900"
        >
         <option value="">All Types</option>
         {propertyTypes.map(type => (
          <option key={type} value={type} className="capitalize">
           {type}
          </option>
         ))}
        </select>

                {/* Conditional Bookings Button */}
                {user && user.role !== 'host' && (
                    <Link
                        to="/bookings" // This route needs to be created
                        className="w-full md:w-auto px-6 py-3 bg-primary-600 text-white rounded-lg shadow hover:bg-primary-700 transition-colors duration-200 text-center"
                    >
                        My Bookings
                    </Link>
                )}
       </div>
      </div>
     </div>
    </div>
   </div>

   {/* Listings Section */}
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    <div className="flex items-center justify-between mb-8">
     <h2 className="text-2xl font-bold text-gray-900">
      {searchTerm || selectedType ? 'Search Results' : 'All Properties'}
     </h2>
     <div className="text-gray-600">
      {!loading && `${filteredListings.length} properties found`}
     </div>
    </div>

    <ListingGrid 
     listings={filteredListings} 
     loading={loading}
     onWishlistChange={fetchListings}
    />
   </div>

   {/* Features Section */}
   <div className="bg-white py-16">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
     <div className="text-center mb-12">
      <h2 className="text-3xl font-bold text-gray-900 mb-4">
       Why Choose StayFinder?
      </h2>
      <p className="text-lg text-gray-600">
       We make finding your perfect accommodation simple and secure
      </p>
     </div>

     <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
      <div className="text-center">
       <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <MapPinIcon className="h-8 w-8 text-primary-600" />
       </div>
       <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Prime Locations
       </h3>
       <p className="text-gray-600">
        Discover properties in the best locations around the world
       </p>
      </div>

      <div className="text-center">
       <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <MagnifyingGlassIcon className="h-8 w-8 text-primary-600" />
       </div>
       <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Easy Search
       </h3>
       <p className="text-gray-600">
        Find exactly what you're looking for with our advanced search
       </p>
      </div>

      <div className="text-center">
       <div className="bg-primary-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
        <svg className="h-8 w-8 text-primary-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
       </div>
       <h3 className="text-xl font-semibold text-gray-900 mb-2">
        Secure Booking
       </h3>
       <p className="text-gray-600">
        Book with confidence using our secure payment system
       </p>
      </div>
     </div>
    </div>
   </div>
  </div>
 );
};

export default Home;