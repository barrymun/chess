import { Player } from "common/build/types";
import { Request } from "express";

export interface CustomReq<T> extends Request {
  body: T;
}
export type RedisSets = "players" | "games" | "lookingForGames";
export interface PlayerRecord {
  playerColour: Player;
  gameRecordId: string | null;
}
