import { Response } from "express";

import { getValue } from "../lib/redis";
import { CustomReq } from "../utils/types";

interface Body {
  playerId: string;
}

export default async (req: CustomReq<Body>, res: Response) => {
  const playerId = req.body.playerId;
  if (playerId === undefined) {
    res.status(400).send("Missing playerId");
    return;
  }
  if (playerId !== "string") {
    res.status(400).send("Invalid playerId, must be a string");
    return;
  }
  const value = await getValue(playerId);
  if (value !== null) {
    res.status(400).send("PlayerId already exists");
    return;
  }
};
