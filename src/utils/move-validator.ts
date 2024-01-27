import { Player, SanPiece, tilesPerRow } from "utils";

const isValidPawnMove = ({
  player,
  board,
  origin,
  destination,
}: {
  player: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
}): {
  isValid: boolean;
  isCaptured: boolean;
} => {
  let isValid: boolean = false;
  let isCaptured: boolean = false;
  if (player === "white") {
    if (
      origin - 2 * tilesPerRow === destination &&
      origin >= 6 * tilesPerRow &&
      origin <= 7 * tilesPerRow &&
      board[destination] === " " &&
      board[destination + tilesPerRow] === " "
    ) {
      // handle white special first move
      isValid = true;
    } else if (origin - tilesPerRow === destination && board[destination] === " ") {
      // handle white normal move
      isValid = true;
    } else if (origin - tilesPerRow - 1 === destination && origin % tilesPerRow !== 0 && board[destination] !== " ") {
      // handle white capture left
      isValid = true;
      isCaptured = true;
    } else if (
      origin - tilesPerRow + 1 === destination &&
      origin % tilesPerRow !== tilesPerRow - 1 &&
      board[destination] !== " "
    ) {
      // handle white capture right
      isValid = true;
      isCaptured = true;
    }
  } else {
    if (
      origin + 2 * tilesPerRow === destination &&
      origin <= 2 * tilesPerRow &&
      origin >= tilesPerRow &&
      board[destination] === " " &&
      board[destination - tilesPerRow] === " "
    ) {
      // handle black special first move
      isValid = true;
    } else if (origin + tilesPerRow === destination && board[destination] === " ") {
      // handle black normal move
      isValid = true;
    } else if (origin + tilesPerRow - 1 === destination && origin % tilesPerRow !== 0 && board[destination] !== " ") {
      // handle black capture left
      isValid = true;
      isCaptured = true;
    } else if (
      origin + tilesPerRow + 1 === destination &&
      origin % tilesPerRow !== tilesPerRow - 1 &&
      board[destination] !== " "
    ) {
      // handle black capture right
      isValid = true;
      isCaptured = true;
    }
  }
  return { isValid, isCaptured };
};

export const isValidMove = ({
  piece,
  board,
  origin,
  destination,
}: {
  piece: SanPiece;
  board: SanPiece[];
  origin: number;
  destination: number;
}): {
  isValid: boolean;
  isCaptured: boolean;
} => {
  let isValid: boolean = false;
  let isCaptured: boolean = false;
  switch (piece) {
    case "P":
      ({ isValid, isCaptured } = isValidPawnMove({ player: "white", board, origin, destination }));
      break;
    case "N":
      // isValid = isValidKnightMove({ board, origin, destination });
      break;
    case "B":
      // isValid = isValidBishopMove({ board, origin, destination });
      break;
    case "R":
      // isValid = isValidRookMove({ board, origin, destination });
      break;
    case "Q":
      // isValid = isValidQueenMove({ board, origin, destination });
      break;
    case "K":
      // isValid = isValidKingMove({ board, origin, destination });
      break;
    case "p":
      ({ isValid, isCaptured } = isValidPawnMove({ player: "black", board, origin, destination }));
      break;
    case "n":
      // isValid = isValidKnightMove({ board, origin, destination });
      break;
    case "b":
      // isValid = isValidBishopMove({ board, origin, destination });
      break;
    case "r":
      // isValid = isValidRookMove({ board, origin, destination });
      break;
    case "q":
      // isValid = isValidQueenMove({ board, origin, destination });
      break;
    case "k":
      // isValid = isValidKingMove({ board, origin, destination });
      break;
    default:
      isValid = false;
      isCaptured = false;
      break;
  }
  return { isValid, isCaptured };
};
