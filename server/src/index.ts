import { Server } from "socket.io";

import { initRedisClient } from "./lib/redis";

(async () => {
  await initRedisClient();
  console.log("Redis client initialized");

  const io = new Server({
    cors: {
      origin: "http://localhost:3000",
    },
  });

  io.on("connection", (socket) => {
    console.log("a user connected", socket.id);
    socket.on("disconnect", () => {
      console.log("user disconnected", socket.id);
    });
  });

  io.listen(3001);
})();
