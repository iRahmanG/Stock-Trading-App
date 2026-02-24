import React, { createContext, useState, useEffect } from 'react';

// Create the Context
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // When the app loads, check if the user is already logged in (saved in localStorage)
  useEffect(() => {
    const storedUser = localStorage.getItem('userInfo');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // Logout function to clear data
  const logout = () => {
    localStorage.removeItem('userInfo');
    setUser(null);
    window.location.href = '/'; // Kick them back to the landing page
  };

  return (
    <AuthContext.Provider value={{ user, setUser, logout }}>
      {children}
    </AuthContext.Provider>
  );
};