import { Box } from "@radix-ui/themes";
import { useTranslation } from "react-i18next";

import { ChessGame } from "components";
import { GameStateProvider, NetworkProvider, usePlayerInfo } from "hooks";

const Multiplayer = () => {
  const { playerId } = usePlayerInfo();
  const { t } = useTranslation();

  if (playerId === null) {
    return <Box className="flex justify-center items-center h-full">{t("multiplayer-not-available")}</Box>;
  }

  return (
    <GameStateProvider isMultiplayer>
      <NetworkProvider>
        <ChessGame />
      </NetworkProvider>
    </GameStateProvider>
  );
};

export { Multiplayer };
