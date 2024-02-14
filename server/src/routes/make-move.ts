import { BoardStateProps, GameRecord, LastMoveProps, MoveHistoryProps } from "common/build/types";
import { Response } from "express";

import { getValue, setValue } from "lib/redis";
import { getIo, getSocket } from "lib/socket";
import { CustomReq, PlayerRecord } from "utils/types";

interface ReqBody {
  playerId: string;
  lastMovedPiece: LastMoveProps;
  moveHistory: MoveHistoryProps;
  boardState: BoardStateProps;
}

export default async (req: CustomReq<ReqBody>, res: Response) => {
  try {
    const { playerId, lastMovedPiece, moveHistory, boardState } = req.body;
    if (playerId === undefined) {
      res.status(400).send("Missing playerId");
      return;
    }
    if (lastMovedPiece === undefined) {
      res.status(400).send("Missing lastMovedPiece");
      return;
    }
    if (moveHistory === undefined) {
      res.status(400).send("Missing moveHistory");
      return;
    }
    if (boardState === undefined) {
      res.status(400).send("Missing boardState");
      return;
    }

    const playerRecord = await getValue<PlayerRecord>(playerId);
    if (playerRecord === null) {
      res.status(400).send("Player not found");
      return;
    }

    const { gameRecordId } = playerRecord;
    const gameRecord = await getValue<GameRecord>(gameRecordId);
    if (gameRecord === null) {
      res.status(400).send("Game record not found");
      return;
    }
    const updatedGameRecord: GameRecord = {
      ...gameRecord,
      lastMovedPiece,
      moveHistory,
      boardState,
      playerTurn: gameRecord.playerTurn === "white" ? "black" : "white",
    };
    await setValue<GameRecord>(gameRecordId, updatedGameRecord);

    getIo()?.emit("make-move", { gameRecord: updatedGameRecord });
    // TODO: need to emit the move for the current game only
    // getSocket()?.emit(`make-move-${playerId}`, { lastMovedPiece, moveHistory, boardState });

    res.json({ gameRecord: updatedGameRecord });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
