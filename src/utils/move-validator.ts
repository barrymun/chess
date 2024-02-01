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
let whiteKingHasMoved: boolean = false;
let blackKingHasMoved: boolean = false;
let whiteLeftRookHasMoved: boolean = false; // a1
let whiteRightRookHasMoved: boolean = false; // h1
let blackLeftRookHasMoved: boolean = false; // a8
let blackRightRookHasMoved: boolean = false; // h8

interface MoveValidatorResponse {
  isValid: boolean;
  boardUpdates: Record<number, SanPiece>;
}

interface ValidMoveProps {
  playerTurn: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
}

interface ValidMoveWithSimulatedProps extends ValidMoveProps {
  isSimulatedMove?: boolean;
}

const getUpdatedBoardRepresentation = ({
  board,
  boardUpdates,
}: {
  board: SanPiece[];
  boardUpdates: Record<number, SanPiece>;
}): SanPiece[] => {
  const tempBoard = [...board];
  Object.entries(boardUpdates).forEach(([index, piece]) => {
    tempBoard[Number(index)] = piece;
  });
  return tempBoard;
};

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
    // horizontal move
    const start = Math.min(colStart, colEnd);
    const end = Math.max(colStart, colEnd);
    for (let col = start + 1; col < end; col++) {
      const position = rowStart * tilesPerRow + col;
      if (board[position] !== " ") {
        return false;
      }
    }
  } else if (colStart === colEnd) {
    // vertical move
    const start = Math.min(rowStart, rowEnd);
    const end = Math.max(rowStart, rowEnd);
    for (let row = start + 1; row < end; row++) {
      const position = row * tilesPerRow + colStart;
      if (board[position] !== " ") {
        return false;
      }
    }
  } else {
    // invalid move (not horizontal or vertical)
    return false;
  }
  return true;
};

const getCanCastle = ({ playerTurn, board, origin, destination }: ValidMoveProps): boolean => {
  let canCastle: boolean = false;
  if (playerTurn === "white") {
    if (
      origin === 60 &&
      destination === 62 &&
      !whiteKingHasMoved &&
      !whiteRightRookHasMoved &&
      board[61] === " " &&
      board[62] === " " &&
      !getIsKingInCheck({ playerTurn, board }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 60: " ", 61: "K" } }),
      }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 60: " ", 61: " ", 62: "K" } }),
      })
    ) {
      canCastle = true;
    } else if (
      origin === 60 &&
      destination === 58 &&
      !whiteKingHasMoved &&
      !whiteLeftRookHasMoved &&
      board[59] === " " &&
      board[58] === " " &&
      board[57] === " " &&
      !getIsKingInCheck({ playerTurn, board }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 60: " ", 59: "K" } }),
      }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 60: " ", 59: " ", 58: "K" } }),
      }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 60: " ", 59: " ", 58: " ", 57: "K" } }),
      })
    ) {
      canCastle = true;
    }
  } else if (playerTurn === "black") {
    if (
      origin === 4 &&
      destination === 6 &&
      !blackKingHasMoved &&
      !blackRightRookHasMoved &&
      board[5] === " " &&
      board[6] === " " &&
      !getIsKingInCheck({ playerTurn, board }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 4: " ", 5: "k" } }),
      }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 4: " ", 5: " ", 6: "k" } }),
      })
    ) {
      canCastle = true;
    } else if (
      origin === 4 &&
      destination === 2 &&
      !blackKingHasMoved &&
      !blackLeftRookHasMoved &&
      board[3] === " " &&
      board[2] === " " &&
      board[1] === " " &&
      !getIsKingInCheck({ playerTurn, board }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 4: " ", 3: "k" } }),
      }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 4: " ", 3: " ", 2: "k" } }),
      }) &&
      !getIsKingInCheck({
        playerTurn,
        board: getUpdatedBoardRepresentation({ board, boardUpdates: { 4: " ", 3: " ", 2: " ", 1: "k" } }),
      })
    ) {
      canCastle = true;
    }
  }
  return canCastle;
};

