import { SanPiece } from "common/build/types";

import { MoveHistoryProps } from "utils";

export const mergeMoveHistory = (moveHistory: MoveHistoryProps): string[][] => {
  let res: string[][] = [];
  moveHistory.white.algebraicNotationMoves.map((move, index) => {
    const blackMove =
      moveHistory.black.algebraicNotationMoves.length === index ? "" : moveHistory.black.algebraicNotationMoves[index];
    res = [...res, [move, blackMove]];
  });
  return res;
};

/**
 * TODO: https://www.chess.com/terms/chess-notation#:~:text=both%20white%20knights%20can%20move%20to%20the%20d2%2Dsquare
 * TODO: https://www.chess.com/terms/chess-notation#:~:text=same%20type%20can%20both%20move%20to%20the%20same%20square
 */
export const convertMoveToAlgebraicNotation = ({
  origin,
  destination,
  originPiece,
  destinationPiece,
  isInCheck,
  isCheckmate,
}: {
  origin: number;
  destination: number;
  originPiece: SanPiece;
  destinationPiece: SanPiece;
  isInCheck: boolean;
  isCheckmate: boolean;
}): string => {
  const originPieceIsPawn = originPiece === "P" || originPiece === "p";
  const originPieceIsKing = originPiece === "K" || originPiece === "k";
  // const originRank = Math.floor(origin / 8);
  const originFile = origin % 8;
  const destinationRank = Math.floor(destination / 8);
  const destinationFile = destination % 8;
  const pieceCaptured = destinationPiece !== " ";

  // castling
  if (originPieceIsKing) {
    if (originFile - destinationFile === 2) {
      return "O-O-O";
    }
    if (originFile - destinationFile === -2) {
      return "O-O";
    }
  }

  let prefix = "";
  let suffix = "";
  if (originPieceIsPawn) {
    prefix = "";
    if (pieceCaptured) {
      prefix = `${String.fromCharCode(97 + originFile)}x`;
    }
  } else {
    prefix = originPiece.toUpperCase();
    if (pieceCaptured) {
      prefix = `${originPiece.toUpperCase()}x`;
    }
  }
  suffix = `${String.fromCharCode(97 + destinationFile)}${8 - destinationRank}`;
  if (isCheckmate) {
    suffix += "#";
  } else if (isInCheck) {
    suffix += "+";
  }
  return `${prefix}${suffix}`;
};
