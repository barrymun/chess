import { ChessBoard, ChessBoardXLabels, ChessBoardYLabels, MoveHistory } from "components";
import { GameStateProvider } from "hooks";

function App() {
  return (
    <GameStateProvider>
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
    </GameStateProvider>
  );
}

export default App;
