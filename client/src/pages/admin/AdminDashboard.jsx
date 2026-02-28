import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from "../../context/AuthContext"; 
import { toast } from 'react-toastify';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const [data, setData] = useState({
    stocks: [],
    transactions: [],
    users: [],
    activeUsers: 0,
    serverStatus: 'Operational',
    latency: '24ms'
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminData = async () => {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        // Fetch centralized telemetry data
        const { data: telemetry } = await axios.get('http://localhost:8000/api/admin/telemetry', config);
        setData(telemetry);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load admin telemetry.");
        setLoading(false);
      }
    };
    if (user && user.isAdmin) fetchAdminData();
  }, [user]);

  if (loading) return <div className="p-8 text-center text-white">Accessing Command Center...</div>;

  return (
    <div className="flex bg-background-dark text-slate-100 font-display min-h-screen">
      <main className="flex-1 p-8 space-y-6 overflow-y-auto">
        {/* Health Stats Row */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <HealthCard title="API Latency" value={data.latency} icon="speed" color="emerald" />
          <HealthCard title="Server Status" value={data.serverStatus} icon="dns" color="primary" />
          <HealthCard title="Active Users" value={data.activeUsers} icon="group" color="amber" />
          <HealthCard title="System Load" value="0.02%" icon="error" color="rose" />
        </section>

        <div className="grid grid-cols-12 gap-6">
          {/* Stock Management */}
          <div className="col-span-12 lg:col-span-8 p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">Stock Inventory</h3>
            <table className="w-full text-sm">
              <thead className="text-slate-400 border-b border-slate-800 text-left">
                <tr><th>Ticker</th><th>Exchange</th><th>Price</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {data.stocks.map((s, i) => (
                  <tr key={i} className="border-b border-slate-800/50">
                    <td className="py-3 font-bold">{s.symbol}</td>
                    <td>{s.stockExchange}</td>
                    <td className="font-mono">₹{s.price}</td>
                    <td className="text-primary text-xs cursor-pointer">Edit</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* User Directory */}
          <div className="col-span-12 lg:col-span-4 p-6 bg-slate-900 border border-slate-800 rounded-xl">
            <h3 className="font-bold mb-4 flex items-center gap-2">User Directory</h3>
            <div className="space-y-3 overflow-y-auto max-h-[300px]">
              {data.users.map((u, i) => (
                <div key={i} className="p-3 bg-slate-800/40 rounded-lg flex justify-between items-center">
                  <div>
                    <p className="text-xs font-bold">{u.username}</p>
                    <p className="text-[10px] text-slate-500">{u.email}</p>
                  </div>
                  <p className="text-xs font-black text-emerald-500">₹{u.balance?.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction Ledger */}
          <div className="col-span-12 p-6 bg-slate-900 border border-slate-200/5 rounded-xl shadow-xl">
            <h3 className="font-bold mb-4">Global Transaction Ledger</h3>
            <div className="space-y-2">
              {data.transactions.map((t, i) => (
                <div key={i} className="flex justify-between p-3 bg-slate-800/20 rounded-lg text-xs border border-white/5">
                  <span className="font-bold uppercase text-primary">{t.orderType}</span>
                  <span>{t.symbol} x {t.count}</span>
                  <span className="font-black">₹{t.totalPrice?.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

const HealthCard = ({ title, value, icon, color }) => (
  <div className="p-4 bg-slate-900 border border-slate-800 rounded-xl flex items-center gap-4">
    <div className={`size-12 rounded-lg bg-${color}-500/10 text-${color}-500 flex items-center justify-center`}>
      <span className="material-symbols-outlined">{icon}</span>
    </div>
    <div>
      <p className="text-xs text-slate-400">{title}</p>
      <p className="text-xl font-bold">{value}</p>
    </div>
  </div>
);

export default AdminDashboard;