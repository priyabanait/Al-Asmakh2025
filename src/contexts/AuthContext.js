"use client";

import { createContext, useContext, useState, useEffect } from "react";

// Create the auth context
const AuthContext = createContext();

// Helper function for navigation that works with static exports
const navigate = (path) => {
  if (typeof window !== 'undefined') {
    window.location.href = path;
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [partner, setPartner] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is authenticated on component mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");
        
        if (!token) {
          setLoading(false);
          return;
        }

        // Check if user data exists in localStorage
        const userData = localStorage.getItem("userData");
        const partnerData = localStorage.getItem("partnerData");

        if (userData) {
          setUser(JSON.parse(userData));
        } else if (partnerData) {
          setPartner(JSON.parse(partnerData));
        } else {
          // If we have a token but no user/partner data, fetch from API
          await fetchUserData(token);
        }
      } catch (err) {
        console.error("Authentication error:", err);
        setError(err.message);
        logout(); // Clear any invalid auth state
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  // Fetch user data from backend
  const fetchUserData = async (token) => {
    try {
      // Try to fetch user data first
      const userResponse = await fetch("https://albackend.x-360.ai/api/users/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (userResponse.ok) {
        const userData = await userResponse.json();
        setUser(userData.data);
        localStorage.setItem("userData", JSON.stringify(userData.data));
        return;
      }

      // If not a user, try partner endpoint
      const partnerResponse = await fetch("https://albackend.x-360.ai/api/partners/me", {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (partnerResponse.ok) {
        const partnerData = await partnerResponse.json();
        setPartner(partnerData.data);
        localStorage.setItem("partnerData", JSON.stringify(partnerData.data));
        return;
      }

      // If both fail, clear auth state
      throw new Error("Failed to fetch user data");
    } catch (err) {
      console.error("Error fetching user data:", err);
      throw err;
    }
  };

  // Login function
  const login = async (credentials, isPartner = false) => {
    try {
      setLoading(true);
      const endpoint = isPartner 
        ? "https://albackend.x-360.ai/api/partners/login" 
        : "https://albackend.x-360.ai/api/users/login";

      const response = await fetch(endpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Store token and user/partner data
      localStorage.setItem("token", data.token);
      
      if (isPartner) {
        setPartner(data.data);
        localStorage.setItem("partnerData", JSON.stringify(data.data));
        navigate("/partner-dashboard");
      } else {
        setUser(data.data);
        localStorage.setItem("userData", JSON.stringify(data.data));
        navigate("/dashboard");
      }

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // OAuth login function
  const oauthLogin = async (provider, token) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch(`https://albackend.x-360.ai/api/users/oauth/${provider}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `${provider} authentication failed`);
      }

      // Store token and user data
      localStorage.setItem("token", data.token);
      setUser(data.data);
      localStorage.setItem("userData", JSON.stringify(data.data));
      
      // Redirect to dashboard
      navigate("/dashboard");

      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    localStorage.removeItem("partnerData");
    setUser(null);
    setPartner(null);
    navigate("/");
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user || !!partner;
  };

  // Check if user is a partner
  const isPartner = () => {
    return !!partner;
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        partner,
        loading,
        error,
        login,
        oauthLogin,
        logout,
        isAuthenticated,
        isPartner,
        fetchUserData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
