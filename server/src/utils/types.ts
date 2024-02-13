import { Player } from "common/build/types";
import { Request } from "express";

export interface CustomReq<T> extends Request {
  body: T;
}
export interface PlayerRecord {
  player: Player;
  gameRecordId: string;
}
export interface GameRecord {
  id: string;
}
