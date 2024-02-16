import { GameRecord } from "common/build/types";

import { FindGameResponse, ForfeitGameResponse, GetPlayerIdResponse, QuitGameResponse } from "utils";

const baseUrl = "http://localhost:3001";

export const getPlayerId = async () => {
  const res = await fetch(`${baseUrl}/generate-player-id`);
  const { playerId } = (await res.json()) as GetPlayerIdResponse;
  return playerId;
};

export const findGame = async (playerId: string) => {
  const res = await fetch(`${baseUrl}/find-game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId }),
  });
  const data = (await res.json()) as FindGameResponse;
  return data;
};

export const makeMove = async ({ playerId, gameRecord }: { playerId: string; gameRecord: GameRecord }) => {
  const res = await fetch(`${baseUrl}/make-move`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId, gameRecord }),
  });
  console.log({ res });
  const data = (await res.json()) as FindGameResponse;
  return data;
};

export const quitGame = async (playerId: string) => {
  const res = await fetch(`${baseUrl}/quit-game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId }),
  });
  const data = (await res.json()) as QuitGameResponse;
  return data;
};

export const forfeitGame = async (playerId: string) => {
  const res = await fetch(`${baseUrl}/forfeit-game`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ playerId }),
  });
  const data = (await res.json()) as ForfeitGameResponse;
  return data;
};
