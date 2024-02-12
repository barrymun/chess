import { GetPlayerIdResponse } from "utils";

const baseUrl = "http://localhost:3001";

export const getPlayerId = async () => {
  const res = await fetch(`${baseUrl}/generate-player-id`);
  console.log({ res });
  const { playerId } = (await res.json()) as GetPlayerIdResponse;
  return playerId;
};
