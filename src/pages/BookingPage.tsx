import React, { useEffect, useState } from 'react';
import api from '../utils/api';
import toast from 'react-hot-toast';

interface Listing {
  _id: string;
  title: string;
  location: {
    city: string;
    country: string;
    address: string;
  };
  thumbnail: string;
}

interface Booking {
  _id: string;
  listing: Listing;
  checkIn: Date;
  checkOut: Date;
  totalPrice: number;
}

const BookingsPage = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get('/users/bookings'); // Make sure this path is correct
        setBookings(response.data.data);
      } catch (err) {
        console.error("Failed to fetch bookings:", err);
        setError("Failed to load your bookings. Please try again later.");
        toast.error("Failed to load bookings.");
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <h2 className="text-xl font-semibold">Loading bookings...</h2>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen text-red-500">
        <h2 className="text-xl font-semibold">{error}</h2>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 md:p-8">
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-6">My Bookings</h1>

      {bookings.length === 0 ? (
        <div className="text-center p-10 bg-gray-100 rounded-lg shadow-inner">
          <p className="text-gray-600 text-lg">You don't have any current bookings.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            // Add a check to ensure booking.listing exists before rendering
            booking.listing && (
              <div key={booking._id} className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden">
                <img src={booking.listing.thumbnail} alt={booking.listing.title} className="w-full h-48 object-cover"/>
                <div className="p-4">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">{booking.listing.title}</h2>
                  <p className="text-sm text-gray-500 mb-2">{booking.listing.location.city}, {booking.listing.location.country}</p>
                  <div className="flex justify-between items-center text-gray-700 mt-4">
                    <div>
                      <p className="text-sm">Check-in: <span className="font-medium">{new Date(booking.checkIn).toLocaleDateString()}</span></p>
                      <p className="text-sm">Check-out: <span className="font-medium">{new Date(booking.checkOut).toLocaleDateString()}</span></p>
                    </div>
                    <p className="text-lg font-bold text-green-600">${booking.totalPrice}</p>
                  </div>
                </div>
              </div>
            )
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingsPage;