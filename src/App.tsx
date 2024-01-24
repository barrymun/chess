import { ChessBoard, ChessBoardXLabels, ChessBoardYLabels } from "components";

function App() {
  return (
    <>
      <div className="flex flex-col">
        <div className="flex content-center items-center justify-center gap-2">
          <ChessBoardYLabels />
          <ChessBoard />
        </div>
        <div className="flex gap-2">
          <div className="ml-8" />
          <ChessBoardXLabels />
        </div>
      </div>
    </>
  );
}

export default App;
