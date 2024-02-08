import { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";
import { Socket, io } from "socket.io-client";

// import { Player } from "utils";

const newSocket = io("http://localhost:3001");

interface NetworkProviderProps {
  children: React.ReactNode;
}

const NetworkContext = createContext(
  {} as {
    socket: Socket;
    setSocket: React.Dispatch<React.SetStateAction<Socket>>;
  },
);

const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const isLoaded = useRef(false);
  const [socket, setSocket] = useState<Socket>(newSocket);
  // const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  useEffect(() => {
    if (isLoaded.current) {
      return;
    }
    isLoaded.current = true;
    socket.on("connect", () => {
      console.log("Connected to server");
    });
  }, []);

  const value = useMemo(
    () => ({
      socket,
      setSocket,
    }),
    [socket, setSocket],
  );

  return <NetworkContext.Provider value={value}>{children}</NetworkContext.Provider>;
};

const useNetwork = () => useContext(NetworkContext);

export { NetworkProvider, useNetwork };
