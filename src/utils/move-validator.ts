import {
  Player,
  SanPiece,
  SanPieceBlack,
  SanPieceWhite,
  blackSanPieces,
  tilesPerRow,
  totalTiles,
  whiteSanPieces,
} from "utils";

let isLastMoveVulnerableToEnPassant: boolean = false;
let enPassantCapturePieceIndex: number | null = null;
// let lastMoveDestinationIndex: number | null = null;

interface MoveValidatorResponse {
  isValid: boolean;
  boardUpdates: Record<number, SanPiece>;
}

const getPlayerMultiplier = (playerTurn: Player): number => (playerTurn === "white" ? -1 : 1);

const getIsDestinationFriendlyFree = ({
  playerTurn,
  board,
  destination,
}: {
  playerTurn: Player;
  board: SanPiece[];
  destination: number;
}): boolean => {
  return playerTurn === "white"
    ? !whiteSanPieces.includes(board[destination] as SanPieceWhite)
    : !blackSanPieces.includes(board[destination] as SanPieceBlack);
};

const getIsCapturingEnemyPiece = ({
  playerTurn,
  board,
  destination,
}: {
  playerTurn: Player;
  board: SanPiece[];
  destination: number;
}): boolean => {
  const isCapturingEnemyPiece =
    playerTurn === "white"
      ? blackSanPieces.includes(board[destination] as SanPieceBlack)
      : whiteSanPieces.includes(board[destination] as SanPieceWhite);
  return isCapturingEnemyPiece && board[destination] !== " ";
};

const getIsDiagonalMove = ({ origin, destination }: { origin: number; destination: number }): boolean => {
  const originRow = Math.floor(origin / tilesPerRow);
  const originCol = origin % tilesPerRow;
  const destRow = Math.floor(destination / tilesPerRow);
  const destCol = destination % tilesPerRow;
  const rowDiff = Math.abs(destRow - originRow);
  const colDiff = Math.abs(destCol - originCol);
  return rowDiff === colDiff;
};

const getIsDiagonalClear = ({
  board,
  origin,
  destination,
}: {
  board: SanPiece[];
  origin: number;
  destination: number;
}): boolean => {
  let direction: "up-left" | "up-right" | "down-left" | "down-right" | null = null;
  if (origin < destination && (destination - origin) % (tilesPerRow - 1) === 0) {
    direction = "down-left";
  } else if (origin > destination && (destination - origin) % (tilesPerRow - 1) === 0) {
    direction = "up-right";
  } else if (origin < destination && (destination - origin) % (tilesPerRow + 1) === 0) {
    direction = "down-right";
  } else if (origin > destination && (destination - origin) % (tilesPerRow + 1) === 0) {
    direction = "up-left";
  }
  if (direction === null) {
    return false;
  }
  let current = origin;
  while (current !== destination) {
    if (direction === "up-left") {
      current -= tilesPerRow + 1;
    } else if (direction === "up-right") {
      current -= tilesPerRow - 1;
    } else if (direction === "down-left") {
      current += tilesPerRow - 1;
    } else if (direction === "down-right") {
      current += tilesPerRow + 1;
    }
    if (board[current] !== " " && current !== origin && current !== destination) {
      return false;
    }
  }
  return true;
};

const getIsStraightMove = ({ origin, destination }: { origin: number; destination: number }): boolean => {
  const rowDifference = Math.abs(Math.floor(destination / tilesPerRow) - Math.floor(origin / tilesPerRow));
  const colDifference = Math.abs((destination % tilesPerRow) - (origin % tilesPerRow));
  return (rowDifference > 0 && colDifference === 0) || (rowDifference === 0 && colDifference > 0);
};

