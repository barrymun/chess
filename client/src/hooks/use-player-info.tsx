import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { v4 as uuidv4 } from "uuid";

interface ThemeProviderProps {
  children: React.ReactNode;
}

const PlayerInfoContext = createContext(
  {} as {
    playerId: string | null;
  },
);

const PlayerInfoProvider = ({ children }: ThemeProviderProps) => {
  const [playerId, setPlayerId] = useState<string | null>(null);

  useEffect(() => {
    setPlayerId(uuidv4());
  }, []);

  const value = useMemo(
    () => ({
      playerId,
    }),
    [playerId],
  );

  return <PlayerInfoContext.Provider value={value}>{children}</PlayerInfoContext.Provider>;
};

const usePlayerInfo = () => useContext(PlayerInfoContext);

export { PlayerInfoProvider, usePlayerInfo };
