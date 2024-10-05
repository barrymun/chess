import { GameRecord } from "@barrymun/chess-common";
import { Response } from "express";

import { getValue, setValue } from "lib/redis";
import { getIo } from "lib/socket";
import { CustomReq, PlayerRecord } from "utils/types";

interface ReqBody {
  playerId: string;
}

export default async (req: CustomReq<ReqBody>, res: Response) => {
  try {
    const playerId = req.body.playerId;
    if (playerId === undefined) {
      res.status(400).send("Missing playerId");
      return;
    }
    if (typeof playerId !== "string") {
      res.status(400).send("Invalid playerId, must be a string");
      return;
    }

    const playerRecord = await getValue<PlayerRecord>(playerId);
    if (playerRecord === null) {
      res.status(400).send("Player not found");
      return;
    }

    const { playerColour, gameRecordId } = playerRecord;

    if (gameRecordId === null) {
      // this is ok as the player as not in a game
      res.json({});
      return;
    }
    const gameRecord = await getValue<GameRecord>(gameRecordId);
    if (gameRecord === null) {
      res.json({});
      return;
    }

    const updatedGameRecord: GameRecord = {
      ...gameRecord,
      gameOver: {
        isGameOver: true,
        reason: "forfeit",
        winner: playerColour === "white" ? "black" : "white", // the other player wins
      },
    };
    await setValue<GameRecord>(gameRecordId, updatedGameRecord);
    await setValue<PlayerRecord>(playerId, { playerColour, gameRecordId: null });
    getIo()?.emit(gameRecordId, { gameRecord: updatedGameRecord });
    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
