import React, { createContext, useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-toastify';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      setUser(JSON.parse(userInfo));
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await axios.post('http://localhost:8000/api/users/login', { email, password });
      
      setUser(data);
      localStorage.setItem('userInfo', JSON.stringify(data));
      
      if (data.isAdmin) {
        toast.success(`Admin Authorization Granted. Welcome, ${data.username}!`);
      } else {
        toast.success(`Welcome back, ${data.username || 'User'}!`);
      }
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid credentials.");
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('userInfo');
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};