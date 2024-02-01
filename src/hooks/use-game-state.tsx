import { isEqual } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import {
  BoardStateProps,
  Player,
  SanBishopBlack,
  SanBishopWhite,
  SanKnightBlack,
  SanKnightWhite,
  SanQueenBlack,
  SanQueenWhite,
  SanRookBlack,
  SanRookWhite,
  defaultBoard,
  getIsCheckmate,
  getIsStalemate,
} from "utils";

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
    pawnPromotionPieceIndex: null,
  });
  const [playerTurn, setPlayerTurn] = useState<Player>("white");
  const [pawnPromotionPieceSelection, setPawnPromotionPieceSelection] = useState<
    | SanBishopBlack
    | SanBishopWhite
    | SanKnightBlack
    | SanKnightWhite
    | SanQueenBlack
    | SanQueenWhite
    | SanRookBlack
    | SanRookWhite
    | null
  >(null);
  const [showPawnPromotionModal, setShowPawnPromotionModal] = useState<boolean>(false);
  // const [isGameOver, setIsGameOver] = useState<boolean>(false);

  useEffect(() => {
    if (isEqual(boardState.board, defaultBoard)) {
      return;
    }
    if (boardState.pawnPromotionPieceIndex !== null) {
      console.log({ pi: boardState.pawnPromotionPieceIndex });
      setShowPawnPromotionModal(true);
      setPawnPromotionPieceSelection(null);
      return;
    }
    const oppositePlayerTurn = playerTurn === "white" ? "black" : "white";
    const isStalemate = getIsStalemate({ ...boardState, playerTurn: oppositePlayerTurn });
    const isCheckmate = getIsCheckmate({ ...boardState, playerTurn: oppositePlayerTurn });
    console.log({ isStalemate, isCheckmate }); // TODO: handle game over logic
    setPlayerTurn((prevPlayerTurn) => (prevPlayerTurn === "white" ? "black" : "white"));
  }, [boardState.board]);

  useEffect(() => {
    if (pawnPromotionPieceSelection === null) {
      return;
    }
    setBoardState((prevBoardState) => ({
      ...prevBoardState,
      board: [
        ...prevBoardState.board.slice(0, prevBoardState.pawnPromotionPieceIndex!),
        pawnPromotionPieceSelection,
        ...prevBoardState.board.slice(prevBoardState.pawnPromotionPieceIndex! + 1),
      ],
      pawnPromotionPieceIndex: null,
    }));
    setShowPawnPromotionModal(false);
  }, [pawnPromotionPieceSelection]);

  const value = useMemo(
    () => ({
      boardState,
      playerTurn,
      setBoardState,
      setPlayerTurn,
    }),
    [boardState, playerTurn, setBoardState, setPlayerTurn],
  );

  return (
    <GameStateContext.Provider value={value}>
      {children}
      <div
        className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center"
        style={{ display: showPawnPromotionModal ? "flex" : "none" }}
      >
        <div className="flex justify-center items-center border-2 border-black rounded">
          <div
            className="w-100 h-100 hover:cursor-pointer"
            onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "Q" : "q")}
          >
            <div
              style={{
                backgroundImage: `url(assets/img/${playerTurn === "white" ? "queen-w" : "queen-b"}.png)`,
              }}
              className="bg-no-repeat w-100 h-100 bg-contain bg-center"
            />
          </div>
          <div
            className="w-100 h-100 hover:cursor-pointer"
            onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "R" : "r")}
          >
            <div
              style={{
                backgroundImage: `url(assets/img/${playerTurn === "white" ? "rook-w" : "rook-b"}.png)`,
              }}
              className="bg-no-repeat w-100 h-100 bg-contain bg-center"
            />
          </div>
          <div
            className="w-100 h-100 hover:cursor-pointer"
            onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "B" : "b")}
          >
            <div
              style={{
                backgroundImage: `url(assets/img/${playerTurn === "white" ? "bishop-w" : "bishop-b"}.png)`,
              }}
              className="bg-no-repeat w-100 h-100 bg-contain bg-center"
            />
          </div>
          <div
            className="w-100 h-100 hover:cursor-pointer"
            onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "N" : "n")}
          >
            <div
              style={{
                backgroundImage: `url(assets/img/${playerTurn === "white" ? "knight-w" : "knight-b"}.png)`,
              }}
              className="bg-no-repeat w-100 h-100 bg-contain bg-center"
            />
          </div>
        </div>
      </div>
    </GameStateContext.Provider>
  );
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
