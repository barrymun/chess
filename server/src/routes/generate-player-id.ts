import express from "express";
import { v4 as uuidv4 } from "uuid";

export default (_req: express.Request, res: express.Response) => {
  const playerId = uuidv4();
  res.json({ playerId });
};
