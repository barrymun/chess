import { Box } from "@radix-ui/themes";
import { FC, useCallback, useEffect, useRef } from "react";

import { Tile } from "components";
import { useGameState } from "hooks";
import {
  LastMoveProps,
  ValidMoveProps,
  computeCanMakeMove,
  convertMoveToAlgebraicNotation,
  getAllValidPieceMoves,
  getIsCheckmate,
  getIsKingInCheck,
} from "utils";

let isMouseDown = false;
let originIndex: number | null = null;
let selectedPiece: HTMLDivElement | null = null;

interface ChessBoardProps {}

const ChessBoard: FC<ChessBoardProps> = () => {
  const boardRef = useRef<HTMLDivElement | null>(null);
  const { boardState, playerTurn, setBoardState, setLastMovedPiece, setSelectedPieceLegalMoves, setMoveHistory } =
    useGameState();

  const grabPiece = (position: number) => (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // don't do anything if right-clicked or multitouch
    if (("button" in e && e.button === 2) || ("touches" in e && e.touches.length > 1)) {
      return;
    }
    let clientX: number | null = null;
    let clientY: number | null = null;
    if ("clientX" in e && "clientY" in e) {
      ({ clientX, clientY } = e);
    } else {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        ({ clientX, clientY } = touch);
      }
    }
    if (clientX === null || clientY === null) {
      return;
    }
    const target = e.target as HTMLDivElement;
    const targetWidth = target.getBoundingClientRect().width;
    target.style.left = `${clientX - targetWidth / 2}px`;
    target.style.top = `${clientY - targetWidth / 2}px`;
    target.style.position = "absolute";
    target.style.zIndex = "100";
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

  const movePiece = (e: MouseEvent | TouchEvent) => {
    e.preventDefault(); // requires "select-none" and "touch-none" classes on tile component
    if (!isMouseDown || selectedPiece === null) {
      return;
    }
    let clientX: number | null = null;
    let clientY: number | null = null;
    if ("clientX" in e && "clientY" in e) {
      ({ clientX, clientY } = e);
    } else {
      if (e.touches.length === 1) {
        const touch = e.touches[0];
        ({ clientX, clientY } = touch);
      }
    }
    if (clientX === null || clientY === null) {
      return;
    }
    const target = e.target as HTMLDivElement;
    const targetWidth = target.getBoundingClientRect().width;
    const maxLeft = boardRef.current!.offsetLeft;
    const maxRight = boardRef.current!.offsetLeft + boardRef.current!.offsetWidth;
    const maxTop = boardRef.current!.offsetTop;
    const maxBottom = boardRef.current!.offsetTop + boardRef.current!.offsetHeight;
    // don't allow piece to be dragged outside of board
    if (clientX < maxLeft + targetWidth / 4 || clientX > maxRight - targetWidth / 4) {
      selectedPiece.style.top = `${clientY - targetWidth / 2}px`;
      return;
    }
    if (clientY < maxTop + targetWidth / 4 || clientY > maxBottom - targetWidth / 4) {
      selectedPiece.style.left = `${clientX - targetWidth / 2}px`;
      return;
    }
    selectedPiece.style.left = `${clientX - targetWidth / 2}px`;
    selectedPiece.style.top = `${clientY - targetWidth / 2}px`;
  };

  const clearSelectionContext = () => {
    if (selectedPiece) {
      selectedPiece.style.position = "";
      selectedPiece.style.zIndex = "";
    }
    isMouseDown = false;
    originIndex = null;
    selectedPiece = null;
  };

  const dropPiece = useCallback(
    (e: MouseEvent | TouchEvent) => {
      setSelectedPieceLegalMoves([]);
      if (originIndex === null || selectedPiece === null) {
        clearSelectionContext();
        return;
      }
      let clientX: number | null = null;
      let clientY: number | null = null;
      if ("clientX" in e && "clientY" in e) {
        ({ clientX, clientY } = e);
      } else {
        if (e.changedTouches.length === 1) {
          const touch = e.changedTouches[0];
          ({ clientX, clientY } = touch);
        }
      }
      if (clientX === null || clientY === null) {
        clearSelectionContext();
        return;
      }
      let destinationIndex: number | null = null;
      let closestChild: HTMLDivElement | null = null;
      let closestDistance: number = Number.MAX_SAFE_INTEGER;
      Array.from(boardRef.current?.children ?? []).forEach((child, index) => {
        const { left, top, width, height } = child.getBoundingClientRect();
        const childX = left + width / 2;
        const childY = top + height / 2;
        const distance = Math.sqrt((clientX! - childX) ** 2 + (clientY! - childY) ** 2);
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
      const checkAndCheckmateProps: Omit<ValidMoveProps, "origin" | "destination"> = {
        ...canMakeMoveResponse,
        board: boardState.board.map((piece, index) => boardUpdates[index] ?? piece),
        playerTurn: playerTurn === "white" ? "black" : "white",
      };
      const isInCheck = getIsKingInCheck(checkAndCheckmateProps);
      const isCheckmate = getIsCheckmate(checkAndCheckmateProps);
      const lastMoveAlgebraicNotation = convertMoveToAlgebraicNotation({
        origin: originIndex,
        destination: destinationIndex,
        originPiece: boardState.board[originIndex],
        destinationPiece: boardState.board[destinationIndex],
        isInCheck,
        isCheckmate,
      });
      setLastMovedPiece(lastMove);
      setMoveHistory((mh) => ({
        ...mh,
        [playerTurn]: {
          ...mh[playerTurn],
          moves: [...mh[playerTurn].moves, lastMove],
          algebraicNotationMoves: [...mh[playerTurn].algebraicNotationMoves, lastMoveAlgebraicNotation],
        },
      }));
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
    window.addEventListener("touchmove", movePiece);
    window.addEventListener("mouseup", dropPiece);
    window.addEventListener("touchend", dropPiece);
    return () => {
      window.removeEventListener("mousemove", movePiece);
      window.removeEventListener("touchmove", movePiece);
      window.removeEventListener("mouseup", dropPiece);
      window.removeEventListener("touchend", dropPiece);
    };
  }, [boardState, playerTurn]);

  return (
    <Box className="w-full drop-shadow-lg">
      <Box className="bg-chess-board rounded-md truncate">
        <Box className="grid grid-cols-8 grid-rows-8" ref={boardRef}>
          {boardState.board.map((_square, index) => (
            <Tile key={index} position={index} grabPiece={grabPiece} />
          ))}
        </Box>
      </Box>
    </Box>
  );
};

export { ChessBoard };
