import { defaultGameRecord } from "common/build/config";
import { GameRecord } from "common/build/types";
import { Response } from "express";
import { v4 as uuidv4 } from "uuid";

import {
  addToLookingForGames,
  getOldestLookingForGame,
  getValue,
  removeFromLookingForGames,
  setValue,
} from "lib/redis";
import { CustomReq, PlayerRecord } from "utils/types";

interface ReqBody {
  playerId: string;
}

export default async (req: CustomReq<ReqBody>, res: Response) => {
  try {
    const playerId = req.body.playerId;
    console.log({ playerId });
    if (playerId === undefined) {
      res.status(400).send("Missing playerId");
      return;
    }
    if (typeof playerId !== "string") {
      res.status(400).send("Invalid playerId, must be a string");
      return;
    }

    const playerRecord = await getValue<PlayerRecord>(playerId);
    console.log({ playerRecord });
    if (playerRecord !== null) {
      const gameRecord = await getValue<GameRecord>(playerRecord.gameRecordId);
      if (gameRecord === null) {
        res.status(500).send("Game record not found");
        return;
      }
      res.json({ playerId, gameId: playerRecord.gameRecordId, gameRecord });
      return;
    }

    const gameAvailablePlayerId = await getOldestLookingForGame();
    console.log({ gameAvailablePlayerId });
    if (gameAvailablePlayerId !== null) {
      const matchedPlayerRecord = await getValue<PlayerRecord>(gameAvailablePlayerId);
      console.log({ matchedPlayerRecord });
      if (matchedPlayerRecord === null) {
        res.status(500).send("Player record not found");
        return;
      }
      await setValue<PlayerRecord>(playerId, {
        playerColour: "black",
        gameRecordId: matchedPlayerRecord.gameRecordId,
      });
      await removeFromLookingForGames(gameAvailablePlayerId);
      const gameRecord = await getValue<GameRecord>(matchedPlayerRecord.gameRecordId);
      console.log({ gameRecord });
      if (gameRecord === null) {
        res.status(500).send("Game record not found");
        return;
      }
      res.json({ playerId, gameId: matchedPlayerRecord.gameRecordId, gameRecord });
      return;
    }

    const newGameId = uuidv4();
    const newGameRecord: GameRecord = defaultGameRecord;
    console.log({ newGameRecord });
    await setValue<GameRecord>(newGameId, newGameRecord);
    await setValue<PlayerRecord>(playerId, {
      playerColour: "white",
      gameRecordId: newGameId,
    });
    await addToLookingForGames(playerId);
    res.json({ playerId, gameId: newGameId, gameRecord: newGameRecord });
    return;
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
