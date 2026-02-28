import React, { useContext, useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';
import axios from 'axios';

const Navbar = () => {
  const location = useLocation();
  const { user, logout } = useContext(AuthContext);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // 1. Fetch Live Notifications from Backend
  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.get('http://localhost:8000/api/notifications', config);
      setNotifications(data);
    } catch (err) {
      console.error("Could not fetch notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, [user]);

  // 2. Theme Persistence Logic
  useEffect(() => {
    if (localStorage.theme === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
      setIsDarkMode(true);
    } else {
      document.documentElement.classList.remove('dark');
      setIsDarkMode(false);
    }
  }, []);

  const toggleTheme = () => {
    const root = document.documentElement;
    if (isDarkMode) {
      root.classList.remove('dark');
      localStorage.theme = 'light';
      setIsDarkMode(false);
    } else {
      root.classList.add('dark');
      localStorage.theme = 'dark';
      setIsDarkMode(true);
    }
  };

  const handleLogout = () => {
    logout();
    toast.success("Session ended safely.");
  };

  const markAllRead = async () => {
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      await axios.put('http://localhost:8000/api/notifications/read-all', {}, config);
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to update notifications");
    }
  };
  
  if (location.pathname === '/') return null;

  const unreadCount = notifications.filter(n => !n.read).length;
  const initials = user?.username ? user.username.charAt(0).toUpperCase() : 'A';

  return (
    <header className="bg-white dark:bg-[#1a202c] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-50 transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          
          <div className="flex items-center gap-8">
            <Link to={user?.isAdmin ? "/admin" : "/dashboard"} className="flex items-center gap-2 text-primary">
              <span className="material-symbols-outlined text-3xl">show_chart</span>
              <h2 className="text-slate-900 dark:text-white text-xl font-bold tracking-tight italic">Trading App</h2>
            </Link>

            <nav className="hidden md:flex gap-6 text-sm font-bold items-center">
              {!user?.isAdmin ? (
                <>
                  <Link to="/dashboard" className={location.pathname === '/dashboard' ? 'text-primary' : 'text-slate-500 hover:text-primary'}>Dashboard</Link>
                  <Link to="/portfolio" className={location.pathname === '/portfolio' ? 'text-primary' : 'text-slate-500 hover:text-primary'}>Portfolio</Link>
                </>
              ) : (
                <Link to="/admin" className={`flex items-center gap-1 font-black px-4 py-2 rounded-lg transition-all ${location.pathname === '/admin' ? 'bg-rose-500 text-white shadow-lg shadow-rose-500/20' : 'bg-rose-500/10 text-rose-500 hover:bg-rose-500/20'}`}>
                  <span className="material-symbols-outlined text-[20px]">admin_panel_settings</span>
                  Command Center
                </Link>
              )}
            </nav>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Notification Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setShowNotifications(!showNotifications)} 
                className="p-2 text-slate-500 hover:text-primary rounded-full transition-colors relative"
              >
                <span className="material-symbols-outlined">notifications</span>
                {unreadCount > 0 && (
                  <span className="absolute top-1.5 right-1.5 size-2 bg-rose-500 rounded-full border-2 border-white dark:border-[#1a202c]"></span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl z-[60] overflow-hidden animate-in fade-in slide-in-from-top-2">
                  <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50 dark:bg-slate-800/50">
                    <h4 className="font-bold text-sm">Alerts & Activity</h4>
                    <span className="text-[10px] font-black bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">New: {unreadCount}</span>
                  </div>
                  
                  <div className="max-h-80 overflow-y-auto">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div 
                          key={n._id} 
                          className={`p-4 border-b border-slate-50 dark:border-slate-800/50 hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors flex gap-3 ${!n.read ? 'bg-primary/5' : ''}`}
                        >
                          {/* Dynamic Icon Mapping */}
                          <div className={`mt-0.5 flex-shrink-0 size-8 rounded-lg flex items-center justify-center 
                            ${n.type === 'BUY' || n.type === 'DEPOSIT' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' : 
                              n.type === 'SELL' ? 'bg-rose-100 text-rose-600 dark:bg-rose-900/20' : 
                              'bg-amber-100 text-amber-600 dark:bg-amber-900/20'}`}>
                            <span className="material-symbols-outlined text-[18px]">
                              {n.type === 'BUY' ? 'add_shopping_cart' : 
                               n.type === 'SELL' ? 'sell' : 
                               n.type === 'DEPOSIT' ? 'payments' : 'notifications'}
                            </span>
                          </div>

                          <div className="flex-1">
                            <p className="text-xs font-medium text-slate-700 dark:text-slate-200 leading-snug">
                              {n.message || "New activity recorded"} {/* Fixed mapping */}
                            </p>
                            <p className="text-[10px] text-slate-400 mt-1 font-bold uppercase tracking-tighter">
                              {n.createdAt ? new Date(n.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Recent'}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="p-12 text-center flex flex-col items-center gap-2">
                         <span className="material-symbols-outlined text-slate-300 text-4xl">notifications_off</span>
                         <p className="text-slate-400 text-xs italic">No activity recorded yet.</p>
                      </div>
                    )}
                  </div>
                  
                  {unreadCount > 0 && (
                    <button 
                      onClick={markAllRead} 
                      className="w-full py-3 text-[10px] font-bold text-primary hover:bg-slate-50 dark:hover:bg-slate-800 border-t border-slate-100 dark:border-slate-800 transition-colors"
                    >
                      MARK ALL AS READ
                    </button>
                  )}
                </div>
              )}
            </div>

            <button onClick={toggleTheme} className="p-2 text-slate-500 hover:text-amber-500 rounded-full transition-colors">
              <span className="material-symbols-outlined">{isDarkMode ? 'light_mode' : 'dark_mode'}</span>
            </button>

            {user && !user.isAdmin && (
              <div className="hidden sm:flex flex-col text-right px-4 border-l border-slate-200 dark:border-slate-800">
                <span className="text-[9px] font-black text-slate-400 uppercase">Balance</span>
                <span className="text-xs font-bold text-emerald-600 tracking-tight">₹{user.balance?.toLocaleString('en-IN')}</span>
              </div>
            )}

            <button onClick={handleLogout} className="p-2 text-slate-500 hover:text-rose-500 rounded-full transition-colors">
              <span className="material-symbols-outlined">logout</span>
            </button>
            
            <Link to="/profile" className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white font-bold text-xs hover:ring-2 hover:ring-primary/50 transition-all shadow-sm">
              {initials}
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
};

export default Navbar;