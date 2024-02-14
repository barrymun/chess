import { BoardStateProps, Player } from "common/build/types";
import { Request } from "express";

export interface CustomReq<T> extends Request {
  body: T;
}
export interface PlayerRecord {
  playerColour: Player;
  gameRecordId: string;
}
export interface GameRecord {
  boardState: BoardStateProps;
}
