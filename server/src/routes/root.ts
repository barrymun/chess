import express from "express";

export default (_req: express.Request, res: express.Response) => {
  res.send("root");
};
