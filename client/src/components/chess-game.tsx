import { Box } from "@radix-ui/themes";
import { FC } from "react";

import {
  ChessBoard,
  ChessBoardXLabels,
  ChessBoardYLabels,
  GameOverModal,
  MoveHistory,
  PawnPromotionModal,
} from "components";

interface ChessGameProps {}

const ChessGame: FC<ChessGameProps> = () => {
  return (
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
      <PawnPromotionModal />
      <GameOverModal />
    </Box>
  );
};

export { ChessGame };
