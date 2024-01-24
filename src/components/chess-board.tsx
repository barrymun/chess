import { xLabels, yLabels } from "utils";

const ChessBoard = () => {
  return (
    <div className="bg-chess-board rounded-md truncate">
      {yLabels.map((y) => {
        return (
          <div key={y} className="flex">
            {xLabels.map((x) => {
              const isEven = (x.charCodeAt(0) + y) % 2 === 0;
              return <div key={x} className={`w-100 h-100 flex ${isEven ? "bg-chess-tile" : "bg-inherit"}`} />;
            })}
          </div>
        );
      })}
    </div>
  );
};

export { ChessBoard };
