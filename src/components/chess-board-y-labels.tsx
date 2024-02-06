import { FC } from "react";

import { yLabels } from "utils";

interface ChessBoardYLabelsProps {}

const ChessBoardYLabels: FC<ChessBoardYLabelsProps> = () => {
  return (
    <div className="text-white">
      {[...yLabels].reverse().map((x) => {
        return (
          <div key={x} className="w-8 h-100 flex justify-center items-center select-none">
            {x}
          </div>
        );
      })}
    </div>
  );
};

export { ChessBoardYLabels };
