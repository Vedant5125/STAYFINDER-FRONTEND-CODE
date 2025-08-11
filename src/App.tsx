import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './context/AuthContext';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Common/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ListingDetail from './pages/ListingDetail';
import Wishlist from './pages/Wishlist';
import HostListings from './pages/Host/HostListings';
import AddListing from './pages/Host/AddListing';
import BookingsPage from './pages/BookingPage'; 

function App() {
  return (
    <AuthProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listing/:id" element={<ListingDetail />} />
            <Route path="/bookings" element={<BookingsPage />} />
            {/* Protected Routes for Users */}
            <Route
              path="/wishlist"
              element={
                <ProtectedRoute requiredRole="user">
                  
                  <Wishlist />
                </ProtectedRoute>
              }
            />
            
            {/* Protected Routes for Hosts */}
            <Route
              path="/host/listings"
              element={
                <ProtectedRoute requiredRole="host">
                  <HostListings />
                </ProtectedRoute>
              }
            />
            <Route
              path="/host/add-listing"
              element={
                <ProtectedRoute requiredRole="host">
                  <AddListing />
                </ProtectedRoute>
              }
            />
          </Routes>
        </Layout>
        
        <Toaster
          position="top-right"
          toastOptions={{
            duration: 4000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
      </Router>
    </AuthProvider>
  );
}

export default App;