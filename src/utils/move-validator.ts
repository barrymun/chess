import { Player, SanPiece, tilesPerRow } from "utils";

const isValidPawnMove = ({
  player,
  // board,
  origin,
  destination,
}: {
  player: Player;
  board: SanPiece[];
  origin: number;
  destination: number;
}): boolean => {
  // console.log(origin, destination);
  let res: boolean = false;
  if (player === "white") {
    if (origin - 2 * tilesPerRow === destination) {
      // handle white first move
      console.log("white first move");
      res = true;
    } else if (origin - tilesPerRow === destination) {
      // handle white normal move
      console.log("white normal move");
      res = true;
    }
  } else {
    if (origin + 2 * tilesPerRow === destination) {
      // handle black first move
      console.log("black first move");
      res = true;
    } else if (origin + tilesPerRow === destination) {
      // handle black normal move
      console.log("black normal move");
      res = true;
    }
  }
  return res;
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
}): boolean => {
  let res: boolean = false;
  switch (piece) {
    case "P":
      res = isValidPawnMove({ player: "white", board, origin, destination });
      break;
    case "N":
      // res = isValidKnightMove({ board, origin, destination });
      break;
    case "B":
      // res = isValidBishopMove({ board, origin, destination });
      break;
    case "R":
      // res = isValidRookMove({ board, origin, destination });
      break;
    case "Q":
      // res = isValidQueenMove({ board, origin, destination });
      break;
    case "K":
      // res = isValidKingMove({ board, origin, destination });
      break;
    case "p":
      res = isValidPawnMove({ player: "black", board, origin, destination });
      break;
    case "n":
      // res = isValidKnightMove({ board, origin, destination });
      break;
    case "b":
      // res = isValidBishopMove({ board, origin, destination });
      break;
    case "r":
      // res = isValidRookMove({ board, origin, destination });
      break;
    case "q":
      // res = isValidQueenMove({ board, origin, destination });
      break;
    case "k":
      // res = isValidKingMove({ board, origin, destination });
      break;
    default:
      res = false;
      break;
  }
  return res;
};
