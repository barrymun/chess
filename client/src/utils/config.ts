import { SanPiece } from "@barrymun/chess-common";

export const repoUrl = "https://github.com/barrymun/chess";
export const xLabels = ["a", "b", "c", "d", "e", "f", "g", "h"];
export const yLabels = [1, 2, 3, 4, 5, 6, 7, 8];

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
