const xArray = ["a", "b", "c", "d", "e", "f", "g", "h"];
const yArray = [1, 2, 3, 4, 5, 6, 7, 8];

const ChessBoard = () => {
  return (
    <div>
      {yArray.map((y) => {
        return (
          <div key={y}>
            {xArray.map((x) => {
              return (
                <div
                  key={x}
                  style={{
                    width: "100px",
                    height: "100px",
                    backgroundColor: (x.charCodeAt(0) + y) % 2 === 0 ? "black" : "white",
                    display: "inline-block",
                  }}
                ></div>
              );
            })}
          </div>
        );
      })}
    </div>
  );
};

export { ChessBoard };
