// TODO: move to "common" tests
import { defaultBoard, defaultBoardState } from "common/build/config";
import { computeCanMakeMove } from "common/build/move-validator";

describe("computeCanMakeMove", () => {
  it("should return an invalid move when the piece is not the player's", () => {
    const origin = 0;
    const destination = 8;
    const playerTurn = "white";
    const piece = defaultBoard[origin];
    const { isValid } = computeCanMakeMove({
      ...defaultBoardState,
      board: defaultBoard,
      piece,
      playerTurn,
      origin,
      destination,
    });
    expect(isValid).toBe(false);
  });

  it("should return an invalid move when the destination is the same as the origin", () => {
    const origin = 0;
    const destination = 0;
    const playerTurn = "white";
    const piece = defaultBoard[origin];
    const { isValid } = computeCanMakeMove({
      ...defaultBoardState,
      board: defaultBoard,
      piece,
      playerTurn,
      origin,
      destination,
    });
    expect(isValid).toBe(false);
  });

  it("should return an invalid move when the piece is not moving", () => {
    const origin = 0;
    const destination = 1;
    const playerTurn = "white";
    const piece = defaultBoard[origin];
    const { isValid } = computeCanMakeMove({
      ...defaultBoardState,
      board: defaultBoard,
      piece,
      playerTurn,
      origin,
      destination,
    });
    expect(isValid).toBe(false);
  });

  it("should return an invalid move when the piece is moving to an invalid position", () => {
    const origin = 0;
    const destination = 16;
    const playerTurn = "black";
    const piece = defaultBoard[origin];
    const { isValid } = computeCanMakeMove({
      ...defaultBoardState,
      board: defaultBoard,
      piece,
      playerTurn,
      origin,
      destination,
    });
    expect(isValid).toBe(false);
  });

  it("should return a valid move when the pawn is moving to a valid position, 1 step from first move", () => {
    const origin = 48;
    const destination = 40;
    const playerTurn = "white";
    const piece = defaultBoard[origin];
    const { isValid } = computeCanMakeMove({
      ...defaultBoardState,
      board: defaultBoard,
      piece,
      playerTurn,
      origin,
      destination,
    });
    expect(isValid).toBe(true);
  });

  it("should return a valid move when the pawn is moving to a valid position, 2 steps from first move", () => {
    const origin = 48;
    const destination = 32;
    const playerTurn = "white";
    const piece = defaultBoard[origin];
    const { isValid } = computeCanMakeMove({
      ...defaultBoardState,
      board: defaultBoard,
      piece,
      playerTurn,
      origin,
      destination,
    });
    expect(isValid).toBe(true);
  });

  it("should return invalid when pawn is moving 2 steps but it is not the pawn's first move", () => {
    // first move (white)
    let origin = 48;
    let destination = 40;
    let board = defaultBoard;
    let res = computeCanMakeMove({
      ...defaultBoardState,
      board,
      piece: defaultBoard[origin],
      playerTurn: "white",
      origin,
      destination,
    });
    board = board.map((piece, index) => res.boardUpdates[index] ?? piece);
    // second move (black)
    origin = 8;
    destination = 16;
    res = computeCanMakeMove({
      ...defaultBoardState,
      ...res,
      board,
      piece: board[destination],
      playerTurn: "black",
      origin,
      destination,
    });
    board = board.map((piece, index) => res.boardUpdates[index] ?? piece);
    // third move (white) - attempting to move 2 steps
    origin = 40;
    destination = 24;
    const { isValid } = computeCanMakeMove({
      ...defaultBoardState,
      ...res,
      board,
      piece: board[origin],
      playerTurn: "white",
      origin,
      destination,
    });
    expect(isValid).toBe(false);
  });
});
