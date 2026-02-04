
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { User } from '../types';

interface NavbarProps {
  user: User | null;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, onLogout }) => {
  const location = useLocation();

  return (
    <nav className="bg-white border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold">SE</span>
              </div>
              <span className="text-xl font-bold tracking-tight text-slate-900">Sydney Hub</span>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link 
              to="/" 
              className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
            >
              Public Feed
            </Link>
            {user ? (
              <>
                <Link 
                  to="/dashboard" 
                  className={`px-3 py-2 rounded-md text-sm font-medium ${location.pathname === '/dashboard' ? 'text-indigo-600' : 'text-slate-600 hover:text-slate-900'}`}
                >
                  Dashboard
                </Link>
                <div className="flex items-center space-x-3 ml-4 pl-4 border-l border-slate-200">
                  <img src={user.picture} alt={user.name} className="w-8 h-8 rounded-full border border-slate-200" />
                  <button 
                    onClick={onLogout}
                    className="text-sm font-medium text-slate-600 hover:text-red-600"
                  >
                    Logout
                  </button>
                </div>
              </>
            ) : (
              <Link 
                to="/login" 
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition"
              >
                Admin Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
