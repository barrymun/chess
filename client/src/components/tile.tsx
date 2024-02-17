import { Box } from "@radix-ui/themes";
import { TileColor, tilesPerRow } from "common";
import { FC } from "react";

import { useGameState, useNetwork } from "hooks";
import { assetSanPieceMap, getIsSanPieceMoveable } from "utils";

interface TileProps {
  position: number;
  grabPiece: (position: number) => (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
}

const Tile: FC<TileProps> = (props) => {
  const { position, grabPiece } = props;
  const { currentPlayer } = useNetwork();
  const { isMultiplayer, gameRecord } = useGameState();

  const tileColor: TileColor = (Math.floor(position / tilesPerRow) + position) % 2 === 0 ? "light" : "dark";
  const imgSrc =
    gameRecord.boardState.board[position] !== " "
      ? `assets/img/${assetSanPieceMap[gameRecord.boardState.board[position]]}.png`
      : null;

  const handleGrabPiece = (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    if (isMultiplayer && currentPlayer !== gameRecord.playerTurn) {
      return;
    }
    if (!getIsSanPieceMoveable({ board: gameRecord.boardState.board, position, playerTurn: gameRecord.playerTurn })) {
      return;
    }
    grabPiece(position)(e);
  };

  return (
    <Box
      className={`
        select-none 
        touch-none 
        w-mobile 
        h-mobile 
        flex ${tileColor === "light" ? "bg-chess-tile-light" : "bg-inherit"} 
        md:w-desktop 
        md:h-desktop
        sm:w-desktop-sm
        sm:h-desktop-sm
        xs:w-desktop-xs
        xs:h-desktop-xs
      `}
      onContextMenu={(e) => {
        // prevent long press context menu
        e.preventDefault();
        e.stopPropagation();
        return false;
      }}
    >
      {gameRecord.lastMovedPiece !== null && gameRecord.lastMovedPiece.origin === position && (
        <Box
          className="
            absolute 
            w-mobile 
            h-mobile 
            bg-pear 
            md:w-desktop 
            md:h-desktop 
            sm:w-desktop-sm 
            sm:h-desktop-sm 
            xs:w-desktop-xs 
            xs:h-desktop-xs
          "
        />
      )}
      {gameRecord.lastMovedPiece !== null && gameRecord.lastMovedPiece.destination === position && (
        <Box
          className="
            absolute 
            w-mobile 
            h-mobile 
            bg-icterine 
            md:w-desktop 
            md:h-desktop 
            sm:w-desktop-sm
            sm:h-desktop-sm 
            xs:w-desktop-xs
            xs:h-desktop-xs
          "
        />
      )}
      {gameRecord.selectedPieceLegalMoves.includes(position) && (
        <Box
          className="
            absolute 
            z-20 
            w-mobile 
            h-mobile 
            flex 
            justify-center 
            items-center 
            md:w-desktop 
            md:h-desktop 
            sm:w-desktop-sm
            sm:h-desktop-sm 
            xs:w-desktop-xs
            xs:h-desktop-xs
          "
        >
          <Box className="w-1/3 h-1/3 rounded-full bg-cyan-100" />
        </Box>
      )}
      {imgSrc && (
        <Box
          style={{
            backgroundImage: `url(${imgSrc})`,
          }}
          className="
            bg-no-repeat 
            w-mobile 
            h-mobile 
            bg-contain 
            bg-center 
            z-10 
            hover:cursor-grab 
            md:w-desktop 
            md:h-desktop
            sm:w-desktop-sm
            sm:h-desktop-sm
            xs:w-desktop-xs
            xs:h-desktop-xs
          "
          onMouseDown={handleGrabPiece}
          onTouchStart={handleGrabPiece}
        />
      )}
    </Box>
  );
};

export { Tile };
