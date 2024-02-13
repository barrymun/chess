import { Box } from "@radix-ui/themes";
import { TileColor } from "common/build/types";
import { FC } from "react";

import { useGameState } from "hooks";
import { assetSanPieceMap, tilesPerRow } from "utils";

interface TileProps {
  position: number;
  grabPiece: (position: number) => (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => void;
}

const Tile: FC<TileProps> = (props) => {
  const { position, grabPiece } = props;
  const { boardState, lastMovedPiece, selectedPieceLegalMoves } = useGameState();

  const tileColor: TileColor = (Math.floor(position / tilesPerRow) + position) % 2 === 0 ? "light" : "dark";
  const imgSrc =
    boardState.board[position] !== " " ? `assets/img/${assetSanPieceMap[boardState.board[position]]}.png` : null;

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
      {lastMovedPiece !== null && lastMovedPiece.origin === position && (
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
      {lastMovedPiece !== null && lastMovedPiece.destination === position && (
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
      {selectedPieceLegalMoves.includes(position) && (
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
          onMouseDown={grabPiece(position)}
          onTouchStart={grabPiece(position)}
        />
      )}
    </Box>
  );
};

export { Tile };
