import { BoardStateProps, GameOverProps, GameRecord, MoveHistoryProps, SanPiece } from "utils/types";

// Standard Algebraic Notation (SAN) 8x8 board
export const defaultBoard: SanPiece[] = [
  "rnbqkbnr", // 8th rank (black back row)
  "pppppppp", // 7th rank (black pawns)
  "        ", // 6th rank (empty)
  "        ", // 5th rank (empty)
  "        ", // 4th rank (empty)
  "        ", // 3rd rank (empty)
  "PPPPPPPP", // 2nd rank (white pawns)
  "RNBQKBNR", // 1st rank (white back row)
]
  .join("")
  .split("") as SanPiece[];
export const defaultBoardState: BoardStateProps = {
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
};
export const defaultMoveHistory: MoveHistoryProps = {
  white: {
    moves: [],
    algebraicNotationMoves: [],
  },
  black: {
    moves: [],
    algebraicNotationMoves: [],
  },
};
export const defaultGameOverState: GameOverProps = {
  isGameOver: false,
  winner: null,
  reason: "draw",
};
export const defaultGameRecord: GameRecord = {
  boardState: defaultBoardState,
  lastMovedPiece: null,
  playerTurn: "white",
  pawnPromotionPieceSelection: null,
  showPawnPromotionModal: false,
  selectedPieceLegalMoves: [],
  moveHistory: defaultMoveHistory,
  gameOver: defaultGameOverState,
};
