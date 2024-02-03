import { useGameState } from "hooks";

const GameOverModal = () => {
  const { gameOver } = useGameState();

  if (!gameOver.isGameOver) {
    return null;
  }

  if (gameOver.winner === null) {
    return (
      // eslint-disable-next-line max-len
      <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center">
        <div className="flex justify-center items-center border-2 border-black rounded">
          <div className="text-4xl font-bold">{gameOver.reason}</div>
        </div>
      </div>
    );
  }

  return (
    // eslint-disable-next-line max-len
    <div className="fixed z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex flex-col justify-center items-center">
      <div className="flex justify-center items-center border-2 border-black rounded">
        <div className="text-4xl font-bold">
          {gameOver.winner === "white" ? "White" : "Black"} Wins by {gameOver.reason}!
        </div>
      </div>
      <button className="text-4xl font-bold hover:cursor-pointer" onClick={() => window.location.reload()}>
        Play Again
      </button>
    </div>
  );
};

export { GameOverModal };