const getIsValidPawnMove = ({
  playerTurn,
  board,
  origin,
  destination,
  isSimulatedMove = false,
  canSetEnPassantVars = true,
}: ValidMoveWithSimulatedProps & { canSetEnPassantVars?: boolean }): MoveValidatorResponse => {
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
    if (canSetEnPassantVars) {
      isLastMoveVulnerableToEnPassant = true;
      enPassantCapturePieceIndex = destination;
    }
  } else if (origin + multiplier * tilesPerRow === destination && board[destination] === " ") {
    // handle normal move
    isValid = true;
    if (canSetEnPassantVars) {
      isLastMoveVulnerableToEnPassant = false;
      enPassantCapturePieceIndex = null;
    }
  } else if ((isNormalLeftCapture || isNormalRightCapture) && board[destination] !== " " && isDestinationFriendlyFree) {
    // handle normal left/right capture
    isValid = true;
    if (canSetEnPassantVars) {
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
      if (canSetEnPassantVars) {
        isLastMoveVulnerableToEnPassant = false;
        enPassantCapturePieceIndex = null;
      }
    }
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: playerTurn === "white" ? "P" : "p" };
  }
  if (!isSimulatedMove) {
    const isInCheck = getWillMovePutKingInCheck({ board, boardUpdates, playerTurn });
    if (isInCheck) {
      isValid = false;
      boardUpdates = {};
    }
  }
  return { isValid, boardUpdates };
};

const getIsValidPawnMoveIgnoreEnPassant = ({
  playerTurn,
  board,
  origin,
  destination,
  isSimulatedMove = false,
}: ValidMoveWithSimulatedProps): MoveValidatorResponse => {
  return getIsValidPawnMove({
    playerTurn,
    board,
    origin,
    destination,
    isSimulatedMove,
    canSetEnPassantVars: false,
  });
};

const getIsValidKnightMove = ({
  playerTurn,
  board,
  origin,
  destination,
  isSimulatedMove = false,
}: ValidMoveWithSimulatedProps): MoveValidatorResponse => {
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
  if (!isSimulatedMove) {
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
  isSimulatedMove = false,
}: ValidMoveWithSimulatedProps): MoveValidatorResponse => {
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
  if (!isSimulatedMove) {
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
  isSimulatedMove = false,
}: ValidMoveWithSimulatedProps): MoveValidatorResponse => {
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
  if (!isSimulatedMove) {
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
  isSimulatedMove = false,
}: ValidMoveWithSimulatedProps): MoveValidatorResponse => {
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
  if (!isSimulatedMove) {
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
  isSimulatedMove = false,
  canSetCastlingVars = true,
}: ValidMoveWithSimulatedProps & { canSetCastlingVars?: boolean }): MoveValidatorResponse => {
  let isValid: boolean = false;
  let boardUpdates: Record<number, SanPiece> = {};
  if (
    playerTurn === "white" &&
    origin === 60 &&
    destination === 62 &&
    getCanCastle({ playerTurn, board, origin, destination })
  ) {
    isValid = true;
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: "K", [61]: "R", [63]: " " };
    if (canSetCastlingVars) {
      whiteKingHasMoved = true;
      whiteRightRookHasMoved = true;
    }
  } else if (
    playerTurn === "white" &&
    origin === 60 &&
    destination === 58 &&
    getCanCastle({ playerTurn, board, origin, destination })
  ) {
    isValid = true;
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: "K", [59]: "R", [56]: " " };
    if (canSetCastlingVars) {
      whiteKingHasMoved = true;
      whiteLeftRookHasMoved = true;
    }
  } else if (
    playerTurn === "black" &&
    origin === 4 &&
    destination === 6 &&
    getCanCastle({ playerTurn, board, origin, destination })
  ) {
    isValid = true;
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: "k", [5]: "r", [7]: " " };
    if (canSetCastlingVars) {
      blackKingHasMoved = true;
      blackRightRookHasMoved = true;
    }
  } else if (
    playerTurn === "black" &&
    origin === 4 &&
    destination === 2 &&
    getCanCastle({ playerTurn, board, origin, destination })
  ) {
    isValid = true;
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: "k", [3]: "r", [0]: " " };
    if (canSetCastlingVars) {
      blackKingHasMoved = true;
      blackLeftRookHasMoved = true;
    }
  }
  if (isValid) {
    return { isValid, boardUpdates };
  }
  const isDestinationFriendlyFree = getIsDestinationFriendlyFree({ playerTurn, board, destination });
  const isDiagonalMove = getIsDiagonalMove({ origin, destination });
  const isDiagonalClear = getIsDiagonalClear({ board, origin, destination });
  const isDiagonalCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  const isStraightMove = getIsStraightMove({ origin, destination });
  const isStraightClear = getIsStraightClear({ board, origin, destination });
  const isStraightCapture = getIsCapturingEnemyPiece({ playerTurn, board, destination });
  const isOneTileMove =
    Math.abs(destination - origin) === tilesPerRow || // vertical move
    Math.abs(destination - origin) === 1 || // horizontal move
    Math.abs(destination - origin) === tilesPerRow - 1 || // diagonal move (up-left or up-right)
    Math.abs(destination - origin) === tilesPerRow + 1; // diagonal move (down-left or down-right)
  if (
    (isDestinationFriendlyFree && isDiagonalMove && isOneTileMove && isDiagonalClear) ||
    (isDestinationFriendlyFree && isDiagonalMove && isOneTileMove && isDiagonalClear && isDiagonalCapture) ||
    (isDestinationFriendlyFree && isStraightMove && isOneTileMove && isStraightClear) ||
    (isDestinationFriendlyFree && isStraightMove && isOneTileMove && isStraightClear && isStraightCapture)
  ) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: playerTurn === "white" ? "K" : "k" };
  }
  if (!isSimulatedMove) {
    const isInCheck = getWillMovePutKingInCheck({ board, boardUpdates, playerTurn });
    if (isInCheck) {
      isValid = false;
      boardUpdates = {};
    }
  }
  return { isValid, boardUpdates };
};