const getIsStraightClear = ({
  board,
  origin,
  destination,
}: {
  board: SanPiece[];
  origin: number;
  destination: number;
}): boolean => {
  const rowStart = Math.floor(origin / tilesPerRow);
  const colStart = origin % tilesPerRow;
  const rowEnd = Math.floor(destination / tilesPerRow);
  const colEnd = destination % tilesPerRow;

  if (rowStart === rowEnd) {
    // Horizontal move
    const start = Math.min(colStart, colEnd);
    const end = Math.max(colStart, colEnd);

    for (let col = start + 1; col < end; col++) {
      const position = rowStart * tilesPerRow + col;
      if (board[position] !== " ") {
        return false;
      }
    }
  } else if (colStart === colEnd) {
    // Vertical move
    const start = Math.min(rowStart, rowEnd);
    const end = Math.max(rowStart, rowEnd);

    for (let row = start + 1; row < end; row++) {
      const position = row * tilesPerRow + colStart;
      if (board[position] !== " ") {
        return false;
      }
    }
  } else {
    // Invalid move (not horizontal or vertical)
    return false;
  }

  return true;
};

const getIsValidPawnMove = ({
  playerTurn,
  board,
  origin,
  destination,
  canSetEnPassantVariables = true,
  shouldValidateIsInCheck = true,
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
  canSetEnPassantVariables?: boolean;
  shouldValidateIsInCheck?: boolean;
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  const multiplier = getPlayerMultiplier(playerTurn);
  const isDestinationFriendlyFree = getIsDestinationFriendlyFree({ playerTurn, board, destination });
  const specialFirstMoveLowerBounds = playerTurn === "white" ? 6 * tilesPerRow : 1 * tilesPerRow;
  const specialFirstMoveUpperBounds = playerTurn === "white" ? 7 * tilesPerRow : 2 * tilesPerRow;
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
    if (canSetEnPassantVariables) {
      isLastMoveVulnerableToEnPassant = true;
      enPassantCapturePieceIndex = destination;
    }
  } else if (origin + multiplier * tilesPerRow === destination && board[destination] === " ") {
    // handle normal move
    isValid = true;
    if (canSetEnPassantVariables) {
      isLastMoveVulnerableToEnPassant = false;
      enPassantCapturePieceIndex = null;
    }
  } else if ((isNormalLeftCapture || isNormalRightCapture) && board[destination] !== " " && isDestinationFriendlyFree) {
    // handle normal left/right capture
    isValid = true;
    if (canSetEnPassantVariables) {
      isLastMoveVulnerableToEnPassant = false;
      enPassantCapturePieceIndex = null;
    }
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
      board[enPassantCapturePieceIndex] === (playerTurn === "white" ? "p" : "P")
    ) {
      // handle en passant left/right capture
      isValid = true;
      boardUpdates = { ...boardUpdates, [enPassantCapturePieceIndex]: " " };
      if (canSetEnPassantVariables) {
        isLastMoveVulnerableToEnPassant = false;
        enPassantCapturePieceIndex = null;
      }
    }
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: playerTurn === "white" ? "P" : "p" };
  }
  if (shouldValidateIsInCheck) {
    const isInCheck = getWillMovePutKingInCheck({ board, boardUpdates, playerTurn });
    if (isInCheck) {
      isValid = false;
      boardUpdates = {};
    }
  }
  return { isValid, boardUpdates };
};

/**
 * check if a pawn move is valid, but cannot set or unset en passant variables
 */
const getIsValidPawnMoveIgnoreEnPassant = ({
  playerTurn,
  board,
  origin,
  destination,
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
}): MoveValidatorResponse => {
  return getIsValidPawnMove({ playerTurn, board, origin, destination, canSetEnPassantVariables: false });
};

