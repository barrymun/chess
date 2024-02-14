import { defaultBoardState } from "common/build/config";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";

import { getValue, setValue } from "../lib/redis";
import { CustomReq, GameRecord, PlayerRecord } from "../utils/types";

interface ReqBody {
  playerId: string;
}

export default async (req: CustomReq<ReqBody>, res: Response) => {
  const playerId = req.body.playerId;
  if (playerId === undefined) {
    res.status(400).send("Missing playerId");
    return;
  }
  if (playerId !== "string") {
    res.status(400).send("Invalid playerId, must be a string");
    return;
  }
  const value = await getValue<PlayerRecord>(playerId);
  if (value !== null) {
    const gameRecord = await getValue<GameRecord>(value.gameRecordId);
    if (gameRecord === null) {
      res.status(500).send("Game record not found");
      return;
    }
    res.json({ playerId, gameId: value.gameRecordId });
    return;
  }
  const newGameRecord: GameRecord = {
    boardState: defaultBoardState,
  };
  const newGameId = uuidv4();
  await setValue<GameRecord>(newGameId, newGameRecord);
  await setValue<PlayerRecord>(playerId, {
    playerColour: "white",
    gameRecordId: newGameId,
  });
  res.json({ playerId, gameId: newGameId });
  return;
};
