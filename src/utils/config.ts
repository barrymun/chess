import { SanPiece } from "utils";

export const xLabels = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const yLabels = [1, 2, 3, 4, 5, 6, 7, 8];
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
export const pieceSize: number = 100;
