import { FC } from "react";

import { xLabels } from "utils";

interface ChessBoardXLabelsProps {}

const ChessBoardXLabels: FC<ChessBoardXLabelsProps> = () => {
  return (
    <div className="flex text-white">
      {xLabels.map((x) => {
        return (
          <div key={x} className="w-100 h-8 flex justify-center items-center select-none">
            {x}
          </div>
        );
      })}
    </div>
  );
};

export { ChessBoardXLabels };
