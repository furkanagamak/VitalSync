import React, { createContext, useContext, useState, useEffect } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error(
      "useSocketContext not used within the appropriate provider"
    );

  return context;
};

export const SocketContextProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket = io(process.env.REACT_APP_API_BASE_URL);

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  const resetSocket = () => {
    if (socket) {
      socket.disconnect();
      const newSocket = io(process.env.REACT_APP_API_BASE_URL);
      setSocket(newSocket);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, resetSocket }}>
      {children}
    </SocketContext.Provider>
  );
};
