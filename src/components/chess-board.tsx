import { FC, useCallback, useEffect, useRef } from "react";

import { Tile } from "components";
import { useGameState } from "hooks";
import { LastMoveProps, computeCanMakeMove, getAllValidPieceMoves, pieceSize } from "utils";

let isMouseDown: boolean = false;
let originIndex: number | null = null;
let selectedPiece: HTMLDivElement | null = null;

interface ChessBoardProps {}

const ChessBoard: FC<ChessBoardProps> = () => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const {
    boardState,
    playerTurn,
    setBoardState,
    setLastMovedPiece,
    setSelectedPieceLegalMoves,
    setWhiteMoveHistory,
    setBlackMoveHistory,
  } = useGameState();

  const grabPiece = (position: number) => (e: React.MouseEvent<HTMLDivElement>) => {
    const { clientX, clientY, target } = e as { target: HTMLDivElement } & React.MouseEvent<HTMLDivElement>;
    target.style.left = `${clientX - pieceSize / 2}px`;
    target.style.top = `${clientY - pieceSize / 2}px`;
    target.style.position = "absolute";
    isMouseDown = true;
    originIndex = position;
    selectedPiece = target;
    const allValidMoves = getAllValidPieceMoves({
      ...boardState,
      piece: boardState.board[originIndex],
      playerTurn,
      origin: position,
    });
    console.log(allValidMoves);
    setSelectedPieceLegalMoves(allValidMoves);
  };

  const movePiece = (e: MouseEvent) => {
    if (!isMouseDown || selectedPiece === null) {
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
    originIndex = null;
    selectedPiece = null;
  };

  const dropPiece = useCallback(
    (e: MouseEvent) => {
      setSelectedPieceLegalMoves([]);
      if (originIndex === null || selectedPiece === null) {
        return;
      }
      const { clientX, clientY } = e;
      let destinationIndex: number | null = null;
      let closestChild: HTMLDivElement | null = null;
      let closestDistance: number = Number.MAX_SAFE_INTEGER;
      Array.from(boardRef.current?.children ?? []).forEach((child, index) => {
        const { left, top, width, height } = child.getBoundingClientRect();
        const childX = left + width / 2;
        const childY = top + height / 2;
        const distance = Math.sqrt((clientX - childX) ** 2 + (clientY - childY) ** 2);
        if (distance < closestDistance) {
          destinationIndex = index;
          closestChild = child as HTMLDivElement;
          closestDistance = distance;
        }
      });
      if (destinationIndex === null || closestChild === null) {
        clearSelectionContext();
        return;
      }
      const { isValid, boardUpdates, ...canMakeMoveResponse } = computeCanMakeMove({
        ...boardState,
        piece: boardState.board[originIndex],
        playerTurn,
        origin: originIndex,
        destination: destinationIndex,
      });
      if (!isValid || Object.keys(boardUpdates).length === 0) {
        clearSelectionContext();
        return;
      }
      // TODO: might move this "setLastMovedPiece" logic out of here and into a useEffect on the game state hook
      const lastMove: LastMoveProps = { origin: originIndex, destination: destinationIndex };
      setLastMovedPiece(lastMove);
      if (playerTurn === "white") {
        setWhiteMoveHistory((prevWhiteMoveHistory) => [...prevWhiteMoveHistory, lastMove]);
      } else {
        setBlackMoveHistory((prevBlackMoveHistory) => [...prevBlackMoveHistory, lastMove]);
      }
      setBoardState((prevBoardState) => ({
        ...prevBoardState,
        ...canMakeMoveResponse,
        board: prevBoardState.board.map((piece, index) => boardUpdates[index] ?? piece),
      }));
    },
    [boardState, playerTurn],
  );

  useEffect(() => {
    clearSelectionContext();
  }, [boardState]);

  useEffect(() => {
    window.addEventListener("mousemove", movePiece);
    window.addEventListener("mouseup", dropPiece);
    return () => {
      window.removeEventListener("mousemove", movePiece);
      window.removeEventListener("mouseup", dropPiece);
    };
  }, [boardState, playerTurn]);

  return (
    <div className="bg-chess-board rounded-md truncate min-w-800">
      <div className="grid grid-cols-8 grid-rows-8" ref={boardRef}>
        {boardState.board.map((_square, index) => (
          <Tile key={index} position={index} grabPiece={grabPiece} />
        ))}
      </div>
    </div>
  );
};

export { ChessBoard };
