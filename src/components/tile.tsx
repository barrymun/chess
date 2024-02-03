import { FC } from "react";

import { useGameState } from "hooks";
import { TileColor, assetSanPieceMap, tilesPerRow } from "utils";

interface TileProps {
  position: number;
  grabPiece: (position: number) => (e: React.MouseEvent<HTMLDivElement>) => void;
}

const Tile: FC<TileProps> = (props) => {
  const { position, grabPiece } = props;
  const { boardState, lastMovedPiece, selectedPieceLegalMoves } = useGameState();

  const tileColor: TileColor = (Math.floor(position / tilesPerRow) + position) % 2 === 0 ? "light" : "dark";
  const imgSrc =
    boardState.board[position] !== " " ? `assets/img/${assetSanPieceMap[boardState.board[position]]}.png` : null;

  return (
    <div className={`w-100 h-100 flex ${tileColor === "light" ? "bg-chess-tile-light" : "bg-inherit"}`}>
      {lastMovedPiece !== null && lastMovedPiece.origin === position && (
        <div className="absolute w-100 h-100 bg-pear" />
      )}
      {lastMovedPiece !== null && lastMovedPiece.destination === position && (
        <div className="absolute w-100 h-100 bg-icterine" />
      )}
      {selectedPieceLegalMoves.includes(position) && (
        <div className="absolute w-100 h-100 flex justify-center items-center">
          <div className="w-1/3 h-1/3 rounded-full bg-cyan-100" />
        </div>
      )}
      {imgSrc && (
        <div
          style={{
            backgroundImage: `url(${imgSrc})`,
          }}
          className="bg-no-repeat w-100 h-100 bg-contain bg-center z-10 hover:cursor-grab"
          onMouseDown={grabPiece(position)}
        />
      )}
    </div>
  );
};

export { Tile };
