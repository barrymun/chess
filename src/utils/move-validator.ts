import { Player, SanPiece, tilesPerRow } from "utils";

let isLastMoveVulnerableToEnPassant: boolean = false;
let enPassantCapturePieceIndex: number | undefined = undefined;
// let lastMoveDestinationIndex: number | undefined = undefined;

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
  isEnPassantCapured: boolean;
} => {
  let isValid: boolean = false;
  let isCaptured: boolean = false;
  let isEnPassantCapured: boolean = false;
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
    console.log("special first move");
    isLastMoveVulnerableToEnPassant = true;
    enPassantCapturePieceIndex = destination;
  } else if (origin + multiplier * tilesPerRow === destination && board[destination] === " ") {
    // handle normal move
    isValid = true;
    isLastMoveVulnerableToEnPassant = false;
    enPassantCapturePieceIndex = undefined;
  } else if (
    origin + multiplier * tilesPerRow - 1 === destination &&
    origin % tilesPerRow !== 0 &&
    board[destination] !== " "
  ) {
    // handle capture left
    isValid = true;
    isCaptured = true;
    isLastMoveVulnerableToEnPassant = false;
    enPassantCapturePieceIndex = undefined;
  } else if (
    origin + multiplier * tilesPerRow + 1 === destination &&
    origin % tilesPerRow !== tilesPerRow - 1 &&
    board[destination] !== " "
  ) {
    // handle capture right
    isValid = true;
    isCaptured = true;
  } else if (isLastMoveVulnerableToEnPassant) {
    console.log(isLastMoveVulnerableToEnPassant);
    console.log(board[enPassantCapturePieceIndex!]);
    // TODO: something wrong with en passant; can capture even if the enPassantCapturePieceIndex does not match
    if (
      origin + multiplier * tilesPerRow - 1 === destination &&
      origin - 1 === enPassantCapturePieceIndex &&
      origin % tilesPerRow !== 0 &&
      board[destination] === " " &&
      board[enPassantCapturePieceIndex] === (player === "white" ? "p" : "P")
    ) {
      // handle en passant left
      isValid = true;
      isCaptured = true;
      isEnPassantCapured = true;
      isLastMoveVulnerableToEnPassant = false;
    } else if (
      origin + multiplier * tilesPerRow + 1 === destination &&
      origin + 1 === enPassantCapturePieceIndex &&
      origin % tilesPerRow !== tilesPerRow - 1 &&
      board[destination] === " " &&
      board[enPassantCapturePieceIndex] === (player === "white" ? "p" : "P")
    ) {
      // handle en passant right
      isValid = true;
      isCaptured = true;
      isEnPassantCapured = true;
      isLastMoveVulnerableToEnPassant = false;
    }
  }
  // lastMoveDestinationIndex = destination;
  return { isValid, isCaptured, isEnPassantCapured };
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
  isEnPassantCapured: boolean;
  enPassantCapturePieceIndex: number | undefined;
} => {
  let isValid: boolean = false;
  let isCaptured: boolean = false;
  let isEnPassantCapured: boolean = false;
  switch (piece) {
    case "P":
      if (playerTurn === "white") {
        ({ isValid, isCaptured, isEnPassantCapured } = isValidPawnMove({
          player: "white",
          board,
          origin,
          destination,
        }));
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
        ({ isValid, isCaptured, isEnPassantCapured } = isValidPawnMove({
          player: "black",
          board,
          origin,
          destination,
        }));
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
      break;
  }
  if (isValid) {
    console.log({ isLastMoveVulnerableToEnPassant, enPassantCapturePieceIndex });
  }
  return { isValid, isCaptured, isEnPassantCapured, enPassantCapturePieceIndex };
};
