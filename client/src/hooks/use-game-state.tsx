import { GameRecord, defaultBoard, defaultGameRecord, getIsCheckmate, getIsStalemate } from "common";
import { isEqual } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { useLocalStorage } from "hooks";

interface GameStateProviderProps {
  isMultiplayer?: boolean;
  children: React.ReactNode;
}

const GameStateContext = createContext(
  {} as {
    isMultiplayer: boolean;
    gameRecord: GameRecord;
    setGameRecord: React.Dispatch<React.SetStateAction<GameRecord>>;
    completeTurn: () => void;
  },
);

const GameStateProvider = ({ isMultiplayer = false, children }: GameStateProviderProps) => {
  const { getValue, setValue } = useLocalStorage();

  // load singleplayer game record from local storage (if it exists)
  const [gameRecord, setGameRecord] = useState<GameRecord>(
    !isMultiplayer && getValue("singleplayerGameRecord") !== null
      ? JSON.parse(getValue("singleplayerGameRecord")!)
      : defaultGameRecord,
  );

  const completeTurn = () => {
    if (isMultiplayer) {
      return;
    }
    setGameRecord((prevGameRecord) => ({
      ...prevGameRecord,
      playerTurn: prevGameRecord.playerTurn === "white" ? "black" : "white",
    }));
  };

  /**
   * save singleplayer game record to local storage when it changes
   */
  useEffect(() => {
    if (isMultiplayer) {
      return;
    }
    setValue("singleplayerGameRecord", JSON.stringify(gameRecord));
  }, [gameRecord]);

  useEffect(() => {
    if (isMultiplayer) {
      return;
    }
    if (isEqual(gameRecord.boardState.board, defaultBoard)) {
      return;
    }
    if (gameRecord.boardState.pawnPromotionPieceIndex !== null) {
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
      completeTurn,
    }),
    [isMultiplayer, gameRecord, setGameRecord, completeTurn],
  );

  return <GameStateContext.Provider value={value}>{children}</GameStateContext.Provider>;
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
