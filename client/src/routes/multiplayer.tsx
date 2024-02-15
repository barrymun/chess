import { ChessGame } from "components";
import { GameStateProvider, NetworkProvider } from "hooks";

const Multiplayer = () => {
  return (
    <GameStateProvider isMultiplayer>
      <NetworkProvider>
        <ChessGame />
      </NetworkProvider>
    </GameStateProvider>
  );
};

export { Multiplayer };
