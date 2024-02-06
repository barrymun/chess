import { MoveHistoryProps } from "utils";

export const mergeMoveHistory = (moveHistory: MoveHistoryProps): string[][] => {
  let res: string[][] = [];
  moveHistory.white.map((move, index) => {
    const blackMove = moveHistory.black.length === index ? "" : moveHistory.black[index].origin.toString();
    res = [...res, [move.destination.toString(), blackMove]];
  });
  return res;
};
