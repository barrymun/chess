import { useGameState } from "hooks";

const PawnPromotionModal = () => {
  const { playerTurn, showPawnPromotionModal, setPawnPromotionPieceSelection } = useGameState();
  console.log({ showPawnPromotionModal });
  return (
    <div
      className="fixed top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center"
      style={{ display: showPawnPromotionModal ? "flex" : "none" }}
    >
      <div className="flex justify-center items-center border-2 border-black rounded">
        <div
          className="w-100 h-100 hover:cursor-pointer"
          onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "Q" : "q")}
        >
          <div
            style={{
              backgroundImage: `url(assets/img/${playerTurn === "white" ? "queen-w" : "queen-b"}.png)`,
            }}
            className="bg-no-repeat w-100 h-100 bg-contain bg-center"
          />
        </div>
        <div
          className="w-100 h-100 hover:cursor-pointer"
          onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "R" : "r")}
        >
          <div
            style={{
              backgroundImage: `url(assets/img/${playerTurn === "white" ? "rook-w" : "rook-b"}.png)`,
            }}
            className="bg-no-repeat w-100 h-100 bg-contain bg-center"
          />
        </div>
        <div
          className="w-100 h-100 hover:cursor-pointer"
          onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "B" : "b")}
        >
          <div
            style={{
              backgroundImage: `url(assets/img/${playerTurn === "white" ? "bishop-w" : "bishop-b"}.png)`,
            }}
            className="bg-no-repeat w-100 h-100 bg-contain bg-center"
          />
        </div>
        <div
          className="w-100 h-100 hover:cursor-pointer"
          onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "N" : "n")}
        >
          <div
            style={{
              backgroundImage: `url(assets/img/${playerTurn === "white" ? "knight-w" : "knight-b"}.png)`,
            }}
            className="bg-no-repeat w-100 h-100 bg-contain bg-center"
          />
        </div>
      </div>
    </div>
  );
};

export { PawnPromotionModal };
