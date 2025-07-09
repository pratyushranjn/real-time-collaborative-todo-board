import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Toaster } from "react-hot-toast"; 

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { AuthProvider } from "./context/AuthContext";
import { BoardProvider } from "./context/BoardContext";
import ProtectedRoute from "./components/ProtectedRoute";

import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: "#333",
              color: "#fff",
              fontSize: "14px",
              borderRadius: "8px",
              padding: "10px 16px",
            },
          }}
        />
        
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <BoardProvider>
                  <Dashboard />
                </BoardProvider>
              </ProtectedRoute>
            }
          />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
