import { xLabels } from "utils";

const ChessBoardXLabels = () => {
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
