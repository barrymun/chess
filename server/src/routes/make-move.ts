import { GameRecord, Player, getIsCheckmate, getIsStalemate } from "common";
import { Response } from "express";

import { getValue, setValue } from "lib/redis";
import { getIo } from "lib/socket";
import { CustomReq, PlayerRecord } from "utils/types";

interface ReqBody {
  playerId: string;
  gameRecord: GameRecord;
}

export default async (req: CustomReq<ReqBody>, res: Response) => {
  try {
    const { playerId, gameRecord } = req.body;
    if (playerId === undefined) {
      res.status(400).send("Missing playerId");
      return;
    }
    if (gameRecord === undefined) {
      res.status(400).send("Missing gameRecord");
      return;
    }

    const playerRecord = await getValue<PlayerRecord>(playerId);
    if (playerRecord === null) {
      res.status(400).send("Player not found");
      return;
    }

    const { gameRecordId } = playerRecord;

    if (gameRecordId === null) {
      res.status(400).send("Player is not in a game");
      return;
    }

    let updatedGameRecord: GameRecord = {
      ...gameRecord,
    };

    // check for a pawn promotion
    if (gameRecord.pawnPromotionPieceSelection !== null) {
      updatedGameRecord = {
        ...updatedGameRecord,
        boardState: {
          ...gameRecord.boardState,
          board: [
            ...gameRecord.boardState.board.slice(0, gameRecord.boardState.pawnPromotionPieceIndex!),
            gameRecord.pawnPromotionPieceSelection!,
            ...gameRecord.boardState.board.slice(gameRecord.boardState.pawnPromotionPieceIndex! + 1),
          ],
          pawnPromotionPieceIndex: null,
        },
        pawnPromotionPieceSelection: null,
        showPawnPromotionModal: false,
        // update the player turn
        playerTurn: gameRecord.playerTurn === "white" ? "black" : "white",
      };
      // update the db value
      await setValue<GameRecord>(gameRecordId, updatedGameRecord);
      // emit the updated game record to the game room (but only for the given game record id, not all game records)
      getIo()?.emit(gameRecordId, { gameRecord: updatedGameRecord });
      res.json({ gameRecord: updatedGameRecord });
      return;
    }

    // check if pawn promotion is possible and if so, show the pawn promotion modal
    // don't change the player turn
    if (gameRecord.boardState.pawnPromotionPieceIndex !== null) {
      updatedGameRecord = {
        ...updatedGameRecord,
        showPawnPromotionModal: true,
        pawnPromotionPieceSelection: null,
      };
      // update the db value
      await setValue<GameRecord>(gameRecordId, updatedGameRecord);
      // emit the updated game record to the game room (but only for the given game record id, not all game records)
      getIo()?.emit(gameRecordId, { gameRecord: updatedGameRecord });
      res.json({ gameRecord: updatedGameRecord });
      return;
    }

    // check if the game is over
    const oppositePlayerTurn: Player = gameRecord.playerTurn === "white" ? "black" : "white";
    const isStalemate = getIsStalemate({ ...gameRecord.boardState, playerTurn: oppositePlayerTurn });
    const isCheckmate = getIsCheckmate({ ...gameRecord.boardState, playerTurn: oppositePlayerTurn });
    if (isStalemate || isCheckmate) {
      updatedGameRecord = {
        ...updatedGameRecord,
        gameOver: {
          isGameOver: true,
          winner: isCheckmate ? gameRecord.playerTurn : null,
          reason: isCheckmate ? "checkmate" : "stalemate",
        },
      };
      // update the db value
      await setValue<GameRecord>(gameRecordId, updatedGameRecord);
      // emit the updated game record to the game room (but only for the given game record id, not all game records)
      getIo()?.emit(gameRecordId, { gameRecord: updatedGameRecord });
      res.json({ gameRecord: updatedGameRecord });
      return;
    }

    // update the player turn
    updatedGameRecord = {
      ...updatedGameRecord,
      playerTurn: gameRecord.playerTurn === "white" ? "black" : "white",
    };

    // update the db value
    await setValue<GameRecord>(gameRecordId, updatedGameRecord);
    // emit the updated game record to the game room (but only for the given game record id, not all game records)
    getIo()?.emit(gameRecordId, { gameRecord: updatedGameRecord });
    res.json({ gameRecord: updatedGameRecord });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
};
