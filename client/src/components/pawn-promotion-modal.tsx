import { Box, Dialog, Text } from "@radix-ui/themes";
import { FC } from "react";

import { useGameState, useNetwork } from "hooks";

interface PawnPromotionModalProps {}

const PawnPromotionModal: FC<PawnPromotionModalProps> = () => {
  const { isMultiplayer, gameRecord, setGameRecord } = useGameState();
  const { currentPlayer, makeNetworkMove } = useNetwork();

  const getIsOpen = () => {
    if (isMultiplayer) {
      return gameRecord.showPawnPromotionModal && gameRecord.playerTurn === currentPlayer;
    }
    return gameRecord.showPawnPromotionModal;
  };

  return (
    <Dialog.Root open={getIsOpen()}>
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
            onClick={() => {
              setGameRecord((prevGameRecord) => ({
                ...prevGameRecord,
                pawnPromotionPieceSelection: gameRecord.playerTurn === "white" ? "Q" : "q",
              }));
              if (isMultiplayer && makeNetworkMove !== undefined) {
                makeNetworkMove({
                  ...gameRecord,
                  pawnPromotionPieceSelection: gameRecord.playerTurn === "white" ? "Q" : "q",
                });
              }
            }}
          >
            <Box
              style={{
                backgroundImage: `url(assets/img/${gameRecord.playerTurn === "white" ? "queen-w" : "queen-b"}.png)`,
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
            onClick={() => {
              setGameRecord((prevGameRecord) => ({
                ...prevGameRecord,
                pawnPromotionPieceSelection: gameRecord.playerTurn === "white" ? "R" : "r",
              }));
              if (isMultiplayer && makeNetworkMove !== undefined) {
                makeNetworkMove({
                  ...gameRecord,
                  pawnPromotionPieceSelection: gameRecord.playerTurn === "white" ? "R" : "r",
                });
              }
            }}
          >
            <Box
              style={{
                backgroundImage: `url(assets/img/${gameRecord.playerTurn === "white" ? "rook-w" : "rook-b"}.png)`,
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
            onClick={() => {
              setGameRecord((prevGameRecord) => ({
                ...prevGameRecord,
                pawnPromotionPieceSelection: gameRecord.playerTurn === "white" ? "B" : "b",
              }));
              if (isMultiplayer && makeNetworkMove !== undefined) {
                makeNetworkMove({
                  ...gameRecord,
                  pawnPromotionPieceSelection: gameRecord.playerTurn === "white" ? "B" : "b",
                });
              }
            }}
          >
            <Box
              style={{
                backgroundImage: `url(assets/img/${gameRecord.playerTurn === "white" ? "bishop-w" : "bishop-b"}.png)`,
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
            onClick={() => {
              setGameRecord((prevGameRecord) => ({
                ...prevGameRecord,
                pawnPromotionPieceSelection: gameRecord.playerTurn === "white" ? "N" : "n",
              }));
              if (isMultiplayer && makeNetworkMove !== undefined) {
                makeNetworkMove({
                  ...gameRecord,
                  pawnPromotionPieceSelection: gameRecord.playerTurn === "white" ? "N" : "n",
                });
              }
            }}
          >
            <Box
              style={{
                backgroundImage: `url(assets/img/${gameRecord.playerTurn === "white" ? "knight-w" : "knight-b"}.png)`,
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