const getIsValidKnightMove = ({
  playerTurn,
  board,
  origin,
  destination,
  shouldValidateIsInCheck = true,
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
  shouldValidateIsInCheck?: boolean;
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  const isDestinationFriendlyFree = getIsDestinationFriendlyFree({ playerTurn, board, destination });
  const isKnightMove =
    (Math.abs(destination - origin) === 2 * tilesPerRow + 1 &&
      Math.abs((destination % tilesPerRow) - (origin % tilesPerRow)) === 1) ||
    (Math.abs(destination - origin) === 2 * tilesPerRow - 1 &&
      Math.abs((destination % tilesPerRow) - (origin % tilesPerRow)) === 1) ||
    (Math.abs(destination - origin) === tilesPerRow + 2 &&
      Math.abs((destination % tilesPerRow) - (origin % tilesPerRow)) === 2) ||
    (Math.abs(destination - origin) === tilesPerRow - 2 &&
      Math.abs((destination % tilesPerRow) - (origin % tilesPerRow)) === 2);
  const isKnightCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  if ((isDestinationFriendlyFree && isKnightMove) || (isDestinationFriendlyFree && isKnightMove && isKnightCapture)) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: playerTurn === "white" ? "N" : "n" };
  }
  if (shouldValidateIsInCheck) {
    const isInCheck = getWillMovePutKingInCheck({ board, boardUpdates, playerTurn });
    if (isInCheck) {
      isValid = false;
      boardUpdates = {};
    }
  }
  return { isValid, boardUpdates };
};

const getIsValidBishopMove = ({
  playerTurn,
  board,
  origin,
  destination,
  shouldValidateIsInCheck = true,
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
  shouldValidateIsInCheck?: boolean;
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  const isDestinationFriendlyFree = getIsDestinationFriendlyFree({ playerTurn, board, destination });
  const isDiagonalMove = getIsDiagonalMove({ origin, destination });
  const isDiagonalClear = getIsDiagonalClear({ board, origin, destination });
  const isDiagonalCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  if (
    (isDestinationFriendlyFree && isDiagonalMove && isDiagonalClear) ||
    (isDestinationFriendlyFree && isDiagonalMove && isDiagonalClear && isDiagonalCapture)
  ) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: playerTurn === "white" ? "B" : "b" };
  }
  if (shouldValidateIsInCheck) {
    const isInCheck = getWillMovePutKingInCheck({ board, boardUpdates, playerTurn });
    if (isInCheck) {
      isValid = false;
      boardUpdates = {};
    }
  }
  return { isValid, boardUpdates };
};

const getIsValidRookMove = ({
  playerTurn,
  board,
  origin,
  destination,
  shouldValidateIsInCheck = true,
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
  shouldValidateIsInCheck?: boolean;
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  const isDestinationFriendlyFree = getIsDestinationFriendlyFree({ playerTurn, board, destination });
  const isStraightMove = getIsStraightMove({ origin, destination });
  const isStraightClear = getIsStraightClear({ board, origin, destination });
  const isStraightCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  if (
    (isDestinationFriendlyFree && isStraightMove && isStraightClear) ||
    (isDestinationFriendlyFree && isStraightMove && isStraightClear && isStraightCapture)
  ) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: playerTurn === "white" ? "R" : "r" };
  }
  if (shouldValidateIsInCheck) {
    const isInCheck = getWillMovePutKingInCheck({ board, boardUpdates, playerTurn });
    if (isInCheck) {
      isValid = false;
      boardUpdates = {};
    }
  }
  return { isValid, boardUpdates };
};

const getIsValidQueenMove = ({
  playerTurn,
  board,
  origin,
  destination,
  shouldValidateIsInCheck = true,
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
  shouldValidateIsInCheck?: boolean;
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  const isDestinationFriendlyFree = getIsDestinationFriendlyFree({ playerTurn, board, destination });
  const isDiagonalMove = getIsDiagonalMove({ origin, destination });
  const isDiagonalClear = getIsDiagonalClear({ board, origin, destination });
  const isDiagonalCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  const isStraightMove = getIsStraightMove({ origin, destination });
  const isStraightClear = getIsStraightClear({ board, origin, destination });
  const isStraightCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  if (
    (isDestinationFriendlyFree && isDiagonalMove && isDiagonalClear) ||
    (isDestinationFriendlyFree && isDiagonalMove && isDiagonalClear && isDiagonalCapture) ||
    (isDestinationFriendlyFree && isStraightMove && isStraightClear) ||
    (isDestinationFriendlyFree && isStraightMove && isStraightClear && isStraightCapture)
  ) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: playerTurn === "white" ? "Q" : "q" };
  }
  if (shouldValidateIsInCheck) {
    const isInCheck = getWillMovePutKingInCheck({ board, boardUpdates, playerTurn });
    if (isInCheck) {
      isValid = false;
      boardUpdates = {};
    }
  }
  return { isValid, boardUpdates };
};

