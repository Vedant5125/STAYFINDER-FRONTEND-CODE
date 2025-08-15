import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/useAuth.tsx';
import { 
  HomeIcon, 
  HeartIcon, 
  UserIcon, 
  Bars3Icon, 
  XMarkIcon,
  PlusIcon,
  BuildingOfficeIcon
} from '@heroicons/react/24/outline';

const Header: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isImageError, setIsImageError] = useState(false); // New state variable

  useEffect(() => {
    setIsImageError(false);
  }, [user]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
    setIsMenuOpen(false);
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <BuildingOfficeIcon className="h-8 w-8 text-primary-600" />
            <span className="text-xl font-bold text-gray-900">StayFinder</span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/" 
              className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
            >
              <HomeIcon className="h-5 w-5" />
              <span>Home</span>
            </Link>

            {user ? (
              <>
                {user.role === 'user' && (
                  <Link 
                    to="/wishlist" 
                    className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    <HeartIcon className="h-5 w-5" />
                    <span>Wishlist</span>
                  </Link>
                )}

                {user.role === 'host' && (
                  <>
                    <Link 
                      to="/host/listings" 
                      className="flex items-center space-x-1 text-gray-700 hover:text-primary-600 transition-colors"
                    >
                      <BuildingOfficeIcon className="h-5 w-5" />
                      <span>My Listings</span>
                    </Link>
                    <Link 
                      to="/host/add-listing" 
                      className="flex items-center space-x-1 bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                    >
                      <PlusIcon className="h-5 w-5" />
                      <span>Add Listing</span>
                    </Link>
                  </>
                )}

                <div className="flex items-center space-x-4">
                  <Link to="/profile" className="flex items-center space-x-2">
                    {(user.profile && !isImageError ) ? (
                      <img 
                        src={user.profile} 
                        alt={user.fullname}
                        className="h-8 w-8 rounded-full object-cover"
                        onError={() => setIsImageError(true)} // Set state to true on image load error
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 rounded-full text-gray-500 bg-gray-200 p-1" />
                    )}
                    <span className="text-gray-700">{user.fullname}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <div className="flex items-center space-x-4">
                <Link 
                  to="/login" 
                  className="text-gray-700 hover:text-primary-600 transition-colors"
                >
                  Login
                </Link>
                <Link 
                  to="/register" 
                  className="bg-primary-600 text-white px-4 py-2 rounded-lg hover:bg-primary-700 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={toggleMenu}
            className="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            {isMenuOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-gray-100">
            <div className="flex flex-col space-y-4">
              <Link 
                to="/" 
                className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                <HomeIcon className="h-5 w-5" />
                <span>Home</span>
              </Link>

              {user ? (
                <>
                  {user.role === 'user' && (
                    <Link 
                      to="/wishlist" 
                      className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <HeartIcon className="h-5 w-5" />
                      <span>Wishlist</span>
                    </Link>
                  )}

                  {user.role === 'host' && (
                    <>
                      <Link 
                        to="/host/listings" 
                        className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <BuildingOfficeIcon className="h-5 w-5" />
                        <span>My Listings</span>
                      </Link>
                      <Link 
                        to="/host/add-listing" 
                        className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors"
                        onClick={() => setIsMenuOpen(false)}
                      >
                        <PlusIcon className="h-5 w-5" />
                        <span>Add Listing</span>
                      </Link>
                    </>
                  )}
                   <Link to="/profile" className="flex items-center space-x-2">
                    {user.profile ? (
                      <img
                        src={user.profile}
                        alt={user.fullname}
                        className="h-8 w-8 rounded-full object-cover"
                      />
                    ) : (
                      <UserIcon className="h-8 w-8 rounded-full text-gray-400 bg-gray-100 p-1" />
                    )}
                    <span className="text-gray-700">{user.fullname}</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-700 hover:text-primary-600 transition-colors text-left"
                  >
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link 
                    to="/login" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link 
                    to="/register" 
                    className="text-gray-700 hover:text-primary-600 transition-colors"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;