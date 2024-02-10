import { Box, Dialog, Text } from "@radix-ui/themes";
import { FC } from "react";

import { useGameState } from "hooks";

interface PawnPromotionModalProps {}

const PawnPromotionModal: FC<PawnPromotionModalProps> = () => {
  const { playerTurn, showPawnPromotionModal, setPawnPromotionPieceSelection } = useGameState();

  return (
    <Dialog.Root open={showPawnPromotionModal}>
      <Dialog.Content>
        <Dialog.Title>
          <Text>Promote pawn</Text>
        </Dialog.Title>
        <Box className="flex justify-center items-center border-2 border-black rounded">
          <Box
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
            <Box
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
          </Box>
          <Box
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
            <Box
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
          </Box>
          <Box
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
            <Box
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
          </Box>
          <Box
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
            <Box
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
          </Box>
        </Box>
      </Dialog.Content>
    </Dialog.Root>
  );
};

export { PawnPromotionModal };
