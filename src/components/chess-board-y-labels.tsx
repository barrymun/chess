import { FC } from "react";

import { yLabels } from "utils";

interface ChessBoardYLabelsProps {}

const ChessBoardYLabels: FC<ChessBoardYLabelsProps> = () => {
  return (
    <div className="text-white">
      {[...yLabels].reverse().map((x) => {
        return (
          <div
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
            {x}
          </div>
        );
      })}
    </div>
  );
};

export { ChessBoardYLabels };
