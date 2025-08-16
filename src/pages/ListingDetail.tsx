import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  MapPinIcon, 
  UserGroupIcon, 
  HeartIcon,
  // CalendarIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline';
import { HeartIcon as HeartSolidIcon } from '@heroicons/react/24/solid';
import DatePicker from 'react-datepicker';
import "react-datepicker/dist/react-datepicker.css";
import type { Listing, BookedDate } from '../types';
import { useAuth } from '../context/useAuth.tsx';
import api from '../utils/api';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const ListingDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [listing, setListing] = useState<Listing | null>(null);
  const [loading, setLoading] = useState(true);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [bookedDates, setBookedDates] = useState<BookedDate[]>([]);
  
  // Booking form state
  const [checkIn, setCheckIn] = useState<Date | null>(null);
  const [checkOut, setCheckOut] = useState<Date | null>(null);
  const [guests, setGuests] = useState(1);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    if (id) {
      fetchListing();
      fetchBookedDates();
    }
  }, [id]);

  useEffect(() => {
    if (user && listing) {
      setIsInWishlist(user.wishList?.includes(listing._id) || false);
    }
  }, [user, listing]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`/listing/listingDetails/${id}`);
      setListing(response.data.data);
    } catch (error) {
      console.error('Error fetching listing:', error);
      toast.error('Failed to load listing');
    } finally {
      setLoading(false);
    }
  };

  const fetchBookedDates = async () => {
    if (!user) return;
    
    try {
      const response = await api.get(`/users/getBookedDates/${id}`);
      setBookedDates(response.data.data);
    } catch (error) {
      console.error('Error fetching booked dates:', error);
    }
  };

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error('Please login to add to wishlist');
      navigate('/login');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only users can add to wishlist');
      return;
    }

    try {
      if (isInWishlist) {
        await api.post('/users/removeFromWishList', { listingId: id });
        setIsInWishlist(false);
        toast.success('Removed from wishlist');
      } else {
        await api.post('/users/addToWishlist', { listingId: id });
        setIsInWishlist(true);
        toast.success('Added to wishlist');
      }
    } catch (error) {
      console.error('Error updating wishlist:', error);
    }
  };


  const calculateTotalPrice = () => {
    if (!checkIn || !checkOut) return 0;
    const nights = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));
    return nights * (listing?.price || 0);
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error('Please login to book');
      navigate('/login');
      return;
    }

    if (user.role !== 'user') {
      toast.error('Only users can book stays');
      return;
    }

    if (!checkIn || !checkOut) {
      toast.error('Please select check-in and check-out dates');
      return;
    }

    if (checkIn >= checkOut) {
      toast.error('Check-out date must be after check-in date');
      return;
    }

    setIsBooking(true);

    try {
      await api.post(`/users/bookStay/${id}`, {
        checkIn: checkIn.toISOString(),
        checkOut: checkOut.toISOString(),
        guests,
      });

      toast.success('Booking successful!');
      setCheckIn(null);
      setCheckOut(null);
      setGuests(1);
      fetchBookedDates(); // Refresh booked dates
    }  catch (error: unknown) {
    if (error instanceof Error) {
      console.error(error.message);
    } else {
      console.error(String(error));
    }
    throw error;
  }finally {
      setIsBooking(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!listing) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Listing not found</h2>
          <p className="text-gray-600">The listing you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  const nights = checkIn && checkOut ? Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24)) : 0;
  const totalPrice = calculateTotalPrice();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{listing.title}</h1>
            <div className="flex items-center text-gray-600">
              <MapPinIcon className="h-5 w-5 mr-1" />
              <span>{listing.location.address}, {listing.location.city}, {listing.location.country}</span>
            </div>
          </div>
          
          {user?.role === 'user' && (
            <button
              onClick={handleWishlistToggle}
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
            >
              {isInWishlist ? (
                <HeartSolidIcon className="h-5 w-5 text-red-500" />
              ) : (
                <HeartIcon className="h-5 w-5 text-gray-600" />
              )}
              <span>{isInWishlist ? 'Saved' : 'Save'}</span>
            </button>
          )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Images and Details */}
          <div className="lg:col-span-2">
            {/* Main Image */}
            <div className="mb-6">
              <img
                src={listing.thumbnail}
                alt={listing.title}
                className="w-full h-96 object-cover rounded-lg"
              />
            </div>

            {/* Support Images */}
            {listing.supportImage && listing.supportImage.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-6">
                {listing.supportImage.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`${listing.title} ${index + 1}`}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                ))}
              </div>
            )}

            {/* Property Details */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900">Property Details</h2>
                <span className="inline-block bg-primary-100 text-primary-800 text-sm px-3 py-1 rounded-full capitalize">
                  {listing.type}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4">
                <div className="flex items-center">
                  <UserGroupIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">{listing.guest} guests</span>
                </div>
                <div className="flex items-center">
                  <CurrencyDollarIcon className="h-5 w-5 text-gray-400 mr-2" />
                  <span className="text-gray-600">${listing.price} per night</span>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-gray-600 leading-relaxed">{listing.description}</p>
              </div>

              {/* <div className="flex items-center col-span-2">
                  <span className="font-medium text-gray-900">Host ID:</span>
                  <span className="ml-2 text-gray-600">{listing.host._id}</span>
              </div>
              <div className="flex items-center col-span-2">
                  <span className="font-medium text-gray-900">Host name:</span>
                  <span className="ml-2 text-gray-600">{listing.host.fullname}</span>
              </div> */}
              <div className="border-t border-gray-200 mt-6 pt-6">
                <div className="flex flex-col space-y-2">
                  <div className="flex items-center">
                      <span className="font-medium text-gray-900">Host ID:</span>
                      <span className="ml-2 text-gray-600">{listing.host._id}</span>
                  </div>
                  <div className="flex items-center">
                      <span className="font-medium text-gray-900">Host name:</span>
                      <span className="ml-2 text-gray-600">{listing.host.fullname}</span>
                  </div>
                </div>
              </div>
              
            </div>
          </div>

          {/* Booking Card */}
          {user?.role === 'user' && (
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg shadow-lg p-6 sticky top-24">
                <div className="flex items-center justify-between mb-6">
                  <span className="text-2xl font-bold text-gray-900">
                    ${listing.price}
                  </span>
                  <span className="text-gray-600">per night</span>
                </div>

                <div className="space-y-4">
                  {/* Check-in Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-in
                    </label>
                    <DatePicker
                      selected={checkIn}
                      onChange={(date) => setCheckIn(date)}
                      selectsStart
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={new Date()}
                      excludeDates={bookedDates.flatMap(booking => {
                        const dates = [];
                        const start = new Date(booking.checkIn);
                        const end = new Date(booking.checkOut);
                        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                          dates.push(new Date(d));
                        }
                        return dates;
                      })}
                      placeholderText="Select check-in date"
                      className="w-full"
                    />
                  </div>

                  {/* Check-out Date */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Check-out
                    </label>
                    <DatePicker
                      selected={checkOut}
                      onChange={(date) => setCheckOut(date)}
                      selectsEnd
                      startDate={checkIn}
                      endDate={checkOut}
                      minDate={checkIn || new Date()}
                      excludeDates={bookedDates.flatMap(booking => {
                        const dates = [];
                        const start = new Date(booking.checkIn);
                        const end = new Date(booking.checkOut);
                        for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
                          dates.push(new Date(d));
                        }
                        return dates;
                      })}
                      placeholderText="Select check-out date"
                      className="w-full"
                    />
                  </div>

                  {/* Guests */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Guests
                    </label>
                    <select
                      value={guests}
                      onChange={(e) => setGuests(Number(e.target.value))}
                      className="input-field"
                    >
                      {Array.from({ length: listing.guest }, (_, i) => i + 1).map(num => (
                        <option key={num} value={num}>
                          {num} guest{num > 1 ? 's' : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Price Breakdown */}
                {checkIn && checkOut && (
                  <div className="border-t border-gray-200 mt-6 pt-4">
                    <div className="flex justify-between text-sm text-gray-600 mb-2">
                      <span>${listing.price} × {nights} nights</span>
                      <span>${listing.price * nights}</span>
                    </div>
                    <div className="flex justify-between font-semibold text-gray-900 text-lg">
                      <span>Total</span>
                      <span>${totalPrice}</span>
                    </div>
                  </div>
                )}

                <button
                  onClick={handleBooking}
                  disabled={!checkIn || !checkOut || isBooking}
                  className="btn-primary w-full mt-6 flex justify-center items-center"
                >
                  {isBooking ? (
                    <>
                      <LoadingSpinner size="sm" className="mr-2" />
                      Booking...
                    </>
                  ) : (
                    'Book Now'
                  )}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;