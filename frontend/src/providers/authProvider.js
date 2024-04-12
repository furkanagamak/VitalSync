import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetchImg, setFetchImg] = useState(false);
  const navigate = useNavigate();

  const triggerNavImgRefetch = () => {
    setFetchImg((fetchImg) => !fetchImg);
  };

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
      try {
        const res = await fetch(
          `${process.env.REACT_APP_API_BASE_URL}/checkLogin`,
          {
            credentials: "include",
          }
        );

        if (res.ok) {
          const data = await res.json();
          if (data.isLoggedIn) {
            setUser(data.account);
            console.log(window.location.pathname);
            if (
              window.location.pathname === "/" ||
              window.location.pathname === "/RecoveryPage"
            )
              navigate("/home");
          } else {
            if(window.location.pathname !== "/RecoveryPage") {
            navigate("/");
            }
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
    <AuthContext.Provider
      value={{ user, fetchImg, triggerNavImgRefetch, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
