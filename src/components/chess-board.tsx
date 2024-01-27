import { useCallback, useEffect, useRef } from "react";

import { Tile } from "components";
import { useGameState } from "hooks";
import { isValidMove, pieceSize } from "utils";

let isMouseDown: boolean = false;
let selectedPosition: number | undefined = undefined;
let selectedPiece: HTMLDivElement | undefined = undefined;

const ChessBoard = () => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const { board, setBoard } = useGameState();

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
    const maxLeft = boardRef.current!.offsetLeft;
    const maxRight = boardRef.current!.offsetLeft + boardRef.current!.offsetWidth;
    const maxTop = boardRef.current!.offsetTop;
    const maxBottom = boardRef.current!.offsetTop + boardRef.current!.offsetHeight;
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

  const clearSelectionContext = () => {
    if (selectedPiece) {
      selectedPiece.style.position = "";
    }
    isMouseDown = false;
    selectedPosition = undefined;
    selectedPiece = undefined;
  };

  const dropPiece = useCallback(
    (e: MouseEvent) => {
      if (!selectedPosition || !selectedPiece) {
        return;
      }
      const { clientX, clientY } = e;
      let closestIndex: number | undefined = undefined;
      let closestChild: HTMLDivElement | undefined = undefined;
      let closestDistance: number = Number.MAX_SAFE_INTEGER;
      Array.from(boardRef.current?.children ?? []).forEach((child, index) => {
        const { left, top, width, height } = child.getBoundingClientRect();
        const childX = left + width / 2;
        const childY = top + height / 2;
        const distance = Math.sqrt((clientX - childX) ** 2 + (clientY - childY) ** 2);
        if (distance < closestDistance) {
          closestIndex = index;
          closestChild = child as HTMLDivElement;
          closestDistance = distance;
        }
      });
      if (!closestIndex || !closestChild) {
        clearSelectionContext();
        return;
      }
      const valid = isValidMove({
        piece: board[selectedPosition],
        board,
        origin: selectedPosition,
        destination: closestIndex!,
      });
      if (!valid) {
        clearSelectionContext();
        return;
      }
      setBoard((prevBoard) => {
        const newBoard = [...prevBoard];
        const temp = newBoard[closestIndex!];
        newBoard[closestIndex!] = newBoard[selectedPosition!];
        newBoard[selectedPosition!] = temp;
        return newBoard;
      });
    },
    [board],
  );

  useEffect(() => {
    clearSelectionContext();
  }, [board]);

  useEffect(() => {
    window.addEventListener("mousemove", movePiece);
    window.addEventListener("mouseup", dropPiece);
    return () => {
      window.removeEventListener("mousemove", movePiece);
      window.removeEventListener("mouseup", dropPiece);
    };
  }, [board]);

  return (
    <div className="bg-chess-board rounded-md truncate">
      <div className="grid grid-cols-8 grid-rows-8" ref={boardRef}>
        {board.map((_square, index) => (
          <Tile key={index} position={index} grabPiece={grabPiece} />
        ))}
      </div>
    </div>
  );
};

export { ChessBoard };
