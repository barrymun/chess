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
  const multiplier = player === "white" ? -1 : 1;
  const specialFirstMoveLowerBounds = player === "white" ? 6 * tilesPerRow : 1 * tilesPerRow;
  const specialFirstMoveUpperBounds = player === "white" ? 7 * tilesPerRow : 2 * tilesPerRow;
  if (
    origin + multiplier * 2 * tilesPerRow === destination &&
    origin >= specialFirstMoveLowerBounds &&
    origin <= specialFirstMoveUpperBounds &&
    board[destination] === " " &&
    board[destination - multiplier * tilesPerRow] === " "
  ) {
    // handle special first move
    isValid = true;
  } else if (origin + multiplier * tilesPerRow === destination && board[destination] === " ") {
    // handle normal move
    isValid = true;
  } else if (
    origin + multiplier * tilesPerRow - 1 === destination &&
    origin % tilesPerRow !== 0 &&
    board[destination] !== " "
  ) {
    // handle capture left
    isValid = true;
    isCaptured = true;
  } else if (
    origin + multiplier * tilesPerRow + 1 === destination &&
    origin % tilesPerRow !== tilesPerRow - 1 &&
    board[destination] !== " "
  ) {
    // handle capture right
    isValid = true;
    isCaptured = true;
  }
  return { isValid, isCaptured };
};

export const isValidMove = ({
  piece,
  board,
  playerTurn,
  origin,
  destination,
}: {
  piece: SanPiece;
  board: SanPiece[];
  playerTurn: Player;
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
      if (playerTurn === "white") {
        ({ isValid, isCaptured } = isValidPawnMove({ player: "white", board, origin, destination }));
      }
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
      if (playerTurn === "black") {
        ({ isValid, isCaptured } = isValidPawnMove({ player: "black", board, origin, destination }));
      }
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
