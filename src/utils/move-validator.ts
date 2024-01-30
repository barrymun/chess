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
  return (
    Math.abs(destination - origin) % (tilesPerRow - 1) === 0 || Math.abs(destination - origin) % (tilesPerRow + 1) === 0
  );
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
  let start = origin;
  let end = destination;
  if (end < start) {
    start = destination;
    end = origin;
  }
  let isDiagonalClear: boolean = true;
  switch (direction) {
    case "up-left":
      for (let i = start; i <= end; i = i + tilesPerRow + 1) {
        if (board[i] !== " " && i !== origin && i !== destination) {
          isDiagonalClear = false;
        }
      }
      break;
    case "up-right":
      for (let i = start; i <= end; i = i + tilesPerRow - 1) {
        if (board[i] !== " " && i !== origin && i !== destination) {
          isDiagonalClear = false;
        }
      }
      break;
    case "down-left":
      for (let i = start; i <= end; i = i + tilesPerRow - 1) {
        if (board[i] !== " " && i !== origin && i !== destination) {
          isDiagonalClear = false;
        }
      }
      break;
    case "down-right":
      for (let i = start; i <= end; i = i + tilesPerRow + 1) {
        if (board[i] !== " " && i !== origin && i !== destination) {
          isDiagonalClear = false;
        }
      }
      break;
    default:
      break;
  }
  return isDiagonalClear;
};

const getIsStraightMove = ({ origin, destination }: { origin: number; destination: number }): boolean => {
  return (
    Math.abs(destination - origin) % tilesPerRow === 0 ||
    Math.abs(destination - origin) <= tilesPerRow ||
    Math.abs(destination - origin) % tilesPerRow === 0
  );
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
  let direction: "up" | "down" | "left" | "right" | null = null;
  if (origin < destination && (destination - origin) % tilesPerRow === 0) {
    direction = "down";
  } else if (origin > destination && (destination - origin) % tilesPerRow === 0) {
    direction = "up";
  } else if (origin < destination && destination < origin + tilesPerRow - 1) {
    direction = "right";
  } else if (origin > destination && destination < origin + tilesPerRow - 1) {
    direction = "left";
  }
  if (direction === null) {
    return false;
  }
  let start = origin;
  let end = destination;
  if (end < start) {
    start = destination;
    end = origin;
  }
  let isStraightClear: boolean = true;
  switch (direction) {
    case "up":
      for (let i = start; i <= end; i += tilesPerRow) {
        if (board[i] !== " " && i !== origin && i !== destination) {
          isStraightClear = false;
        }
      }
      break;
    case "down":
      for (let i = end; i >= start; i -= tilesPerRow) {
        if (board[i] !== " " && i !== origin && i !== destination) {
          isStraightClear = false;
        }
      }
      break;
    case "left":
      for (let i = end; i >= start; i -= 1) {
        if (board[i] !== " " && i !== origin && i !== destination) {
          isStraightClear = false;
        }
      }
      break;
    case "right":
      for (let i = start; i <= end; i += 1) {
        if (board[i] !== " " && i !== origin && i !== destination) {
          isStraightClear = false;
        }
      }
      break;
    default:
      break;
  }
  return isStraightClear;
};

const getIsValidPawnMove = ({
  playerTurn,
  board,
  origin,
  destination,
  canSetEnPassantVariables = true,
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
  canSetEnPassantVariables?: boolean;
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
  // lastMoveDestinationIndex = destination;
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
}: {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
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
  return { isValid, boardUpdates };
};

const getIsValidBishopMove = ({
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
  return { isValid, boardUpdates };
};

const getIsValidRookMove = ({
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
  return { isValid, boardUpdates };
};

const getIsValidQueenMove = ({
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
  return { isValid, boardUpdates };
};

const getIsValidKingMove = ({
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
  return { isValid, boardUpdates };
};

export const getIsValidMove = ({
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
        }));
        break;
      case "N":
        ({ isValid, boardUpdates } = getIsValidKnightMove({ playerTurn: "white", board, origin, destination }));
        break;
      case "B":
        ({ isValid, boardUpdates } = getIsValidBishopMove({ playerTurn: "white", board, origin, destination }));
        break;
      case "R":
        ({ isValid, boardUpdates } = getIsValidRookMove({ playerTurn: "white", board, origin, destination }));
        break;
      case "Q":
        ({ isValid, boardUpdates } = getIsValidQueenMove({ playerTurn: "white", board, origin, destination }));
        break;
      case "K":
        ({ isValid, boardUpdates } = getIsValidKingMove({ playerTurn: "white", board, origin, destination }));
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
        ({ isValid, boardUpdates } = getIsValidKnightMove({ playerTurn: "black", board, origin, destination }));
        break;
      case "b":
        ({ isValid, boardUpdates } = getIsValidBishopMove({ playerTurn: "black", board, origin, destination }));
        break;
      case "r":
        ({ isValid, boardUpdates } = getIsValidRookMove({ playerTurn: "black", board, origin, destination }));
        break;
      case "q":
        ({ isValid, boardUpdates } = getIsValidQueenMove({ playerTurn: "black", board, origin, destination }));
        break;
      case "k":
        ({ isValid, boardUpdates } = getIsValidKingMove({ playerTurn: "black", board, origin, destination }));
        break;
      default:
        break;
    }
  }
  return { isValid, boardUpdates };
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
  if (playerTurn === "white" && !whiteSanPieces.includes(piece as SanPieceWhite)) {
    return [];
  } else if (playerTurn === "black" && !blackSanPieces.includes(piece as SanPieceBlack)) {
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
