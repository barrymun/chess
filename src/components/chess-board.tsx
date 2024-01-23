const xArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yArray = [1, 2, 3, 4, 5, 6, 7, 8];

const ChessBoard = () => {
  return (
    <div className="flex content-center items-center flex-col">
      <div className="border-2">
        {yArray.map((y) => {
          return (
            <div key={y} className="flex">
              {xArray.map((x) => {
                return (
                  <div
                    key={x}
                    className="w-24 h-24 flex"
                    style={{
                      backgroundColor: (x.charCodeAt(0) + y) % 2 === 0 ? "black" : "white",
                    }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export { ChessBoard };
