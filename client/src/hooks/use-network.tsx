import { defaultGameRecord } from "common/build/config";
import { BoardStateProps, GameRecord, LastMoveProps, MoveHistoryProps, Player } from "common/build/types";
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
    setSocket: React.Dispatch<React.SetStateAction<Socket | null>>;
    makeNetworkMove:
      | (({
          lastMovedPiece,
          moveHistory,
          boardState,
        }: {
          lastMovedPiece: LastMoveProps;
          moveHistory: MoveHistoryProps;
          boardState: BoardStateProps;
        }) => void)
      | undefined;
  },
);

const NetworkProvider = ({ children }: NetworkProviderProps) => {
  const { playerId } = usePlayerInfo();
  const {
    setBoardState,
    setLastMovedPiece,
    setPlayerTurn,
    setPawnPromotionPieceSelection,
    setShowPawnPromotionModal,
    setSelectedPieceLegalMoves,
    setMoveHistory,
    setGameOver,
  } = useGameState();

  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [gameId, setGameId] = useState<string | null>(null);
  const [gameRecord, setGameRecord] = useState<GameRecord>(defaultGameRecord);

  const assignGame = async () => {
    if (playerId === null) {
      return;
    }
    const findGameResponse = await findGame(playerId);
    console.log({ findGameResponse });
    setGameId(findGameResponse.gameId);
    setGameRecord(findGameResponse.gameRecord);
    setIsLoaded(true);
  };

  const makeNetworkMove = ({
    lastMovedPiece,
    moveHistory,
    boardState,
  }: {
    lastMovedPiece: LastMoveProps;
    moveHistory: MoveHistoryProps;
    boardState: BoardStateProps;
  }) => {
    if (playerId === null) {
      return;
    }
    console.log("making network move");
    makeMove({ playerId, lastMovedPiece, moveHistory, boardState });
  };

  useEffect(() => {
    setBoardState(gameRecord.boardState);
    setLastMovedPiece(gameRecord.lastMovedPiece);
    setPlayerTurn(gameRecord.playerTurn);
    setPawnPromotionPieceSelection(gameRecord.pawnPromotionPieceSelection);
    setShowPawnPromotionModal(gameRecord.showPawnPromotionModal);
    setSelectedPieceLegalMoves(gameRecord.selectedPieceLegalMoves);
    setMoveHistory(gameRecord.moveHistory);
    setGameOver(gameRecord.gameOver);
  }, [gameRecord]);

  useEffect(() => {
    if (socket === null || gameId === null) {
      return;
    }
    console.log({ socket, gameId });
    socket.on(gameId, ({ gameRecord }: { gameRecord: GameRecord }) => {
      setGameRecord(gameRecord);
    });
  }, [socket, gameId]);

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
      setSocket,
      makeNetworkMove,
    }),
    [socket, setSocket, makeNetworkMove],
  );

  return <NetworkContext.Provider value={value}>{isLoaded ? children : <Loader />}</NetworkContext.Provider>;
};

const useNetwork = () => useContext(NetworkContext);

export { NetworkProvider, useNetwork };
