import { Box, Text } from "@radix-ui/themes";
import { FC } from "react";

import { xLabels } from "utils";

interface ChessBoardXLabelsProps {}

const ChessBoardXLabels: FC<ChessBoardXLabelsProps> = () => {
  return (
    <Box className="flex">
      {xLabels.map((x) => {
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
