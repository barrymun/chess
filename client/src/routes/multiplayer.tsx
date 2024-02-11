import { ChessGame } from "components";
import { NetworkProvider } from "hooks";

const Multiplayer = () => {
  return (
    <NetworkProvider>
      <ChessGame />
    </NetworkProvider>
  );
};

export { Multiplayer };
