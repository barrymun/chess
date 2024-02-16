import { defaultGameRecord } from "common/build/config";
import { GameRecord, Player } from "common/build/types";
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

const createNewGame = async (
  playerId: string,
): Promise<{ playerColour: Player; gameId: string; gameRecord: GameRecord }> => {
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
  return { playerColour: "white", gameId: newGameId, gameRecord: newGameRecord };
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

    let playerColour: Player, gameId: string, gameRecord: GameRecord | null;

    const playerRecord = await getValue<PlayerRecord>(playerId);
    console.log({ playerRecord });
    if (playerRecord !== null) {
      console.log("=====CASE_1=====");
      console.log({ playerId, playerRecord });
      playerColour = playerRecord.playerColour;
      gameId = playerRecord.gameRecordId;
      gameRecord = await getValue<GameRecord>(gameId);
      if (gameRecord === null) {
        console.log("=====CASE_1_gameRecord_not_found=====");
        // if the game doesn't exist create a new game
        ({ playerColour, gameId, gameRecord } = await createNewGame(playerId));
      }
      res.json({ playerId, playerColour, gameId, gameRecord });
      return;
    }

    const gameAvailablePlayerId = await getOldestLookingForGame();
    console.log({ gameAvailablePlayerId });
    if (gameAvailablePlayerId !== null && gameAvailablePlayerId !== playerId) {
      console.log("=====CASE_2=====");
      console.log({ gameAvailablePlayerId });
      const opponentPlayerRecord = await getValue<PlayerRecord>(gameAvailablePlayerId);
      console.log({ opponentPlayerRecord });
      if (opponentPlayerRecord === null) {
        res.status(500).send("Player record not found");
        return;
      }
      await setValue<PlayerRecord>(playerId, {
        playerColour: opponentPlayerRecord.playerColour === "white" ? "black" : "white",
        gameRecordId: opponentPlayerRecord.gameRecordId,
      });
      await removeFromLookingForGames(gameAvailablePlayerId);
      playerColour = opponentPlayerRecord.playerColour === "white" ? "black" : "white";
      gameId = opponentPlayerRecord.gameRecordId;
      gameRecord = await getValue<GameRecord>(opponentPlayerRecord.gameRecordId);
      console.log({ gameRecord });
      if (gameRecord === null) {
        res.status(500).send("Game record not found");
        return;
      }
      res.json({ playerId, playerColour, gameId, gameRecord });
      return;
    }

    ({ playerColour, gameId, gameRecord } = await createNewGame(playerId));
    res.json({ playerId, playerColour, gameId, gameRecord });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
