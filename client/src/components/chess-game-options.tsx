import { Box, Button, Dialog, Text } from "@radix-ui/themes";
import { FC, useState } from "react";
import { useNavigate } from "react-router-dom";

import { useGameState, usePlayerInfo } from "hooks";
import { forfeitGame } from "utils";

interface ChessGameOptionsProps {}

const ChessGameOptions: FC<ChessGameOptionsProps> = () => {
  const navigate = useNavigate();
  const { playerId } = usePlayerInfo();
  const { isMultiplayer } = useGameState();

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  return (
    <>
      <Box className="flex justify-end">
        <Button color="gray" onClick={() => setModalOpen(true)} className="hover:cursor-pointer">
          <Text>Forfeit</Text>
        </Button>
      </Box>
      <Dialog.Root open={modalOpen}>
        <Dialog.Content>
          <Dialog.Description>
            <Text>Are you sure you want to forfeit?</Text>
          </Dialog.Description>
          <Box className="flex justify-end gap-2 mt-6">
            <Button color="gray" className="hover:cursor-pointer" onClick={() => setModalOpen(false)}>
              Cancel
            </Button>
            <Button
              className="hover:cursor-pointer"
              onClick={async () => {
                if (isMultiplayer) {
                  await forfeitGame(playerId!);
                }
                navigate("/");
              }}
            >
              Confirm
            </Button>
          </Box>
        </Dialog.Content>
      </Dialog.Root>
    </>
  );
};

export { ChessGameOptions };
