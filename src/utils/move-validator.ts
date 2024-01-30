import { Player, SanPiece, SanPieceBlack, SanPieceWhite, blackSanPieces, tilesPerRow, whiteSanPieces } from "utils";

let isLastMoveVulnerableToEnPassant: boolean = false;
let enPassantCapturePieceIndex: number | null = null;
// let lastMoveDestinationIndex: number | null = null;

interface MoveValidatorResponse {
  isValid: boolean;
  boardUpdates: Record<number, SanPiece>;
}

const getPlayerMultiplier = (player: Player): number => (player === "white" ? -1 : 1);

const getIsCapturingEnemyPiece = ({
  player,
  board,
  destination,
}: {
  player: Player;
  board: SanPiece[];
  destination: number;
}): boolean => {
  const isCapturingEnemyPiece =
    player === "white"
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
  console.log(direction);
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
        console.log(i);
        if (board[i] !== " " && i !== origin && i !== destination) {
          isDiagonalClear = false;
        }
      }
      break;
    case "up-right":
      for (let i = start; i <= end; i = i + tilesPerRow - 1) {
        console.log(i);
        if (board[i] !== " " && i !== origin && i !== destination) {
          isDiagonalClear = false;
        }
      }
      break;
    case "down-left":
      for (let i = start; i <= end; i = i + tilesPerRow - 1) {
        console.log(i);
        if (board[i] !== " " && i !== origin && i !== destination) {
          isDiagonalClear = false;
        }
      }
      break;
    case "down-right":
      for (let i = start; i <= end; i = i + tilesPerRow + 1) {
        console.log(i);
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
  console.log(direction);
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
        console.log(i);
        if (board[i] !== " " && i !== origin && i !== destination) {
          isStraightClear = false;
        }
      }
      break;
    case "down":
      for (let i = end; i >= start; i -= tilesPerRow) {
        console.log(i);
        if (board[i] !== " " && i !== origin && i !== destination) {
          isStraightClear = false;
        }
      }
      break;
    case "left":
      for (let i = end; i >= start; i -= 1) {
        console.log(i);
        if (board[i] !== " " && i !== origin && i !== destination) {
          isStraightClear = false;
        }
      }
      break;
    case "right":
      for (let i = start; i <= end; i += 1) {
        console.log(i);
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

const getIsValidBishopMove = ({
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
  if (origin === destination) {
    return { isValid, boardUpdates };
  }
  const isDiagonalMove = getIsDiagonalMove({ origin, destination });
  const isDiagonalClear = getIsDiagonalClear({ board, origin, destination });
  const destinationNotOccupiedByFriendlyPiece =
    player === "white"
      ? !whiteSanPieces.includes(board[destination] as SanPieceWhite)
      : !blackSanPieces.includes(board[destination] as SanPieceBlack);
  const isDiagonalCapture = getIsCapturingEnemyPiece({ player, board, destination });
  if (
    (isDiagonalMove && isDiagonalClear && destinationNotOccupiedByFriendlyPiece) ||
    (isDiagonalMove && isDiagonalClear && destinationNotOccupiedByFriendlyPiece && isDiagonalCapture)
  ) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: player === "white" ? "B" : "b" };
  }
  return { isValid, boardUpdates };
};

const getIsValidRookMove = ({
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
  if (origin === destination) {
    return { isValid, boardUpdates };
  }
  const isStraightMove = getIsStraightMove({ origin, destination });
  const isStraightClear = getIsStraightClear({ board, origin, destination });
  const destinationNotOccupiedByFriendlyPiece =
    player === "white"
      ? !whiteSanPieces.includes(board[destination] as SanPieceWhite)
      : !blackSanPieces.includes(board[destination] as SanPieceBlack);
  const isStraightCapture = getIsCapturingEnemyPiece({ player, board, destination });
  if (
    (isStraightMove && isStraightClear && destinationNotOccupiedByFriendlyPiece) ||
    (isStraightMove && isStraightClear && destinationNotOccupiedByFriendlyPiece && isStraightCapture)
  ) {
    isValid = true;
  }
  if (isValid) {
    boardUpdates = { ...boardUpdates, [origin]: " ", [destination]: player === "white" ? "R" : "r" };
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
  switch (piece) {
    case "P":
      if (playerTurn === "white") {
        ({ isValid, boardUpdates } = getIsValidPawnMove({
          player: "white",
          board,
          origin,
          destination,
        }));
      }
      break;
    case "N":
      // isValid = getIsValidKnightMove({ board, origin, destination });
      break;
    case "B":
      if (playerTurn === "white") {
        ({ isValid, boardUpdates } = getIsValidBishopMove({ player: "white", board, origin, destination }));
      }
      break;
    case "R":
      if (playerTurn === "white") {
        ({ isValid, boardUpdates } = getIsValidRookMove({ player: "white", board, origin, destination }));
      }
      break;
    case "Q":
      // isValid = getIsValidQueenMove({ board, origin, destination });
      break;
    case "K":
      // isValid = getIsValidKingMove({ board, origin, destination });
      break;
    case "p":
      if (playerTurn === "black") {
        ({ isValid, boardUpdates } = getIsValidPawnMove({
          player: "black",
          board,
          origin,
          destination,
        }));
      }
      break;
    case "n":
      // isValid = getIsValidKnightMove({ board, origin, destination });
      break;
    case "b":
      if (playerTurn === "black") {
        ({ isValid, boardUpdates } = getIsValidBishopMove({ player: "black", board, origin, destination }));
      }
      break;
    case "r":
      if (playerTurn === "black") {
        ({ isValid, boardUpdates } = getIsValidRookMove({ player: "black", board, origin, destination }));
      }
      break;
    case "q":
      // isValid = getIsValidQueenMove({ board, origin, destination });
      break;
    case "k":
      // isValid = getIsValidKingMove({ board, origin, destination });
      break;
    default:
      break;
  }
  return { isValid, boardUpdates };
};
