import { createServer } from "http";

import cors from "cors";
import express from "express";
import { Server } from "socket.io";

import { initRedisClient } from "./lib/redis";
import createGame from "./routes/create-game";
import generatePlayerId from "./routes/generate-player-id";

(async () => {
  await initRedisClient();
  console.log("Redis client initialized");

  const corsOptions = {
    origin: "http://localhost:3000",
  };

  const app = express();
  const server = createServer(app);
  const io = new Server(server, {
    cors: corsOptions,
  });

  app.use(cors(corsOptions));
  app.get("/generate-player-id", generatePlayerId);
  app.post("/create-game", createGame);

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });

  server.listen(3001);
})();
