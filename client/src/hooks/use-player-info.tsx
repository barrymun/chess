import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

import { Loader } from "components";
import { useLocalStorage } from "hooks";

interface PlayerInfoProviderProps {
  children: React.ReactNode;
}

const PlayerInfoContext = createContext(
  {} as {
    playerId: string | null;
  },
);

const PlayerInfoProvider = ({ children }: PlayerInfoProviderProps) => {
  const { getValue, setValue } = useLocalStorage();
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    let playerId = getValue("playerId");
    if (playerId === null) {
      playerId = uuidv4();
    }
    setPlayerId(playerId);
  }, []);

  useEffect(() => {
    if (playerId !== null) {
      setValue("playerId", playerId);
    }
  }, [playerId]);

  const value = useMemo(
    () => ({
      playerId,
    }),
    [playerId],
  );

  return (
    <PlayerInfoContext.Provider value={value}>{playerId !== null ? children : <Loader />}</PlayerInfoContext.Provider>
  );
};

const usePlayerInfo = () => useContext(PlayerInfoContext);

export { PlayerInfoProvider, usePlayerInfo };
