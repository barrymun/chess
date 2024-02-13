import { createClient } from "redis";

let redisClient: ReturnType<typeof createClient> | null = null;

export const initRedisClient = async () => {
  const client = await createClient({ url: "redis://redis:6379" })
    .on("error", (err) => {
      throw new Error(err);
    })
    .connect();
  redisClient = client;
};

export const getValue = async <T>(key: string): Promise<T | null> => {
  try {
    const value = await redisClient?.get(key);
    if (value === null || value === undefined) {
      return null;
    }
    return JSON.parse(value);
  } catch (error) {
    return null;
  }
};

export const setValue = async <T>(key: string, value: T): Promise<void> => {
  await redisClient?.set(key, JSON.stringify(value));
};
