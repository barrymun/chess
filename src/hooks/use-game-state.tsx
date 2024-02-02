import { isEqual } from "lodash";
import { createContext, useContext, useEffect, useMemo, useState } from "react";

import { GameOverModal, PawnPromotionModal } from "components";
import {
  BoardStateProps,
  GameOverProps,
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
  defaultGameOverState,
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
    pawnPromotionPieceSelection:
      | SanBishopBlack
      | SanBishopWhite
      | SanKnightBlack
      | SanKnightWhite
      | SanQueenBlack
      | SanQueenWhite
      | SanRookBlack
      | SanRookWhite
      | null;
    showPawnPromotionModal: boolean;
    selectedPieceLegalMoves: number[];
    gameOver: GameOverProps;
    setBoardState: React.Dispatch<React.SetStateAction<BoardStateProps>>;
    setPlayerTurn: React.Dispatch<React.SetStateAction<Player>>;
    setPawnPromotionPieceSelection: React.Dispatch<React.SetStateAction<
      | SanBishopBlack
      | SanBishopWhite
      | SanKnightBlack
      | SanKnightWhite
      | SanQueenBlack
      | SanQueenWhite
      | SanRookBlack
      | SanRookWhite
      | null
    > | null>;
    setShowPawnPromotionModal: React.Dispatch<React.SetStateAction<boolean>>;
    setSelectedPieceLegalMoves: React.Dispatch<React.SetStateAction<number[]>>;
    setGameOver: React.Dispatch<React.SetStateAction<GameOverProps>>;
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
  const [selectedPieceLegalMoves, setSelectedPieceLegalMoves] = useState<number[]>([]);
  const [gameOver, setGameOver] = useState<GameOverProps>(defaultGameOverState);

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
    if (isStalemate || isCheckmate) {
      console.log({ isStalemate, isCheckmate });
      setGameOver({
        isGameOver: true,
        winner: isCheckmate ? playerTurn : null,
        reason: isCheckmate ? "checkmate" : "stalemate",
      });
      return;
    }
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
      pawnPromotionPieceSelection,
      showPawnPromotionModal,
      selectedPieceLegalMoves,
      gameOver,
      setBoardState,
      setPlayerTurn,
      setPawnPromotionPieceSelection,
      setShowPawnPromotionModal,
      setSelectedPieceLegalMoves,
      setGameOver,
    }),
    [
      boardState,
      playerTurn,
      pawnPromotionPieceSelection,
      showPawnPromotionModal,
      selectedPieceLegalMoves,
      gameOver,
      setBoardState,
      setPlayerTurn,
      setPawnPromotionPieceSelection,
      setShowPawnPromotionModal,
      setSelectedPieceLegalMoves,
      setGameOver,
    ],
  );

  return (
    <GameStateContext.Provider value={value}>
      {children}
      <PawnPromotionModal />
      <GameOverModal />
    </GameStateContext.Provider>
  );
};

const useGameState = () => useContext(GameStateContext);

export { GameStateProvider, useGameState };
