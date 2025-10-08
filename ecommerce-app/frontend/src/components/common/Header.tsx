import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { useCart } from '../../contexts/CartContext';

const Header: React.FC = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { state: cartState } = useCart();

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4 py-4">
        <div className="flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-gray-800">
            ECommerce
          </Link>

          <nav className="flex items-center space-x-6">
            <Link to="/" className="text-gray-600 hover:text-gray-900">
              Products
            </Link>

            <Link to="/cart" className="text-gray-600 hover:text-gray-900 relative">
              Cart
              {cartState.itemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center">
                  {cartState.itemCount}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="flex items-center space-x-4">
                <span className="text-gray-700">Hello, {user?.full_name}</span>
                <button
                  onClick={logout}
                  className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                  Logout
                </button>
              </div>
            ) : (
              <div className="flex items-center space-x-4">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-gray-900"
                >
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Sign Up
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
};

export default Header;