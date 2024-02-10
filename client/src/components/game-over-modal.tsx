import { Box, Button, Dialog, Text } from "@radix-ui/themes";
import { FC, useCallback } from "react";

import { useGameState } from "hooks";

interface GameOverModalProps {}

const GameOverModal: FC<GameOverModalProps> = () => {
  const { gameOver } = useGameState();

  const DialogClose = useCallback(
    () => (
      <Box className="flex justify-end mt-6">
        <Button className="hover:cursor-pointer" onClick={() => window.location.reload()}>
          Play Again
        </Button>
      </Box>
    ),
    [],
  );

  if (!gameOver.isGameOver) {
    return null;
  }

  if (gameOver.winner === null) {
    return (
      <Dialog.Root open>
        <Dialog.Content>
          <Dialog.Description>
            <Text>{gameOver.reason}</Text>
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
            {gameOver.winner === "white" ? "White" : "Black"} Wins by {gameOver.reason}!
          </Text>
        </Dialog.Description>
        <DialogClose />
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { GameOverModal };
