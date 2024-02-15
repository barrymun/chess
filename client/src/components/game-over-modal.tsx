import { Box, Button, Dialog, Text } from "@radix-ui/themes";
import { FC, useCallback } from "react";

import { useGameState } from "hooks";

interface GameOverModalProps {}

const GameOverModal: FC<GameOverModalProps> = () => {
  const { gameRecord } = useGameState();

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
