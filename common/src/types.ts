export type Player = "white" | "black";
export type TileColor = "light" | "dark";
export type SanPawnWhite = "P";
export type SanKnightWhite = "N";
export type SanBishopWhite = "B";
export type SanRookWhite = "R";
export type SanQueenWhite = "Q";
export type SanKingWhite = "K";
export type SanPawnBlack = "p";
export type SanKnightBlack = "n";
export type SanBishopBlack = "b";
export type SanRookBlack = "r";
export type SanQueenBlack = "q";
export type SanKingBlack = "k";
export type SanPieceEmpty = " ";
export type SanPiece =
  | SanPawnWhite
  | SanPawnBlack
  | SanKnightWhite
  | SanKnightBlack
  | SanBishopWhite
  | SanBishopBlack
  | SanRookWhite
  | SanRookBlack
  | SanQueenWhite
  | SanQueenBlack
  | SanKingWhite
  | SanKingBlack
  | SanPieceEmpty;
export type SanPieceWhite =
  | SanPawnWhite
  | SanKnightWhite
  | SanBishopWhite
  | SanRookWhite
  | SanQueenWhite
  | SanKingWhite;
export type SanPieceBlack =
  | SanPawnBlack
  | SanKnightBlack
  | SanBishopBlack
  | SanRookBlack
  | SanQueenBlack
  | SanKingBlack;
export interface BoardStateProps {
  board: SanPiece[];
  isLastMoveVulnerableToEnPassant: boolean;
  enPassantCapturePieceIndex: number | null;
  whiteKingHasMoved: boolean;
  whiteLeftRookHasMoved: boolean;
  whiteRightRookHasMoved: boolean;
  blackKingHasMoved: boolean;
  blackLeftRookHasMoved: boolean;
  blackRightRookHasMoved: boolean;
  pawnPromotionPieceIndex: number | null;
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
// TODO: this will be updated in the future when more game over states are added
export interface GameOverProps {
  isGameOver: boolean;
  winner: Player | null;
  reason: "checkmate" | "insufficient material" | "stalemate" | "draw" | "forfeit";
}
export interface GameRecord {
  boardState: BoardStateProps;
  lastMovedPiece: LastMoveProps | null;
  playerTurn: Player;
  pawnPromotionPieceSelection:
    | SanBishopBlack
    | SanBishopWhite
    | SanKnightBlack
    | SanKnightWhite
    | SanQueenBlack
    | SanQueenWhite
    | SanRookBlack
    | SanRookWhite
    | null;
  showPawnPromotionModal: boolean;
  selectedPieceLegalMoves: number[];
  moveHistory: MoveHistoryProps;
  gameOver: GameOverProps;
}
export interface ValidMoveProps extends BoardStateProps {
  playerTurn: Player;
  origin: number;
  destination: number;
}
export interface ValidMoveWithSimulatedProps extends ValidMoveProps {
  isSimulatedMove?: boolean;
}
export interface MoveValidatorResponse extends Omit<BoardStateProps, "board"> {
  isValid: boolean;
  boardUpdates: Record<number, SanPiece>;
}
