import React, { useContext } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  
  if (location.pathname === '/') return null;


  const initials = user?.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex items-center gap-8">
            <Link to="/dashboard" className="flex items-center gap-2 text-primary dark:text-blue-400">
              <span className="material-symbols-outlined text-3xl">show_chart</span>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight">Trading App</h2>
            </Link>
            
            <nav className="hidden md:flex gap-6">
              <Link to="/dashboard" className={`font-bold text-sm transition-colors ${location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Dashboard</Link>
              <Link to="/portfolio" className={`font-bold text-sm transition-colors ${location.pathname === '/portfolio' ? 'text-primary' : 'text-slate-600 dark:text-slate-400 hover:text-primary'}`}>Portfolio</Link>
            </nav>
          </div>
          
          <div className="flex items-center gap-4">
            {/* Display User's Virtual Balance */}
            {user && (
              <div className="hidden sm:flex flex-col text-right mr-4">
                <span className="text-xs text-slate-500 font-bold uppercase tracking-wider">Buying Power</span>
                <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
                  ₹{user.balance?.toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
                </span>
              </div>
            )}

            <button onClick={logout} title="Logout" className="text-slate-500 hover:text-rose-500 dark:text-slate-400 p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
              <span className="material-symbols-outlined">logout</span>
            </button>
            
            <div className="h-9 w-9 rounded-full bg-gradient-to-tr from-primary to-blue-400 flex items-center justify-center text-white font-bold text-sm shadow-sm ring-2 ring-white dark:ring-slate-800 cursor-pointer" title={user?.username}>
              {initials}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;