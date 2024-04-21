import React, { createContext, useContext } from "react";
import io from "socket.io-client";

const SocketContext = createContext(null);

export const useSocketContext = () => {
  const context = useContext(SocketContext);
  if (!context)
    throw new Error("useSocketContext not used within the approriate provider");

  return context;
};

export const SocketContextProvider = ({ children }) => {
  const socket = io(process.env.REACT_APP_API_BASE_URL);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
