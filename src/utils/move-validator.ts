import { Player, SanPiece, SanPieceBlack, SanPieceWhite, blackSanPieces, tilesPerRow, whiteSanPieces } from "utils";

let isLastMoveVulnerableToEnPassant: boolean = false;
let enPassantCapturePieceIndex: number | null = null;
// let lastMoveDestinationIndex: number | null = null;

interface MoveValidatorResponse {
  isValid: boolean;
  boardUpdates: Record<number, SanPiece>;
}

const getPlayerMultiplier = (player: Player): number => (player === "white" ? -1 : 1);

const isCapturingEnemyPiece = ({
  player,
  board,
  destination,
}: {
  player: Player;
  board: SanPiece[];
  destination: number;
}): boolean => {
  return player === "white"
    ? blackSanPieces.includes(board[destination] as SanPieceBlack)
    : whiteSanPieces.includes(board[destination] as SanPieceWhite);
};

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
  const multiplier = getPlayerMultiplier(player);
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
    enPassantCapturePieceIndex = null;
  } else if ((isNormalLeftCapture || isNormalRightCapture) && board[destination] !== " ") {
    // handle normal left/right capture
    isValid = true;
    isLastMoveVulnerableToEnPassant = false;
    enPassantCapturePieceIndex = null;
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
      enPassantCapturePieceIndex = null;
    }
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: player === "white" ? "P" : "p" };
  }
  // lastMoveDestinationIndex = destination;
  return { isValid, boardUpdates };
};

const isValidBishopMove = ({
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
  const isDiagonalMove =
    Math.abs(destination - origin) % (tilesPerRow - 1) === 0 ||
    Math.abs(destination - origin) % (tilesPerRow + 1) === 0;

  let mult = 1;
  let start = origin;
  let end = destination;
  if (end < start) {
    start = destination;
    end = origin;
    mult = -1;
  }
  let isDiagonalMoveLeftValid: boolean = true;
  for (let i = start; i <= end; i = i + tilesPerRow - 1 * mult) {
    if (board[i] !== " " && i !== origin) {
      isDiagonalMoveLeftValid = false;
    }
  }
  let isDiagonalMoveRightValid: boolean = true;
  for (let i = start; i <= end; i = i + tilesPerRow + 1 * mult) {
    if (board[i] !== " " && i !== origin) {
      isDiagonalMoveRightValid = false;
    }
  }

  const isDiagonalMoveValid =
    isDiagonalMove && (isDiagonalMoveLeftValid || isDiagonalMoveRightValid) && board[destination] === " ";
  const isDiagonalCapture =
    isDiagonalMove && board[destination] !== " " && isCapturingEnemyPiece({ player, board, destination });
  if (isDiagonalMoveValid) {
    isValid = true;
  } else if (isDiagonalCapture) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: player === "white" ? "B" : "b" };
  }
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
      if (playerTurn === "white") {
        ({ isValid, boardUpdates } = isValidBishopMove({ player: "white", board, origin, destination }));
      }
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
      if (playerTurn === "black") {
        ({ isValid, boardUpdates } = isValidBishopMove({ player: "black", board, origin, destination }));
      }
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
