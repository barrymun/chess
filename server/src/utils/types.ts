import { Request } from "express";

export interface CustomReq<T> extends Request {
  body: T;
}
export interface PlayerRecord {
  player: "white" | "black"; // TODO: need a "common" module for types
  gameRecordId: string;
}
export interface GameRecord {
  id: string;
}
