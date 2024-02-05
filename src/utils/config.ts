import { BoardStateProps, GameOverProps, SanPiece, SanPieceBlack, SanPieceWhite } from "utils";

export const xLabels = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const yLabels = [1, 2, 3, 4, 5, 6, 7, 8];
export const totalTiles: number = 64;
export const tilesPerRow: number = 8;
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
export const assetSanPieceMap: Record<SanPiece, string> = {
  P: "pawn-w",
  N: "knight-w",
  B: "bishop-w",
  R: "rook-w",
  Q: "queen-w",
  K: "king-w",
  p: "pawn-b",
  n: "knight-b",
  b: "bishop-b",
  r: "rook-b",
  q: "queen-b",
  k: "king-b",
  " ": "empty",
};
export const whiteSanPieces: SanPieceWhite[] = ["P", "N", "B", "R", "Q", "K"];
export const blackSanPieces: SanPieceBlack[] = ["p", "n", "b", "r", "q", "k"];
export const pieceSize: number = 100;
export const defaultGameOverState: GameOverProps = {
  isGameOver: false,
  winner: null,
  reason: "draw",
};
