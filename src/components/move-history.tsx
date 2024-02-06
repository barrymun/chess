import { FC } from "react";

import { useGameState } from "hooks";

interface MoveHistoryProps {}

const MoveHistory: FC<MoveHistoryProps> = () => {
  const { whiteMoveHistory, blackMoveHistory } = useGameState();
  return (
    <div className="grow grid grid-cols-2 gap-2 bg-gray-100 p-4 rounded-lg shadow-lg overflow-y-scroll h-800">
      <div className="flex flex-col gap-2">
        <h1 className="text-center">White</h1>
        {whiteMoveHistory.map((move, index) => (
          <p key={index}>{move.destination}</p>
        ))}
      </div>
      <div className="flex flex-col gap-2">
        <h1 className="text-center">Black</h1>
        {blackMoveHistory.map((move, index) => (
          <p key={index}>{move.destination}</p>
        ))}
      </div>
    </div>
  );
};

export { MoveHistory };
