import { useEffect } from "react";

import { useGameState } from "hooks";
import { TileColor, assetSanPieceMap, pieceSize } from "utils";

interface TileProps {
  position: number;
}

let isMouseDown: boolean = false;
let selectedPosition: number | undefined = undefined;
let selectedPiece: HTMLDivElement | undefined = undefined;

const Tile = (props: TileProps) => {
  const { position } = props;
  const { board } = useGameState();
  const tileColor: TileColor = (Math.floor(position / 8) + position) % 2 === 0 ? "light" : "dark";
  const imgSrc = board[position] !== " " ? `assets/img/${assetSanPieceMap[board[position]]}.png` : undefined;

  const grabPiece = (position: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, target } = e as { target: HTMLDivElement } & React.MouseEvent<HTMLDivElement>;
    target.style.left = `${clientX - pieceSize / 2}px`;
    target.style.top = `${clientY - pieceSize / 2}px`;
    target.style.position = "absolute";
    isMouseDown = true;
    selectedPosition = position;
    selectedPiece = target;
  };

  const movePiece = (e: MouseEvent) => {
    console.log(selectedPosition);
    if (!isMouseDown || !selectedPiece) {
      return;
    }
    const { clientX, clientY } = e;
    selectedPiece.style.left = `${clientX - pieceSize / 2}px`;
    selectedPiece.style.top = `${clientY - pieceSize / 2}px`;
  };

  const dropPiece = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const target = e.target as HTMLDivElement;
    target.style.position = "";
    isMouseDown = false;
    selectedPosition = undefined;
    selectedPiece = undefined;
  };

  useEffect(() => {
    document.addEventListener("mousemove", movePiece);
    return () => {
      document.removeEventListener("mousemove", movePiece);
    };
  }, []);

  return (
    <div className={`w-100 h-100 flex ${tileColor === "light" ? "bg-chess-tile-light" : "bg-inherit"}`}>
      {imgSrc && (
        <div
          style={{
            backgroundImage: `url(${imgSrc})`,
          }}
          className="bg-no-repeat w-100 h-100 bg-contain bg-center hover:cursor-grab"
          onMouseDown={grabPiece(position)}
          onMouseUp={dropPiece}
        />
      )}
    </div>
  );
};

export { Tile };
