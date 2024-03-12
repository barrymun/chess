import { GameRecord, Player } from "common";

export type Appearance = "light" | "dark";
export type LocalStorageKeys = "appearance" | "playerId" | "singleplayerGameRecord";
export interface GetPlayerIdResponse {
  playerId: string;
}
export interface FindGameResponse {
  playerId: string;
  playerColour: Player;
  gameId: string;
  gameRecord: GameRecord;
}
export interface QuitGameResponse {}
export interface ForfeitGameResponse {}
