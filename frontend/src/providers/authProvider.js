import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const navigate = useNavigate();

  const login = async (email, password) => {
    try {
      const response = await axios.post("/login", { email, password });
      if (response.status === 200) {
        console.log(response.data);
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

  useEffect(() => {
    const fetchCheckLogin = async () => {
      console.log("FCL");
      try {
        const res = await fetch(
          `${process.env.REACT_APP_BACKEND_URI}/checkLogin`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.isLoggedIn) {
            setUser(data.account);
          } else {
            navigate("/");
          }
        } else {
          navigate("/");
          console.log("server send back error response");
        }
      } catch (e) {
        navigate("/");
        console.log("fetch fail");
      }
    };

    fetchCheckLogin();
  }, []);

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
