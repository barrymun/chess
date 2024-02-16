import { Box, Text } from "@radix-ui/themes";
import { FC } from "react";

import { useGameState, useNetwork } from "hooks";
import { xLabels } from "utils";

interface ChessBoardXLabelsProps {}

const ChessBoardXLabels: FC<ChessBoardXLabelsProps> = () => {
  const { isMultiplayer } = useGameState();
  const { currentPlayer } = useNetwork();

  const getLabels = () => {
    if (isMultiplayer && currentPlayer === "black") {
      return [...xLabels].reverse();
    }
    return xLabels;
  };

  return (
    <Box className="flex">
      {getLabels().map((x) => {
        return (
          <Box
            key={x}
            className="
              w-mobile 
              h-8 
              flex 
              justify-center 
              items-center 
              select-none 
              md:w-desktop 
              sm:w-desktop-sm
              xs:w-desktop-xs
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

export { ChessBoardXLabels };
