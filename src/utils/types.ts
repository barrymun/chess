export type Player = "white" | "black";
export type TileColor = "light" | "dark";
export type SanPawnWhite = "P";
export type SanKnightWhite = "N";
export type SanBishopWhite = "B";
export type SanRookWhite = "R";
export type SanQueenWhite = "Q";
export type SanKingWhite = "K";
export type SanPawnBlack = "p";
export type SanKnightBlack = "n";
export type SanBishopBlack = "b";
export type SanRookBlack = "r";
export type SanQueenBlack = "q";
export type SanKingBlack = "k";
export type SanPieceEmpty = " ";
export type SanPiece =
  | SanPawnWhite
  | SanPawnBlack
  | SanKnightWhite
  | SanKnightBlack
  | SanBishopWhite
  | SanBishopBlack
  | SanRookWhite
  | SanRookBlack
  | SanQueenWhite
  | SanQueenBlack
  | SanKingWhite
  | SanKingBlack
  | SanPieceEmpty;
export type SanPieceWhite =
  | SanPawnWhite
  | SanKnightWhite
  | SanBishopWhite
  | SanRookWhite
  | SanQueenWhite
  | SanKingWhite;
export type SanPieceBlack =
  | SanPawnBlack
  | SanKnightBlack
  | SanBishopBlack
  | SanRookBlack
  | SanQueenBlack
  | SanKingBlack;
