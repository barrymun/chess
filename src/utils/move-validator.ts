import { Player, SanPiece, tilesPerRow } from "utils";

let isLastMoveVulnerableToEnPassant: boolean = false;
let enPassantCapturePieceIndex: number | undefined = undefined;
// let lastMoveDestinationIndex: number | undefined = undefined;

interface MoveValidatorResponse {
  isValid: boolean;
  boardUpdates: Record<number, SanPiece>;
}

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
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  const multiplier = player === "white" ? -1 : 1;
  const specialFirstMoveLowerBounds = player === "white" ? 6 * tilesPerRow : 1 * tilesPerRow;
  const specialFirstMoveUpperBounds = player === "white" ? 7 * tilesPerRow : 2 * tilesPerRow;
  const isNormalLeftCapture = origin + multiplier * tilesPerRow - 1 === destination && origin % tilesPerRow !== 0;
  const isNormalRightCapture =
    origin + multiplier * tilesPerRow + 1 === destination && origin % tilesPerRow !== tilesPerRow - 1;
  if (
    origin + multiplier * 2 * tilesPerRow === destination &&
    origin >= specialFirstMoveLowerBounds &&
    origin <= specialFirstMoveUpperBounds &&
    board[destination] === " " &&
    board[destination - multiplier * tilesPerRow] === " "
  ) {
    // handle special first move
    isValid = true;
    isLastMoveVulnerableToEnPassant = true;
    enPassantCapturePieceIndex = destination;
  } else if (origin + multiplier * tilesPerRow === destination && board[destination] === " ") {
    // handle normal move
    isValid = true;
    isLastMoveVulnerableToEnPassant = false;
    enPassantCapturePieceIndex = undefined;
  } else if ((isNormalLeftCapture || isNormalRightCapture) && board[destination] !== " ") {
    // handle normal left/right capture
    isValid = true;
    isLastMoveVulnerableToEnPassant = false;
    enPassantCapturePieceIndex = undefined;
  } else if (isLastMoveVulnerableToEnPassant && enPassantCapturePieceIndex) {
    const isEnPassantLeftCapture =
      origin + multiplier * tilesPerRow - 1 === destination &&
      origin - 1 === enPassantCapturePieceIndex &&
      origin % tilesPerRow !== 0;
    const isEnPassantRightCapture =
      origin + multiplier * tilesPerRow + 1 === destination &&
      origin + 1 === enPassantCapturePieceIndex &&
      origin % tilesPerRow !== tilesPerRow - 1;
    if (
      (isEnPassantLeftCapture || isEnPassantRightCapture) &&
      board[destination] === " " &&
      board[enPassantCapturePieceIndex] === (player === "white" ? "p" : "P")
    ) {
      // handle en passant left/right capture
      isValid = true;
      boardUpdates = { ...boardUpdates, [enPassantCapturePieceIndex]: " " };
      isLastMoveVulnerableToEnPassant = false;
      enPassantCapturePieceIndex = undefined;
    }
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: player === "white" ? "P" : "p" };
  }
  // lastMoveDestinationIndex = destination;
  return { isValid, boardUpdates };
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
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  switch (piece) {
    case "P":
      if (playerTurn === "white") {
        ({ isValid, boardUpdates } = isValidPawnMove({
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
        ({ isValid, boardUpdates } = isValidPawnMove({
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
  return { isValid, boardUpdates };
};
