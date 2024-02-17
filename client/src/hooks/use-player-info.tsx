import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

import { Loader } from "components";
import { useLocalStorage } from "hooks";
import { getPlayerId } from "utils";

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

  const assignPlayerId = useCallback(async () => {
    if (playerId !== null) {
      return;
    }
    const storedPlayerId = getValue("playerId");
    let newPlayerId = "";
    if (storedPlayerId === null) {
      newPlayerId = await getPlayerId();
    } else {
      newPlayerId = storedPlayerId;
    }
    setPlayerId(newPlayerId);
  }, [playerId]);

  useEffect(() => {
    assignPlayerId();
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
