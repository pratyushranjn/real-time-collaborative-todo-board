import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'
import socket from '../services/socket'

const AuthContext = createContext();

const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);
  const [authLoading, setAuthLoading] = useState(false);


  // Fetch user
  const fetchUser = async (retry = 1) => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, {
        withCredentials: true,
      });
      setUser(res.data.user);
      if (!socket.connected) socket.connect();
    } catch (err) {
      if (retry > 0) {
        setTimeout(() => fetchUser(retry - 1), 1500); // retry
      } else {
        setUser(null);
        if (socket.connected) socket.disconnect();
      }
    } finally {
      setloading(false); 
    }
  };


  useEffect(() => {
    fetchUser();
  }, []);


  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error('Email and password are required');
    setAuthLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      await fetchUser(); // refresh context
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    } finally {
      setAuthLoading(false);
    }
  };


  const register = async ({ name, email, password }) => {
    if (!name || !email || !password) throw new Error('All fields are required');
    if (password.length < 5) throw new Error('Password must be at least 5 characters');

    setAuthLoading(true);
    try {
      await axios.post(
        `${BASE_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      await fetchUser(); // refresh context
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
    } finally {
      setAuthLoading(false);
    }
  };


  const logout = async () => {
    try {
      await axios.post(`${BASE_URL}/auth/logout`, {}, { withCredentials: true });
    } catch (err) {
      console.error('Logout failed:', err.message);
    } finally {
      setUser(null)
      setloading(false)
      socket.disconnect()
    }
  };

  return (
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading, authLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
