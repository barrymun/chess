import { Player } from "common/build/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";

interface NetworkProviderProps {
  children: React.ReactNode;
}

const NetworkContext = createContext(
  {} as {
    isLoaded: boolean;
    socket: Socket | null;
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
  },
);

const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    const ws = io("http://localhost:3001");
    ws.on("connect", () => {
      console.log("connected to server");
      setIsLoaded(true);
    });
    ws.on("disconnect", () => {
      console.log("disconnected from server");
      setIsLoaded(false);
    });
    ws.on("message", (data) => {
      console.log("message received", data);
    });
    setSocket(ws);
    return () => {
      ws.disconnect();
    };
  }, []);

  const value = useMemo(
    () => ({
      isLoaded,
      socket,
      setSocket,
    }),
    [socket, setSocket],
  );

  // return <NetworkContext.Provider value={value}>{currentPlayer ? children : null}</NetworkContext.Provider>;
  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};

const useNetwork = () => useContext(NetworkContext);

export { NetworkProvider, useNetwork };
