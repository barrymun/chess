import { BoardStateProps, Player, SanPiece } from "common/build/types";

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
// TODO: this will be updated in the future when more game over states are added
export interface GameOverProps {
  isGameOver: boolean;
  winner: Player | null;
  reason: "checkmate" | "insufficient material" | "stalemate" | "draw";
}
export interface LastMoveProps {
  origin: number;
  destination: number;
}
export type MoveHistoryProps = {
  [T in Player]: {
    moves: LastMoveProps[];
    algebraicNotationMoves: string[];
  };
};
export type Appearance = "light" | "dark";
export type LocalStorageKeys = "appearance" | "playerId";
export interface GetPlayerIdResponse {
  playerId: string;
}
