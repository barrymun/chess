import { defaultBoard, defaultGameRecord } from "common/build/config";
import { getIsCheckmate, getIsStalemate } from "common/build/move-validator";
import { GameRecord } from "common/build/types";
import { isEqual } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

interface GameStateProviderProps {
  isMultiplayer?: boolean;
  children: React.ReactNode;
}

const GameStateContext = createContext(
  {} as {
    isMultiplayer: boolean;
    gameRecord: GameRecord;
    setGameRecord: React.Dispatch<React.SetStateAction<GameRecord>>;
  },
);

const GameStateProvider = ({ isMultiplayer = false, children }: GameStateProviderProps) => {
  const [gameRecord, setGameRecord] = useState<GameRecord>(defaultGameRecord);

  useEffect(() => {
    if (isMultiplayer) {
      return;
    }
    if (isEqual(gameRecord.boardState.board, defaultBoard)) {
      return;
    }
    if (gameRecord.boardState.pawnPromotionPieceIndex !== null) {
      console.log({ pi: gameRecord.boardState.pawnPromotionPieceIndex });
      setGameRecord((prevGameRecord) => ({
        ...prevGameRecord,
        showPawnPromotionModal: true,
        pawnPromotionPieceSelection: null,
      }));
      return;
    }
    const oppositePlayerTurn = gameRecord.playerTurn === "white" ? "black" : "white";
    const isStalemate = getIsStalemate({ ...gameRecord.boardState, playerTurn: oppositePlayerTurn });
    const isCheckmate = getIsCheckmate({ ...gameRecord.boardState, playerTurn: oppositePlayerTurn });
    if (isStalemate || isCheckmate) {
      console.log({ isStalemate, isCheckmate });
      setGameRecord((prevGameRecord) => ({
        ...prevGameRecord,
        gameOver: {
          isGameOver: true,
          winner: isCheckmate ? gameRecord.playerTurn : null,
          reason: isCheckmate ? "checkmate" : "stalemate",
        },
      }));
      return;
    }
    setGameRecord((prevGameRecord) => ({
      ...prevGameRecord,
      playerTurn: prevGameRecord.playerTurn === "white" ? "black" : "white",
    }));
  }, [gameRecord.boardState.board]);

  useEffect(() => {
    if (isMultiplayer) {
      return;
    }
    if (gameRecord.pawnPromotionPieceSelection === null) {
      return;
    }
    setGameRecord((prevGameRecord) => ({
      ...prevGameRecord,
      boardState: {
        ...prevGameRecord.boardState,
        board: [
          ...prevGameRecord.boardState.board.slice(0, prevGameRecord.boardState.pawnPromotionPieceIndex!),
          gameRecord.pawnPromotionPieceSelection!,
          ...prevGameRecord.boardState.board.slice(prevGameRecord.boardState.pawnPromotionPieceIndex! + 1),
        ],
        pawnPromotionPieceIndex: null,
      },
      pawnPromotionPieceSelection: null,
      showPawnPromotionModal: false,
    }));
  }, [gameRecord.pawnPromotionPieceSelection]);

  const value = useMemo(
    () => ({
      isMultiplayer,
      gameRecord,
      setGameRecord,
    }),
    [gameRecord, setGameRecord],
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
