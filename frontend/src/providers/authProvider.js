import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router-dom";
import { useSocketContext } from "./SocketProvider";
import { toast } from "react-hot-toast";
axios.defaults.baseURL = process.env.REACT_APP_API_BASE_URL;
axios.defaults.withCredentials = true;

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [fetchImg, setFetchImg] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { socket, resetSocket } = useSocketContext();

  const triggerNavImgRefetch = () => {
    setFetchImg((fetchImg) => !fetchImg);
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post("/login", { email, password });
      if (response.status === 200) {
        console.log(response.data);
        setUser(response.data.account);
        socket.emit("login", response.data.account.id);
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
      resetSocket();
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
      // try {
      const res = await fetch(
        `${process.env.REACT_APP_API_BASE_URL}/checkLogin`,
        {
          credentials: "include",
        }
      );

      if (res.ok) {
        const data = await res.json();
        if (data.isLoggedIn) {
          console.log("User is logged in!");
          console.log(data);
          setUser(data.account);
          if (socket) socket.emit("login", data.account.id);
          if (
            location.pathname === "/" ||
            location.pathname === "/RecoveryPage"
          )
            navigate("/home");
        } else {
          console.log("User is not logged in!");
          console.log(data);
          if (
            location.pathname !== "/RecoveryPage" &&
            location.pathname !== "/"
          ) {
            navigate("/");
            toast("You were redirected to the login page.", {
              icon: "⚠️",
            });
          }
        }
      } else {
        navigate("/");
        console.log("server send back error response");
      }
      // } catch (e) {
      //   navigate("/");
      //   console.log("fetch fail");
      // }
    };
    if (socket) {
      fetchCheckLogin();
    }
  }, [socket]);

  // for when new processes are added
  useEffect(() => {
    if (socket) {
      socket.on("trigger join process room", (involvedUser, processID) => {
        if (user && involvedUser.includes(user.id)) {
          socket.emit("join process room", processID);
        }
      });
    }
  }, [user, socket]);

  return (
    <AuthContext.Provider
      value={{ user, fetchImg, triggerNavImgRefetch, login, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
};
