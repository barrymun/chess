import { isEqual } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { BoardStateProps, Player, defaultBoard, getIsCheckmate, getIsStalemate } from "utils";

interface GameStateProviderProps {
  children: React.ReactNode;
}

const GameStateContext = createContext(
  {} as {
    boardState: BoardStateProps;
    playerTurn: Player;
    setBoardState: React.Dispatch<React.SetStateAction<BoardStateProps>>;
    setPlayerTurn: React.Dispatch<React.SetStateAction<Player>>;
  },
);

const GameStateProvider = ({ children }: GameStateProviderProps) => {
  const [boardState, setBoardState] = useState<BoardStateProps>({
    board: defaultBoard,
    isLastMoveVulnerableToEnPassant: false,
    enPassantCapturePieceIndex: null,
    whiteKingHasMoved: false,
    whiteLeftRookHasMoved: false, // a1
    whiteRightRookHasMoved: false, // h1
    blackKingHasMoved: false,
    blackLeftRookHasMoved: false, // a8
    blackRightRookHasMoved: false, // h8
  });
  const [playerTurn, setPlayerTurn] = useState<Player>("white");

  useEffect(() => {
    if (isEqual(boardState.board, defaultBoard)) {
      return;
    }
    const oppositePlayerTurn = playerTurn === "white" ? "black" : "white";
    const isStalemate = getIsStalemate({ ...boardState, playerTurn: oppositePlayerTurn });
    const isCheckmate = getIsCheckmate({ ...boardState, playerTurn: oppositePlayerTurn });
    console.log({ isStalemate, isCheckmate }); // TODO: handle game over logic
    setPlayerTurn((prevPlayerTurn) => (prevPlayerTurn === "white" ? "black" : "white"));
  }, [boardState.board]);

  const value = useMemo(
    () => ({
      boardState,
      playerTurn,
      setBoardState,
      setPlayerTurn,
    }),
    [boardState, playerTurn, setBoardState, setPlayerTurn],
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
