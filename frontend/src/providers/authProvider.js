import React, { createContext, useContext, useState } from "react";
import axios from "axios";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = async (email, password) => {
    try {
      const response = await axios.post("/login", { email, password });
      if (response.status === 200) {
        setUser(response.data.account);
      }
    } catch (error) {
      console.error(
        "Login error:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  const logout = async () => {
    try {
      await axios.post("/logout");
      setUser(null);
    } catch (error) {
      console.error(
        "Logout error:",
        error.response?.data?.message || error.message
      );
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
