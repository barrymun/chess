import { useRef } from "react";

import { Tile } from "components";
import { useGameState } from "hooks";

const ChessBoard = () => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const { board } = useGameState();

  return (
    <div className="bg-chess-board rounded-md truncate" ref={boardRef}>
      <div className="grid grid-cols-8 grid-rows-8">
        {board.map((_square, index) => (
          <Tile key={index} position={index} innerRef={boardRef} />
        ))}
      </div>
    </div>
  );
};

export { ChessBoard };
