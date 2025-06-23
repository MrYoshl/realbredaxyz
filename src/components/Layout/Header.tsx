import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { label: 'Home', path: '/' },
    { label: 'Squad', path: '/squad' },
    { label: 'Stats', path: '/stats' },
  ];

  const isActivePath = (path: string) => {
    return location.pathname === path;
  };

  return (
    <header className="bg-black/95 backdrop-blur-sm border-b border-yellow-400/20 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-8 h-8 rounded-full overflow-hidden group-hover:scale-110 transition-transform duration-200">
              <img 
                src="/Resources/Badge.png" 
                alt="Real Breda CF" 
                className="w-full h-full object-cover"
              />
            </div>
            <span className="text-xl font-bold text-white group-hover:text-yellow-400 transition-colors duration-200">
              Real Breda CF
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`text-sm font-medium transition-colors duration-200 relative ${
                  isActivePath(item.path)
                    ? 'text-yellow-400'
                    : 'text-gray-300 hover:text-yellow-400'
                }`}
              >
                {item.label}
                {isActivePath(item.path) && (
                  <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-yellow-400 rounded-full" />
                )}
              </Link>
            ))}
            
            {user ? (
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-300 flex items-center space-x-2">
                  <User className="w-4 h-4" />
                  <span>{user.username}</span>
                  {user.role === 'admin' && (
                    <Shield className="w-4 h-4 text-yellow-400" />
                  )}
                </span>
                <button
                  onClick={logout}
                  className="flex items-center space-x-2 text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              </div>
            ) : (
              <Link
                to="/auth"
                className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors duration-200"
              >
                Sign In
              </Link>
            )}
          </nav>

          {/* Mobile menu button */}
          <button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="md:hidden text-gray-300 hover:text-yellow-400 transition-colors duration-200"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t border-yellow-400/20">
            <nav className="flex flex-col space-y-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  className={`text-sm font-medium transition-colors duration-200 ${
                    isActivePath(item.path)
                      ? 'text-yellow-400'
                      : 'text-gray-300 hover:text-yellow-400'
                  }`}
                >
                  {item.label}
                </Link>
              ))}
              
              {user ? (
                <div className="pt-4 border-t border-yellow-400/20">
                  <div className="flex items-center space-x-2 text-sm text-gray-300 mb-4">
                    <User className="w-4 h-4" />
                    <span>{user.username}</span>
                    {user.role === 'admin' && (
                      <Shield className="w-4 h-4 text-yellow-400" />
                    )}
                  </div>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="flex items-center space-x-2 text-sm text-gray-300 hover:text-yellow-400 transition-colors duration-200"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </button>
                </div>
              ) : (
                <Link
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                  className="bg-yellow-400 text-black px-4 py-2 rounded-lg font-medium hover:bg-yellow-300 transition-colors duration-200 text-center"
                >
                  Sign In
                </Link>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}