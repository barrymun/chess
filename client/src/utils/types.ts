import { BoardStateProps, GameRecord, Player, SanPiece } from "common/build/types";

export interface MoveValidatorResponse extends Omit<BoardStateProps, "board"> {
  isValid: boolean;
  boardUpdates: Record<number, SanPiece>;
}

export interface ValidMoveProps extends BoardStateProps {
  playerTurn: Player;
  origin: number;
  destination: number;
}

export interface ValidMoveWithSimulatedProps extends ValidMoveProps {
  isSimulatedMove?: boolean;
}
export type Appearance = "light" | "dark";
export type LocalStorageKeys = "appearance" | "playerId";
export interface GetPlayerIdResponse {
  playerId: string;
}
export interface FindGameResponse {
  playerId: string;
  gameId: string;
  gameRecord: GameRecord;
}
