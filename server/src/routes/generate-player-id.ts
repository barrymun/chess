import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid";

export default (_req: Request, res: Response) => {
  const playerId = uuidv4();
  res.json({ playerId });
};
