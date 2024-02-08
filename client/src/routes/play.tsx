import { ChessBoard, ChessBoardXLabels, ChessBoardYLabels, MoveHistory } from "components";
import { GameStateProvider, NetworkProvider } from "hooks";

const Play = () => {
  return (
    <NetworkProvider>
      <GameStateProvider>
        <div className="flex justify-center items-center w-full h-full">
          <div className="flex flex-col">
            <div className="flex content-center justify-center gap-2">
              <ChessBoardYLabels />
              <ChessBoard />
              <MoveHistory />
            </div>
            <div className="flex gap-2">
              <div className="ml-8" />
              <ChessBoardXLabels />
            </div>
          </div>
        </div>
      </GameStateProvider>
    </NetworkProvider>
  );
};

export { Play };
