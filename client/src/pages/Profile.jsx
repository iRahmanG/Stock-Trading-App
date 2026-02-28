import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Profile = () => {
  const { user, setUser, logout, loading: authLoading } = useContext(AuthContext); // Added setUser
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [portfolioValue, setPortfolioValue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [depositLoading, setDepositLoading] = useState(false); // Track deposit state

  // 1. PROTECTED ROUTE LOGIC
  useEffect(() => {
    if (!authLoading && !user) {
      toast.info("Please log in to view your profile.");
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // 2. Fetch Profile and Financial Data
  useEffect(() => {
    const fetchProfileData = async () => {
      if (!user) return;
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        const { data: orderData } = await axios.get('http://localhost:8000/api/orders', config);
        const sortedOrders = orderData.sort((a, b) => (a._id < b._id ? 1 : -1));
        setOrders(sortedOrders);

        const holdings = orderData.reduce((acc, order) => {
          const qty = order.orderType === 'buy' ? order.count : -order.count;
          acc[order.symbol] = (acc[order.symbol] || 0) + qty;
          return acc;
        }, {});

        let currentMarketValueINR = 0;
        const conversionRate = 83.0; 

        for (const symbol in holdings) {
          if (holdings[symbol] > 0) {
            try {
              const { data: liveStock } = await axios.get(`http://localhost:8000/api/market/${symbol}`);
              const priceInINR = (liveStock.stockExchange === 'NSE' || liveStock.stockExchange === 'BSE') 
                  ? liveStock.price 
                  : liveStock.price * conversionRate;
              
              currentMarketValueINR += holdings[symbol] * priceInINR;
            } catch (err) {
              console.error(`Could not update live price for ${symbol}`);
            }
          }
        }

        setPortfolioValue(currentMarketValueINR);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchProfileData();
  }, [user]);

  // 3. Handlers
  const handleSignOut = () => {
    logout();
    toast.success("Signed out successfully!");
    navigate('/');
  };

  const handleDeposit = async (amount) => {
    setDepositLoading(true);
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      const { data } = await axios.post('http://localhost:8000/api/users/deposit', { amount }, config);
      
      // Update local context/state with new balance
      setUser({ ...user, balance: data.newBalance });
      toast.success(`Successfully added ₹${amount.toLocaleString()} to your wallet!`);
    } catch (err) {
      toast.error(err.response?.data?.message || "Deposit failed. Try again later.");
    } finally {
      setDepositLoading(false);
    }
  };

  if (authLoading || (!user && loading)) {
    return <div className="p-12 text-center font-bold animate-pulse">Verifying Session...</div>;
  }

  if (!user) return null;

  const netWorth = (user?.balance || 0) + portfolioValue;
  const initials = user.username ? user.username.charAt(0).toUpperCase() : '?';

  return (
    <main className="flex-grow w-full max-w-[1200px] mx-auto px-4 md:px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-white tracking-tight mb-8">My Financial Overview</h1>

      {/* Financial Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <div className="bg-gradient-to-br from-primary to-blue-700 rounded-xl p-6 text-white shadow-lg border border-blue-400/20">
          <p className="text-blue-100 text-xs font-bold uppercase tracking-wider mb-1">Total Net Worth</p>
          <h3 className="text-3xl font-black">₹{netWorth.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
          <p className="text-blue-200 text-[10px] mt-2 flex items-center gap-1">
            <span className="material-symbols-outlined text-[14px]">bolt</span> Live Market Valuation
          </p>
        </div>

        <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Available Cash</p>
          <h3 className="text-2xl font-bold text-slate-900 dark:text-white">₹{user.balance?.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
        </div>

        <div className="bg-white dark:bg-[#1a202c] rounded-xl p-6 border border-slate-200 dark:border-slate-800 shadow-sm">
          <p className="text-slate-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Holdings Value</p>
          <h3 className="text-2xl font-bold text-emerald-600">₹{portfolioValue.toLocaleString('en-IN', {minimumFractionDigits: 2})}</h3>
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Left Column: User Profile & Wallet Recharge */}
        <aside className="w-full md:w-1/3 flex flex-col gap-6">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 flex flex-col items-center text-center">
            <div className="h-20 w-20 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-primary font-bold text-3xl mb-4 border-2 border-primary/20">
              {initials}
            </div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">{user.username}</h2>
            <p className="text-slate-500 dark:text-slate-400 text-sm mb-6">{user.email}</p>
            
            <button onClick={handleSignOut} className="w-full py-2.5 rounded-lg border border-rose-200 text-rose-600 hover:bg-rose-50 dark:border-rose-900/50 dark:hover:bg-rose-900/20 font-bold text-sm transition-colors flex items-center justify-center gap-2">
              <span className="material-symbols-outlined text-[18px]">logout</span> Sign Out
            </button>
          </div>

          {/* New Wallet Recharge Module */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6">
            <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-primary text-[20px]">account_balance_wallet</span>
              Add Funds to Wallet
            </h4>
            <div className="grid grid-cols-2 gap-2 mb-4">
              {[1000, 5000, 10000, 50000].map((amt) => (
                <button
                  key={amt}
                  disabled={depositLoading}
                  onClick={() => handleDeposit(amt)}
                  className="py-2 text-[11px] font-black rounded-lg border border-slate-100 dark:border-slate-800 hover:bg-primary hover:text-white dark:hover:bg-primary transition-all disabled:opacity-50"
                >
                  + ₹{amt.toLocaleString()}
                </button>
              ))}
            </div>
            <button 
              onClick={() => {
                const amt = prompt("Enter custom amount (₹):");
                if(amt && !isNaN(amt)) handleDeposit(Number(amt));
              }}
              className="w-full py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-lg text-xs font-bold hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            >
              Custom Amount
            </button>
          </div>
        </aside>

        {/* Right Column: Transaction History */}
        <section className="w-full md:w-2/3">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800">
              <h3 className="font-bold text-lg text-slate-900 dark:text-white flex items-center gap-2">
                <span className="material-symbols-outlined text-primary">history</span> Transaction Ledger
              </h3>
            </div>
            
            <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
              {orders.length === 0 ? (
                <div className="p-12 text-center text-slate-500 italic">No transactions found.</div>
              ) : (
                orders.map((order, index) => (
                  <div key={index} className="p-4 flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-bold ${order.orderType === 'buy' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/20' : 'bg-rose-100 text-rose-600 dark:bg-rose-900/20'}`}>
                        <span className="material-symbols-outlined text-[20px]">
                          {order.symbol === 'DEPOSIT' ? 'payments' : (order.orderType === 'buy' ? 'add_shopping_cart' : 'sell')}
                        </span>
                      </div>
                      <div>
                        <p className="font-bold text-slate-900 dark:text-white uppercase text-sm tracking-wide">
                          {order.symbol === 'DEPOSIT' ? 'Wallet Top-up' : `${order.orderType} ${order.symbol}`}
                        </p>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {order.symbol === 'DEPOSIT' ? 'Direct Credit' : `${order.count} shares • ₹${order.price.toLocaleString('en-IN')}`}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className={`font-bold text-sm ${order.orderType === 'buy' && order.symbol !== 'DEPOSIT' ? 'text-slate-900 dark:text-white' : 'text-emerald-600'}`}>
                        {order.orderType === 'buy' && order.symbol !== 'DEPOSIT' ? '-' : '+'}₹{order.totalPrice.toLocaleString('en-IN', {minimumFractionDigits: 2})}
                      </p>
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Settled</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
};

export default Profile;