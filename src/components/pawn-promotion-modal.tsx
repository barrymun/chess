import { FC } from "react";

import { useGameState } from "hooks";

interface PawnPromotionModalProps {}

const PawnPromotionModal: FC<PawnPromotionModalProps> = () => {
  const { playerTurn, showPawnPromotionModal, setPawnPromotionPieceSelection } = useGameState();

  return (
    <div
      className="fixed z-20 top-0 left-0 w-screen h-screen bg-black bg-opacity-50 flex justify-center items-center"
      style={{ display: showPawnPromotionModal ? "flex" : "none" }}
    >
      <div className="flex justify-center items-center border-2 border-black rounded">
        <div
          className="
            w-mobile 
            h-mobile 
            hover:cursor-pointer 
            md:w-desktop 
            md:h-desktop 
            sm:w-desktop-sm 
            sm:h-desktop-sm 
            xs:w-desktop-xs 
            xs:h-desktop-xs
          "
          onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "Q" : "q")}
        >
          <div
            style={{
              backgroundImage: `url(assets/img/${playerTurn === "white" ? "queen-w" : "queen-b"}.png)`,
            }}
            className="
              bg-no-repeat 
              w-mobile 
              h-mobile 
              bg-contain 
              bg-center 
              md:w-desktop 
              md:h-desktop 
              sm:w-desktop-sm
              sm:h-desktop-sm 
              xs:w-desktop-xs 
              xs:h-desktop-xs
            "
          />
        </div>
        <div
          className="
            w-mobile 
            h-mobile 
            hover:cursor-pointer 
            md:w-desktop 
            md:h-desktop 
            sm:w-desktop-sm
            sm:h-desktop-sm 
            xs:w-desktop-xs 
            xs:h-desktop-xs
          "
          onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "R" : "r")}
        >
          <div
            style={{
              backgroundImage: `url(assets/img/${playerTurn === "white" ? "rook-w" : "rook-b"}.png)`,
            }}
            className="
              bg-no-repeat 
              w-mobile 
              h-mobile 
              bg-contain 
              bg-center 
              md:w-desktop 
              md:h-desktop 
              sm:w-desktop-sm
              sm:h-desktop-sm 
              xs:w-desktop-xs 
              xs:h-desktop-xs
            "
          />
        </div>
        <div
          className="
            w-mobile 
            h-mobile 
            hover:cursor-pointer 
            md:w-desktop 
            md:h-desktop 
            sm:w-desktop-sm
            sm:h-desktop-sm 
            xs:w-desktop-xs 
            xs:h-desktop-xs
          "
          onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "B" : "b")}
        >
          <div
            style={{
              backgroundImage: `url(assets/img/${playerTurn === "white" ? "bishop-w" : "bishop-b"}.png)`,
            }}
            className="
              bg-no-repeat 
              w-mobile 
              h-mobile 
              bg-contain 
              bg-center 
              md:w-desktop 
              md:h-desktop 
              sm:w-desktop-sm
              sm:h-desktop-sm 
              xs:w-desktop-xs 
              xs:h-desktop-xs
            "
          />
        </div>
        <div
          className="
            w-mobile 
            h-mobile 
            hover:cursor-pointer 
            md:w-desktop 
            md:h-desktop 
            sm:w-desktop-sm
            sm:h-desktop-sm 
            xs:w-desktop-xs 
            xs:h-desktop-xs
          "
          onClick={() => setPawnPromotionPieceSelection(playerTurn === "white" ? "N" : "n")}
        >
          <div
            style={{
              backgroundImage: `url(assets/img/${playerTurn === "white" ? "knight-w" : "knight-b"}.png)`,
            }}
            className="
              bg-no-repeat 
              w-mobile 
              h-mobile 
              bg-contain 
              bg-center 
              md:w-desktop 
              md:h-desktop 
              sm:w-desktop-sm
              sm:h-desktop-sm 
              xs:w-desktop-xs 
              xs:h-desktop-xs
            "
          />
        </div>
      </div>
    </div>
  );
};

export { PawnPromotionModal };
