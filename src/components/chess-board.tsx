import { Tile } from "components";
import { useGameState } from "hooks";

const ChessBoard = () => {
  const { board } = useGameState();

  return (
    <div className="bg-chess-board rounded-md truncate">
      <div className="grid grid-cols-8 grid-rows-8">
        {board.map((_square, index) => (
          <Tile key={index} type={(Math.floor(index / 8) + index) % 2 === 0 ? "light" : "dark"} />
        ))}
      </div>
    </div>
  );
};

export { ChessBoard };