const getIsValidKingMoveIgnoreCastling = ({
  playerTurn,
  board,
  origin,
  destination,
  isSimulatedMove = false,
}: ValidMoveWithSimulatedProps): MoveValidatorResponse => {
  return getIsValidKingMove({
    playerTurn,
    board,
    origin,
    destination,
    isSimulatedMove,
    canSetCastlingVars: false,
  });
};

export const getIsValidMove = ({
  playerTurn,
  board,
  origin,
  destination,
  isSimulatedMove = false,
  piece,
}: ValidMoveWithSimulatedProps & { piece: SanPiece }): MoveValidatorResponse => {
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
          isSimulatedMove,
        }));
        break;
      case "N":
        ({ isValid, boardUpdates } = getIsValidKnightMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          isSimulatedMove,
        }));
        break;
      case "B":
        ({ isValid, boardUpdates } = getIsValidBishopMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          isSimulatedMove,
        }));
        break;
      case "R":
        ({ isValid, boardUpdates } = getIsValidRookMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          isSimulatedMove,
        }));
        break;
      case "Q":
        ({ isValid, boardUpdates } = getIsValidQueenMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          isSimulatedMove,
        }));
        break;
      case "K":
        ({ isValid, boardUpdates } = getIsValidKingMove({
          playerTurn: "white",
          board,
          origin,
          destination,
          isSimulatedMove,
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
          isSimulatedMove,
        }));
        break;
      case "b":
        ({ isValid, boardUpdates } = getIsValidBishopMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          isSimulatedMove,
        }));
        break;
      case "r":
        ({ isValid, boardUpdates } = getIsValidRookMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          isSimulatedMove,
        }));
        break;
      case "q":
        ({ isValid, boardUpdates } = getIsValidQueenMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          isSimulatedMove,
        }));
        break;
      case "k":
        ({ isValid, boardUpdates } = getIsValidKingMove({
          playerTurn: "black",
          board,
          origin,
          destination,
          isSimulatedMove,
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
      isSimulatedMove: true,
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
  return getIsKingInCheck({ playerTurn, board: getUpdatedBoardRepresentation({ board, boardUpdates }) });
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
        isSimulatedMove,
      }: {
        playerTurn: Player;
        board: SanPiece[];
        origin: number;
        destination: number;
        isSimulatedMove?: boolean;
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
      validMovesFn = getIsValidKingMoveIgnoreCastling;
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

export const computeCanMakeMove = ({
  playerTurn,
  board,
  origin,
  destination,
  piece,
}: ValidMoveProps & { piece: SanPiece }): MoveValidatorResponse => {
  if (
    origin === destination ||
    (playerTurn === "white" && !whiteSanPieces.includes(piece as SanPieceWhite)) ||
    (playerTurn === "black" && !blackSanPieces.includes(piece as SanPieceBlack))
  ) {
    return { isValid: false, boardUpdates: {} };
  }
  const res = getIsValidMove({ piece, board, playerTurn, origin, destination });
  if (res.isValid) {
    switch (origin) {
      case 0:
        blackRightRookHasMoved = true;
        break;
      case 7:
        blackLeftRookHasMoved = true;
        break;
      case 4:
        blackKingHasMoved = true;
        break;
      case 56:
        whiteLeftRookHasMoved = true;
        break;
      case 63:
        whiteRightRookHasMoved = true;
        break;
      case 60:
        whiteKingHasMoved = true;
        break;
      default:
        break;
    }
  }
  return res;
};
