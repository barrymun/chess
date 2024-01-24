import { yLabels } from "utils";

const ChessBoardYLabels = () => {
  return (
    <div className="text-white">
      {[...yLabels].reverse().map((x) => {
        return (
          <div key={x} className="w-8 h-100 flex justify-center items-center">
            {x}
          </div>
        );
      })}
    </div>
  );
};

export { ChessBoardYLabels };
