import { BoardStateProps, SanPiece } from "utils/types";

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
