import { isEqual } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { Player, SanPiece, defaultBoard } from "utils";

const GameStateContext = createContext(
  {} as {
    board: SanPiece[];
    playerTurn: Player;
    updateBoard: ({
      originIndex,
      destinationIndex,
      isCaptured,
    }: {
      originIndex: number;
      destinationIndex: number;
      isCaptured: boolean;
    }) => void;
    setPlayerTurn: React.Dispatch<React.SetStateAction<Player>>;
  },
);

interface GameStateProviderProps {
  children: React.ReactNode;
}

const GameStateProvider = ({ children }: GameStateProviderProps) => {
  const [board, setBoard] = useState<SanPiece[]>(defaultBoard);
  const [playerTurn, setPlayerTurn] = useState<Player>("white");

  const updateBoard = ({
    originIndex,
    destinationIndex,
    isCaptured,
  }: {
    originIndex: number;
    destinationIndex: number;
    isCaptured: boolean;
  }) => {
    console.log("updateBoard");
    setBoard((prevBoard) => {
      const newBoard = [...prevBoard];
      const temp = newBoard[destinationIndex];
      newBoard[destinationIndex] = newBoard[originIndex];
      newBoard[originIndex] = isCaptured ? " " : temp;
      return newBoard;
    });
  };

  useEffect(() => {
    if (isEqual(board, defaultBoard)) {
      return;
    }
    setPlayerTurn((prevPlayerTurn) => (prevPlayerTurn === "white" ? "black" : "white"));
  }, [board]);

  const value = useMemo(
    () => ({
      board,
      playerTurn,
      updateBoard,
      setPlayerTurn,
    }),
    [board, playerTurn, updateBoard, setPlayerTurn],
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
