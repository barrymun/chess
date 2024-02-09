import { Box } from "@radix-ui/themes";

import { ChessBoard, ChessBoardXLabels, ChessBoardYLabels, MoveHistory } from "components";
import { GameStateProvider, NetworkProvider } from "hooks";

const Play = () => {
  return (
    <NetworkProvider>
      <GameStateProvider>
        <Box className="flex justify-center items-center w-full h-full">
          <Box className="flex flex-col">
            <Box className="flex content-center justify-center gap-2">
              <ChessBoardYLabels />
              <ChessBoard />
              <MoveHistory />
            </Box>
            <Box className="flex gap-2">
              <Box className="ml-8" />
              <ChessBoardXLabels />
            </Box>
          </Box>
        </Box>
      </GameStateProvider>
    </NetworkProvider>
  );
};

export { Play };
