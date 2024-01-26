import { FC } from "react";

import { useGameState } from "hooks";
import { TileColor, assetSanPieceMap } from "utils";

interface TileProps {
  position: number;
  grabPiece: (position: number) => (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Tile: FC<TileProps> = (props) => {
  const { position, grabPiece } = props;
  const { board } = useGameState();
  const tileColor: TileColor = (Math.floor(position / 8) + position) % 2 === 0 ? "light" : "dark";
  const imgSrc = board[position] !== " " ? `assets/img/${assetSanPieceMap[board[position]]}.png` : undefined;

  return (
    <div className={`w-100 h-100 flex ${tileColor === "light" ? "bg-chess-tile-light" : "bg-inherit"}`}>
      {imgSrc && (
        <div
          style={{
            backgroundImage: `url(${imgSrc})`,
          }}
          className="bg-no-repeat w-100 h-100 bg-contain bg-center hover:cursor-grab"
          onMouseDown={grabPiece(position)}
        />
      )}
    </div>
  );
};

export { Tile };
