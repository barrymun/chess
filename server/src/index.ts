import "dotenv/config";

import { createServer } from "http";

import bodyParser from "body-parser";
import cors from "cors";
import express from "express";
import { Server } from "socket.io";

import { initRedisClient } from "lib/redis";
import { getSocket, setIo, setSocket } from "lib/socket";
import findGame from "routes/find-game";
import forfeitGame from "routes/forfeit-game";
import generatePlayerId from "routes/generate-player-id";
import makeMove from "routes/make-move";
import quitGame from "routes/quit-game";

(async () => {
  if (!process.env.CORS_ORIGIN) {
    throw new Error("CORS_ORIGIN env variable is required");
  }
  console.log(process.env.CORS_ORIGIN);

  await initRedisClient();
  console.log("Redis client initialized");

  const corsOptions = {
    origin: process.env.CORS_ORIGIN,
  };

  const app = express();
  const jsonParser = bodyParser.json();
  const server = createServer(app);
  const io = new Server(server, {
    cors: corsOptions,
  });
  setIo(io);

  app.use(cors(corsOptions));
  app.get("/generate-player-id", generatePlayerId);
  app.post("/find-game", jsonParser, findGame);
  app.post("/make-move", jsonParser, makeMove);
  app.post("/quit-game", jsonParser, quitGame);
  app.post("/forfeit-game", jsonParser, forfeitGame);

  io.on("connection", (s) => {
    setSocket(s);
    console.log("a user connected", getSocket()?.id);
    getSocket()?.on("disconnect", () => {
      console.log("user disconnected", getSocket()?.id);
    });
  });

  server.listen(3001);
})();
