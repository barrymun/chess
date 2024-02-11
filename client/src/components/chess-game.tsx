import { Box } from "@radix-ui/themes";

import { ChessBoard, ChessBoardXLabels, ChessBoardYLabels, MoveHistory } from "components";
import { GameStateProvider } from "hooks";

const ChessGame = () => {
  return (
    <GameStateProvider>
      <Box className="flex justify-center items-center w-full h-full">
        <Box className="flex flex-col">
          <Box className="flex content-center justify-center gap-2">
            <ChessBoardYLabels />
            <ChessBoard />
            <MoveHistory />
          </Box>
          <Box className="flex gap-2">
            <Box className="ml-4" />
            <ChessBoardXLabels />
          </Box>
        </Box>
      </Box>
    </GameStateProvider>
  );
};

export { ChessGame };
