import { ChessGame } from "components";
import { GameStateProvider } from "hooks";

const SinglePlayer = () => {
  return (
    <GameStateProvider>
      <ChessGame />
    </GameStateProvider>
  );
};

export { SinglePlayer };