const getIsValidKingMove = ({
  playerTurn,
  board,
  origin,
  destination,
  shouldValidateIsInCheck = true,
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
  shouldValidateIsInCheck?: boolean;
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  const isDestinationFriendlyFree = getIsDestinationFriendlyFree({ playerTurn, board, destination });
  const isDiagonalMove = getIsDiagonalMove({ origin, destination });
  const isDiagonalMoveOneTile = Math.abs(destination - origin) === tilesPerRow + 1;
  const isDiagonalClear = getIsDiagonalClear({ board, origin, destination });
  const isDiagonalCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  const isStraightMove = getIsStraightMove({ origin, destination });
  const isStraightMoveOneTile = Math.abs(destination - origin) === tilesPerRow || Math.abs(destination - origin) === 1;
  const isStraightClear = getIsStraightClear({ board, origin, destination });
  const isStraightCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  if (
    (isDestinationFriendlyFree && isDiagonalMove && isDiagonalMoveOneTile && isDiagonalClear) ||
    (isDestinationFriendlyFree && isDiagonalMove && isDiagonalMoveOneTile && isDiagonalClear && isDiagonalCapture) ||
    (isDestinationFriendlyFree && isStraightMove && isStraightMoveOneTile && isStraightClear) ||
    (isDestinationFriendlyFree && isStraightMove && isStraightMoveOneTile && isStraightClear && isStraightCapture)
  ) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: playerTurn === "white" ? "K" : "k" };
  }
  if (shouldValidateIsInCheck) {
    const isInCheck = getWillMovePutKingInCheck({ board, boardUpdates, playerTurn });
    if (isInCheck) {
      isValid = false;
      boardUpdates = {};
    }
  }
  return { isValid, boardUpdates };
};

