import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AdminDashboard from "./AdminDashboard";
import { databaseService } from "@/services/databaseService";

const AdminPortal: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Initialize database
    databaseService.initializeDatabase();
    
    // Check authentication status
    const token = localStorage.getItem("adminToken");
    if (token) {
      // In production, validate token with backend
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const handleLogin = (success: boolean) => {
    setIsAuthenticated(success);
  };

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p>Loading admin portal...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </>
  );
};

export default AdminPortal;
