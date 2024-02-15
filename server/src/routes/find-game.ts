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

const createNewGame = async (playerId: string): Promise<{ gameId: string; gameRecord: GameRecord }> => {
  console.log("=====CASE_createNewGame=====");
  const newGameId = uuidv4();
  const newGameRecord: GameRecord = defaultGameRecord;
  console.log({ newGameRecord });
  await setValue<GameRecord>(newGameId, newGameRecord);
  await setValue<PlayerRecord>(playerId, {
    playerColour: "white",
    gameRecordId: newGameId,
  });
  await addToLookingForGames(playerId);
  return { gameId: newGameId, gameRecord: newGameRecord };
};

export default async (req: CustomReq<ReqBody>, res: Response) => {
  try {
    console.log("=====CASE_findGame=====");
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

    let gameId: string, gameRecord: GameRecord | null;

    const playerRecord = await getValue<PlayerRecord>(playerId);
    console.log({ playerRecord });
    if (playerRecord !== null) {
      console.log("=====CASE_1=====");
      console.log({ playerId, playerRecord });
      gameId = playerRecord.gameRecordId;
      gameRecord = await getValue<GameRecord>(gameId);
      if (gameRecord === null) {
        console.log("=====CASE_1_gameRecord_not_found=====");
        // if the game doesn't exist we want to create a new game
        ({ gameId, gameRecord } = await createNewGame(playerId));
      }
      res.json({ playerId, playerColour: playerRecord.playerColour, gameId, gameRecord });
      return;
    }

    const gameAvailablePlayerId = await getOldestLookingForGame();
    console.log({ gameAvailablePlayerId });
    if (gameAvailablePlayerId !== null) {
      console.log("=====CASE_2=====");
      console.log({ gameAvailablePlayerId });
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
      gameId = matchedPlayerRecord.gameRecordId;
      gameRecord = await getValue<GameRecord>(matchedPlayerRecord.gameRecordId);
      console.log({ gameRecord });
      if (gameRecord === null) {
        res.status(500).send("Game record not found");
        return;
      }
      res.json({ playerId, playerColour: "black", gameId, gameRecord });
      return;
    }

    ({ gameId, gameRecord } = await createNewGame(playerId));
    res.json({ playerId, playerColour: "white", gameId, gameRecord });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
