import { createContext, useState, useEffect, useContext } from 'react';
import axios from 'axios'
import socket from '../services/socket'


const AuthContext = createContext();
const BASE_URL = import.meta.env.VITE_BACKEND_URL;

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setloading] = useState(true);

  // Fetch user
  const fetchUser = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/auth/me`, {
        withCredentials: true, // for sending the cookie
      });
      setUser(res.data.user)
      socket.connect();
    } catch (err) {
      setUser(null)
      socket.disconnect()
    } finally {
      setloading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async ({ email, password }) => {
    if (!email || !password) throw new Error('Email and password are required');

    try {
      await axios.post(
        `${BASE_URL}/auth/login`,
        { email, password },
        { withCredentials: true }
      );
      await fetchUser(); // refresh context
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Login failed');
    }
  };

  const register = async ({ name, email, password }) => {
    if (!name || !email || !password) throw new Error('All fields are required');
    if (password.length < 5) throw new Error('Password must be at least 5 characters');

    try {
      await axios.post(
        `${BASE_URL}/auth/register`,
        { name, email, password },
        { withCredentials: true }
      );
      await fetchUser(); // refresh context
    } catch (err) {
      throw new Error(err.response?.data?.message || 'Registration failed');
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
    <AuthContext.Provider value={{ user, setUser, login, register, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
