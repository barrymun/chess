import { GameRecord, Player } from "common/build/types";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Socket, io } from "socket.io-client";

import { Loader } from "components";
import { useGameState, usePlayerInfo } from "hooks";
import { findGame, makeMove } from "utils";

interface NetworkProviderProps {
  children: React.ReactNode;
}

const NetworkContext = createContext(
  {} as {
    isLoaded: boolean;
    socket: Socket | null;
    currentPlayer: Player | null;
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
    makeNetworkMove: ((gameRecord: GameRecord) => void) | undefined;
  },
);

const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const { playerId } = usePlayerInfo();
  const { setGameRecord } = useGameState();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);

  const assignGame = async () => {
    if (playerId === null) {
      return;
    }
    const findGameResponse = await findGame(playerId);
    console.log({ findGameResponse });
    setGameId(findGameResponse.gameId);
    setCurrentPlayer(findGameResponse.playerColour);
    setGameRecord(findGameResponse.gameRecord);
  };

  const makeNetworkMove = (gameRecord: GameRecord) => {
    if (playerId === null) {
      return;
    }
    console.log("making network move");
    makeMove({ playerId, gameRecord });
  };

  useEffect(() => {
    if (socket === null || gameId === null || currentPlayer === null) {
      return;
    }
    setIsLoaded(true);
    socket.on(gameId, ({ gameRecord }: { gameRecord: GameRecord }) => {
      setGameRecord(gameRecord);
    });
  }, [socket, gameId, currentPlayer]);

  useEffect(() => {
    const ws = io("http://localhost:3001");
    ws.on("connect", () => {
      console.log("connected to server");
      assignGame();
    });
    ws.on("disconnect", () => {
      console.log("disconnected from server");
      setIsLoaded(false);
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
      currentPlayer,
      setSocket,
      makeNetworkMove,
    }),
    [socket, setSocket, makeNetworkMove],
  );

  return <NetworkContext.Provider value={value}>{isLoaded ? children : <Loader />}</NetworkContext.Provider>;
};

const useNetwork = () => useContext(NetworkContext);

export { NetworkProvider, useNetwork };
