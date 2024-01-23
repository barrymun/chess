const xArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yArray = [1, 2, 3, 4, 5, 6, 7, 8];

const ChessBoard = () => {
  return (
    <div className="flex content-center items-center flex-col justify-center">
      <div className="bg-chess-board border-2 rounded-sm">
        {yArray.map((y) => {
          return (
            <div key={y} className="flex">
              {xArray.map((x) => {
                const isEven = (x.charCodeAt(0) + y) % 2 === 0;
                return <div key={x} className={`w-24 h-24 flex ${isEven ? "bg-chess-tile" : "bg-inherit"}`} />;
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ChessBoard };