import { FC } from "react";

import { xLabels } from "utils";

interface ChessBoardXLabelsProps {}

const ChessBoardXLabels: FC<ChessBoardXLabelsProps> = () => {
  return (
    <div className="flex text-white">
      {xLabels.map((x) => {
        return (
          <div
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
            {x}
          </div>
        );
      })}
    </div>
  );
};

export { ChessBoardXLabels };
