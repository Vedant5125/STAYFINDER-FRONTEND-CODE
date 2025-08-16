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
import UpdateProfilePage from './pages/UpdateProfilePage';
import EditListingPage from './pages/EditListingPage';
import About from './pages/About';
import Contact from './pages/Contact';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';

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
            <Route path="/profile" element={<UpdateProfilePage />} />
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
              path="/host/edit-listing/:id"
              element={
                <ProtectedRoute requiredRole="host">
                  <EditListingPage />
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
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/help" element={<Help />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/terms" element={<Terms />} />
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