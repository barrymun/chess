import { GameRecord } from "common/build/types";
import { Response } from "express";

import { deleteKey, getValue } from "lib/redis";
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

    const gameRecord = await getValue<GameRecord>(playerRecord.gameRecordId);
    if (gameRecord === null) {
      res.json({});
      return;
    }

    await deleteKey(playerRecord.gameRecordId);

    res.json({});
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
