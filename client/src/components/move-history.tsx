import { FC } from "react";

import { useGameState } from "hooks";
import { mergeMoveHistory } from "utils";

interface MoveHistoryProps {}

const MoveHistory: FC<MoveHistoryProps> = () => {
  const { moveHistory } = useGameState();
  const mergedMoveHistory = mergeMoveHistory(moveHistory);
  return (
    <div className="rounded-lg shadow-lg overflow-y-scroll bg-gray-100 min-w-44 xs:hidden lg:block">
      <table className="table-auto w-full">
        <thead>
          <tr>
            <th className="p-2"></th>
            <th className="p-2">White</th>
            <th className="p-2">Black</th>
          </tr>
        </thead>
        <tbody className="striped">
          {mergedMoveHistory.map((move, index) => (
            <tr key={index}>
              <td className="p-2">{`${index + 1}.`}</td>
              <td className="p-2">{move[0]}</td>
              <td className="p-2">{move[1]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export { MoveHistory };
