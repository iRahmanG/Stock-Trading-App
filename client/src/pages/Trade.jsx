import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const Trade = () => {
  // This grabs the stock symbol from the URL (e.g., /trade/AAPL)
  const { symbol } = useParams();
  const displaySymbol = symbol ? symbol.toUpperCase() : 'AAPL';
  
  const [orderType, setOrderType] = useState('buy'); // 'buy' or 'sell'
  const [quantity, setQuantity] = useState(1);
  const currentPrice = 182.10; // Placeholder price

  return (
    <main className="flex-grow py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
      {/* Back Navigation & Header */}
      <div className="mb-6">
        <Link to="/dashboard" className="text-primary hover:text-blue-700 text-sm font-bold flex items-center gap-1 w-fit mb-4 transition-colors">
          <span className="material-symbols-outlined text-[18px]">arrow_back</span>
          Back to Dashboard
        </Link>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">{displaySymbol}</h1>
              <span className="px-2 py-0.5 rounded text-xs font-bold bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400 uppercase tracking-wide">NASDAQ</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium text-lg">Apple Inc.</p>
          </div>
          <div className="text-left md:text-right">
            <h2 className="text-3xl font-bold text-slate-900 dark:text-white">${currentPrice.toFixed(2)}</h2>
            <p className="text-emerald-600 font-bold flex items-center md:justify-end gap-1 mt-1">
              <span className="material-symbols-outlined text-[18px]">trending_up</span>
              +$2.15 (1.2%) Today
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Chart & Stats (2/3) */}
        <section className="w-full lg:w-2/3 flex flex-col gap-6">
          
          {/* Chart Area */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5 h-[400px] flex flex-col relative overflow-hidden">
            <div className="flex items-center justify-between mb-4 z-10">
              <h3 className="font-bold text-slate-900 dark:text-white">Price History</h3>
              <div className="flex gap-2">
                {['1D', '1W', '1M', '1Y', 'ALL'].map((time) => (
                  <button key={time} className={`text-xs font-bold px-3 py-1.5 rounded-md transition-colors ${time === '1D' ? 'bg-primary text-white' : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                    {time}
                  </button>
                ))}
              </div>
            </div>
            {/* Placeholder for real chart */}
            <div className="flex-grow flex items-center justify-center bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-100 dark:border-slate-700/50">
              <p className="text-slate-400 font-medium flex items-center gap-2">
                <span className="material-symbols-outlined">monitoring</span>
                Interactive Chart will load here
              </p>
            </div>
          </div>

          {/* Key Statistics */}
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-5">
            <h3 className="font-bold text-slate-900 dark:text-white mb-4">Key Statistics</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-6">
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Open</p>
                <p className="font-bold text-slate-900 dark:text-white">₹179.95</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">High</p>
                <p className="font-bold text-slate-900 dark:text-white">₹182.50</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Low</p>
                <p className="font-bold text-slate-900 dark:text-white">₹179.10</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium mb-1">Volume</p>
                <p className="font-bold text-slate-900 dark:text-white">45.2M</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right Column: Order Entry (1/3) */}
        <aside className="w-full lg:w-1/3">
          <div className="bg-white dark:bg-[#1a202c] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm p-6 sticky top-24">
            <h3 className="font-bold text-xl text-slate-900 dark:text-white mb-6">Place Order</h3>
            
            {/* Buy / Sell Toggle */}
            <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg mb-6">
              <button 
                onClick={() => setOrderType('buy')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${orderType === 'buy' ? 'bg-white dark:bg-slate-700 text-emerald-600 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Buy
              </button>
              <button 
                onClick={() => setOrderType('sell')}
                className={`flex-1 py-2 text-sm font-bold rounded-md transition-all ${orderType === 'sell' ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'}`}
              >
                Sell
              </button>
            </div>

            {/* Order Form */}
            <div className="flex flex-col gap-5">
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Order Type</label>
                <select className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-primary">
                  <option>Market Order</option>
                  <option>Limit Order</option>
                </select>
              </div>
              
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2 block">Quantity (Shares)</label>
                <input 
                  type="number" 
                  min="1"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  className="w-full bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-lg px-4 py-3 text-sm font-bold text-slate-900 dark:text-white focus:outline-none focus:border-primary"
                />
              </div>

              <div className="pt-4 border-t border-slate-100 dark:border-slate-800 mt-2">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-slate-500">Estimated Cost</span>
                  <span className="text-lg font-bold text-slate-900 dark:text-white">
  ₹{(currentPrice * quantity).toLocaleString('en-IN', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium text-slate-500">Buying Power</span>
                  <span className="text-sm font-bold text-slate-900 dark:text-white">₹45,000.00</span>
                </div>
              </div>

              <button className={`w-full py-4 rounded-xl text-white font-bold text-lg shadow-md transition-all mt-4 ${orderType === 'buy' ? 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' : 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20'}`}>
                {orderType === 'buy' ? 'Buy' : 'Sell'} {displaySymbol}
              </button>
            </div>
          </div>
        </aside>
      </div>
    </main>
  );
};

export default Trade;