import { Box, Button, Dialog, Text } from "@radix-ui/themes";
import { FC, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { useGameState, useNetwork, usePlayerInfo } from "hooks";
import { quitGame } from "utils";

interface GameOverModalProps {}

const GameOverModal: FC<GameOverModalProps> = () => {
  const navigate = useNavigate();

  const { playerId } = usePlayerInfo();
  const { isMultiplayer, gameRecord } = useGameState();
  const { assignGame } = useNetwork();

  const DialogClose = useCallback(
    () => (
      <Box className="flex justify-end gap-2 mt-6">
        <Button
          color="gray"
          className="hover:cursor-pointer"
          onClick={async () => {
            if (isMultiplayer) {
              await quitGame(playerId!);
            }
            navigate("/");
          }}
        >
          Quit
        </Button>
        <Button
          className="hover:cursor-pointer"
          onClick={async () => {
            if (isMultiplayer && assignGame !== undefined) {
              await quitGame(playerId!);
              assignGame();
            } else {
              window.location.reload();
            }
          }}
        >
          Play Again
        </Button>
      </Box>
    ),
    [],
  );

  if (!gameRecord.gameOver.isGameOver) {
    return null;
  }

  if (gameRecord.gameOver.winner === null) {
    return (
      <Dialog.Root open>
        <Dialog.Content>
          <Dialog.Description>
            <Text>{gameRecord.gameOver.reason}</Text>
          </Dialog.Description>
          <DialogClose />
        </Dialog.Content>
      </Dialog.Root>
    );
  }

  return (
    <Dialog.Root open>
      <Dialog.Content>
        <Dialog.Description>
          <Text>
            {gameRecord.gameOver.winner === "white" ? "White" : "Black"} Wins by {gameRecord.gameOver.reason}!
          </Text>
        </Dialog.Description>
        <DialogClose />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { GameOverModal };
