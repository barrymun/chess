import { GameRecord, Player, defaultGameRecord } from "common";
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
  const playerColour: Player = "white";
  const newGameId = uuidv4();
  const newGameRecord: GameRecord = defaultGameRecord;
  await setValue<GameRecord>(newGameId, newGameRecord);
  await setValue<PlayerRecord>(playerId, {
    playerColour: playerColour,
    gameRecordId: newGameId,
  });
  await addToLookingForGames(playerId);
  return { playerColour, gameId: newGameId, gameRecord: newGameRecord };
};

const joinExistingGame = async (
  playerId: string,
): Promise<{ playerColour: Player; gameId: string; gameRecord: GameRecord } | null> => {
  const gameAvailablePlayerId = await getOldestLookingForGame();
  if (gameAvailablePlayerId === null || gameAvailablePlayerId === playerId) {
    return null;
  }

  const opponentPlayerRecord = await getValue<PlayerRecord>(gameAvailablePlayerId);
  if (opponentPlayerRecord === null) {
    return null;
  }

  const playerColour = opponentPlayerRecord.playerColour === "white" ? "black" : "white";
  const gameId = opponentPlayerRecord.gameRecordId;

  if (gameId === null) {
    // if the opponent player is not in a game, then we can create a new game
    return await createNewGame(playerId);
  }

  // if the opponent player is in a game, then this player can join that game
  await setValue<PlayerRecord>(playerId, {
    playerColour: opponentPlayerRecord.playerColour === "white" ? "black" : "white",
    gameRecordId: opponentPlayerRecord.gameRecordId,
  });

  // remove the opponent player from the looking for games list
  await removeFromLookingForGames(gameAvailablePlayerId);

  const gameRecord = await getValue<GameRecord>(gameId);
  if (gameRecord === null) {
    return null;
  }

  return { playerColour, gameId, gameRecord };
};

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

    let playerColour: Player, gameId: string | null, gameRecord: GameRecord | null;

    const playerRecord = await getValue<PlayerRecord>(playerId);
    if (playerRecord !== null) {
      playerColour = playerRecord.playerColour;
      gameId = playerRecord.gameRecordId;
      if (gameId === null) {
        const existingGameAvailable = await joinExistingGame(playerId);
        if (existingGameAvailable !== null) {
          ({ playerColour, gameId, gameRecord } = existingGameAvailable);
        } else {
          ({ playerColour, gameId, gameRecord } = await createNewGame(playerId));
        }
      }
      // final check to ensure that the game record exists
      gameRecord = await getValue<GameRecord>(gameId);
      if (gameRecord === null) {
        res.status(500).send("Internal server error");
        return;
      }
      res.json({ playerId, playerColour, gameId, gameRecord });
      return;
    }

    const existingGameAvailable = await joinExistingGame(playerId);
    if (existingGameAvailable !== null) {
      res.json({ playerId, ...existingGameAvailable });
      return;
    }

    // no games available, so create a new game
    ({ playerColour, gameId, gameRecord } = await createNewGame(playerId));
    res.json({ playerId, playerColour, gameId, gameRecord });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
