import { Box, Button, Dialog, Text } from "@radix-ui/themes";
import { FC, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

import { useGameState, useLocalStorage, usePlayerInfo } from "hooks";
import { forfeitGame } from "utils";

interface ChessGameOptionsProps {}

const ChessGameOptions: FC<ChessGameOptionsProps> = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { playerId } = usePlayerInfo();
  const { isMultiplayer } = useGameState();
  const { removeValue } = useLocalStorage();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Box className="flex justify-end">
        <Button color="gray" onClick={() => setModalOpen(true)} className="hover:cursor-pointer">
          <Text>{t("game-options.forfeit")}</Text>
        </Button>
      </Box>
      <Dialog.Root open={modalOpen}>
        <Dialog.Content>
          <Dialog.Description>
            <Text>{t("game-options.forfeit-confirm")}</Text>
          </Dialog.Description>
          <Box className="flex justify-end gap-2 mt-6">
            <Button color="gray" className="hover:cursor-pointer" onClick={() => setModalOpen(false)}>
              {t("game-options.cancel-button")}
            </Button>
            <Button
              className="hover:cursor-pointer"
              onClick={async () => {
                if (isMultiplayer) {
                  await forfeitGame(playerId!);
                }
                removeValue("singleplayerGameRecord");
                navigate("/");
              }}
            >
              {t("game-options.confirm-button")}
            </Button>
          </Box>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export { ChessGameOptions };