export const getIsValidMove = ({
  piece,
  board,
  playerTurn,
  origin,
  destination,
  shouldValidateIsInCheck = true,
}: {
  piece: SanPiece;
  board: SanPiece[];
  playerTurn: Player;
  origin: number;
  destination: number;
  shouldValidateIsInCheck?: boolean;
}): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  if (origin === destination) {
    return { isValid, boardUpdates };
  }
  if (playerTurn === "white") {
    switch (piece) {
      case "P":
        ({ isValid, boardUpdates } = getIsValidPawnMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "N":
        ({ isValid, boardUpdates } = getIsValidKnightMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "B":
        ({ isValid, boardUpdates } = getIsValidBishopMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "R":
        ({ isValid, boardUpdates } = getIsValidRookMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "Q":
        ({ isValid, boardUpdates } = getIsValidQueenMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "K":
        ({ isValid, boardUpdates } = getIsValidKingMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
    }
  } else {
    switch (piece) {
      case "p":
        if (playerTurn === "black") {
          ({ isValid, boardUpdates } = getIsValidPawnMove({
            playerTurn: "black",
            board,
            origin,
            destination,
          }));
        }
        break;
      case "n":
        ({ isValid, boardUpdates } = getIsValidKnightMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "b":
        ({ isValid, boardUpdates } = getIsValidBishopMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "r":
        ({ isValid, boardUpdates } = getIsValidRookMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "q":
        ({ isValid, boardUpdates } = getIsValidQueenMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      case "k":
        ({ isValid, boardUpdates } = getIsValidKingMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          shouldValidateIsInCheck,
        }));
        break;
      default:
        break;
    }
  }
  return { isValid, boardUpdates };
};

const getKingPosition = ({ playerTurn, board }: { playerTurn: Player; board: SanPiece[] }): number => {
  let kingPosition: number | null = null;
  const kingPiece = playerTurn === "white" ? "K" : "k";
  for (let i = 0; i < totalTiles; i++) {
    if (board[i] === kingPiece) {
      kingPosition = i;
    }
  }
  if (kingPosition === null) {
    throw new Error("King not found");
  }
  return kingPosition;
};

const getIsKingInCheck = ({ playerTurn, board }: { playerTurn: Player; board: SanPiece[] }): boolean => {
  let isInCheck: boolean = false;
  const kingPosition = getKingPosition({ playerTurn, board });
  const opponentPlayerTurn = playerTurn === "white" ? "black" : "white";
  for (let i = 0; i < totalTiles; i++) {
    const { isValid } = getIsValidMove({
      piece: board[i],
      board,
      playerTurn: opponentPlayerTurn,
      origin: i,
      destination: kingPosition,
      shouldValidateIsInCheck: false,
    });
    if (isValid) {
      isInCheck = true;
      break;
    }
  }
  return isInCheck;
};

const getWillMovePutKingInCheck = ({
  board,
  boardUpdates,
  playerTurn,
}: {
  board: SanPiece[];
  boardUpdates: Record<number, SanPiece>;
  playerTurn: Player;
}): boolean => {
  const tempBoard = [...board];
  Object.entries(boardUpdates).forEach(([index, piece]) => {
    tempBoard[Number(index)] = piece;
  });
  return getIsKingInCheck({ playerTurn, board: tempBoard });
};

export const getIsStalemate = ({ playerTurn, board }: { playerTurn: Player; board: SanPiece[] }): boolean => {
  let isCheckmate: boolean = true;
  for (let i = 0; i < totalTiles; i++) {
    if (board[i] !== " " && board[i] !== "K" && board[i] !== "k") {
      const validMoves = getAllValidPieceMoves({ piece: board[i], playerTurn, board, origin: i });
      if (validMoves.length > 0) {
        isCheckmate = false;
        break;
      }
    }
  }
  return isCheckmate;
};

export const getIsCheckmate = ({ playerTurn, board }: { playerTurn: Player; board: SanPiece[] }): boolean => {
  return getIsKingInCheck({ playerTurn, board }) && getIsStalemate({ playerTurn, board });
};

export const getAllValidPieceMoves = ({
  piece,
  playerTurn,
  board,
  origin,
}: {
  piece: SanPiece;
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
}): number[] => {
  let validMovesFn:
    | (({
        playerTurn,
        board,
        origin,
        destination,
      }: {
        playerTurn: Player;
        board: SanPiece[];
        origin: number;
        destination: number;
      }) => MoveValidatorResponse)
    | null = null;
  if (
    (playerTurn === "white" && !whiteSanPieces.includes(piece as SanPieceWhite)) ||
    (playerTurn === "black" && !blackSanPieces.includes(piece as SanPieceBlack))
  ) {
    return [];
  }
  switch (piece) {
    case "P":
    case "p":
      validMovesFn = getIsValidPawnMoveIgnoreEnPassant;
      break;
    case "N":
    case "n":
      validMovesFn = getIsValidKnightMove;
      break;
    case "B":
    case "b":
      validMovesFn = getIsValidBishopMove;
      break;
    case "R":
    case "r":
      validMovesFn = getIsValidRookMove;
      break;
    case "Q":
    case "q":
      validMovesFn = getIsValidQueenMove;
      break;
    case "K":
    case "k":
      validMovesFn = getIsValidKingMove;
      break;
    default:
      break;
  }
  let res: number[] = [];
  if (validMovesFn === null) {
    return res;
  }
  for (let i = 0; i < totalTiles; i++) {
    const { isValid } = validMovesFn({ playerTurn, board, origin, destination: i });
    if (isValid) {
      res = [...res, i];
    }
  }
  console.log(res);
  return res;
};

export const checkCanMakeMove = ({
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
  if (
    origin === destination ||
    (playerTurn === "white" && !whiteSanPieces.includes(piece as SanPieceWhite)) ||
    (playerTurn === "black" && !blackSanPieces.includes(piece as SanPieceBlack))
  ) {
    return { isValid: false, boardUpdates: {} };
  }
  return getIsValidMove({ piece, board, playerTurn, origin, destination });
};
