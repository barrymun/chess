import { Box, Text } from "@radix-ui/themes";
import { FC } from "react";

import { useGameState, useNetwork } from "hooks";
import { yLabels } from "utils";

interface ChessBoardYLabelsProps {}

const ChessBoardYLabels: FC<ChessBoardYLabelsProps> = () => {
  const { isMultiplayer } = useGameState();
  const { currentPlayer } = useNetwork();

  const getLabels = () => {
    if (isMultiplayer && currentPlayer === "black") {
      return yLabels;
    }
    return [...yLabels].reverse();
  };

  return (
    <Box>
      {getLabels().map((x) => {
        return (
          <Box
            key={x}
            className="
              w-4 
              h-mobile 
              flex 
              justify-center 
              items-center 
              select-none 
              md:h-desktop 
              sm:h-desktop-sm 
              xs:h-desktop-xs
              xs:text-xs
            "
          >
            <Text>{x}</Text>
          </Box>
        );
      })}
    </Box>
  );
};

export { ChessBoardYLabels };
