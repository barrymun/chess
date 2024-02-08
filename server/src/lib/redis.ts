import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

const initRedisClient = async () => {
  const client = await createClient({ url: "redis://redis:6379" })
    .on("error", (err) => {
      throw new Error(err);
    })
    .connect();
  redisClient = client;
};

export { initRedisClient, redisClient };
