import { FC, RefObject, useEffect } from "react";

import { useGameState } from "hooks";
import { TileColor, assetSanPieceMap, pieceSize } from "utils";

interface TileProps {
  position: number;
  innerRef: RefObject<HTMLDivElement | null>;
}

let isMouseDown: boolean = false;
let selectedPosition: number | undefined = undefined;
let selectedPiece: HTMLDivElement | undefined = undefined;

const Tile: FC<TileProps> = (props) => {
  const { position, innerRef } = props;
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
    if (!isMouseDown || !selectedPiece) {
      return;
    }
    const { clientX, clientY } = e;
    const maxLeft = innerRef.current!.offsetLeft;
    const maxRight = innerRef.current!.offsetLeft + innerRef.current!.offsetWidth;
    const maxTop = innerRef.current!.offsetTop;
    const maxBottom = innerRef.current!.offsetTop + innerRef.current!.offsetHeight;
    // don't allow piece to be dragged outside of board
    if (clientX < maxLeft + pieceSize / 4 || clientX > maxRight - pieceSize / 4) {
      selectedPiece.style.top = `${clientY - pieceSize / 2}px`;
      return;
    }
    if (clientY < maxTop + pieceSize / 4 || clientY > maxBottom - pieceSize / 4) {
      selectedPiece.style.left = `${clientX - pieceSize / 2}px`;
      return;
    }
    selectedPiece.style.left = `${clientX - pieceSize / 2}px`;
    selectedPiece.style.top = `${clientY - pieceSize / 2}px`;
  };

  const dropPiece = (_e: MouseEvent) => {
    if (!selectedPiece) {
      return;
    }
    selectedPiece.style.position = "";
    isMouseDown = false;
    selectedPosition = undefined;
    selectedPiece = undefined;
  };

  useEffect(() => {
    document.addEventListener("mousemove", movePiece);
    document.addEventListener("mouseup", dropPiece);
    return () => {
      document.removeEventListener("mousemove", movePiece);
      document.removeEventListener("mouseup", dropPiece);
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
        />
      )}
    </div>
  );
};

export { Tile };
