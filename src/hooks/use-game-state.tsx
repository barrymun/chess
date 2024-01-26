import { createContext, useContext, useMemo, useState } from "react";

import { SanPiece, defaultBoard } from "utils";

const GameStateContext = createContext(
  {} as {
    board: SanPiece[];
    setBoard: React.Dispatch<React.SetStateAction<SanPiece[]>>;
  },
);

interface GameStateProviderProps {
  children: React.ReactNode;
}

const GameStateProvider = ({ children }: GameStateProviderProps) => {
  const [board, setBoard] = useState<SanPiece[]>(defaultBoard);

  const value = useMemo(
    () => ({
      board,
      setBoard,
    }),
    [board, setBoard],
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
