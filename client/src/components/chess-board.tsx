import { Box } from "@radix-ui/themes";
import {
  GameRecord,
  LastMoveProps,
  ValidMoveProps,
  computeCanMakeMove,
  getAllValidPieceMoves,
  getIsCheckmate,
  getIsKingInCheck,
} from "common";
import { FC, useCallback, useEffect, useRef } from "react";

import { Tile } from "components";
import { useGameState, useNetwork } from "hooks";
import { convertMoveToAlgebraicNotation } from "utils";

let isMouseDown = false;
let originIndex: number | null = null;
let selectedPiece: HTMLDivElement | null = null;

interface ChessBoardProps {}

const ChessBoard: FC<ChessBoardProps> = () => {
  const { isMultiplayer, gameRecord, setGameRecord } = useGameState();
  const { currentPlayer, makeNetworkMove } = useNetwork();

  const boardRef = useRef<HTMLDivElement | null>(null);

  const grabPiece = (position: number) => (e: React.MouseEvent<HTMLDivElement> | React.TouchEvent<HTMLDivElement>) => {
    // don't do anything if right-clicked or multi touch
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
      ...gameRecord.boardState,
      piece: gameRecord.boardState.board[originIndex],
      playerTurn: gameRecord.playerTurn,
      origin: position,
    });
    console.log(allValidMoves);
    setGameRecord((prevGameRecord) => ({
      ...prevGameRecord,
      selectedPieceLegalMoves: allValidMoves,
    }));
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
      setGameRecord((prevGameRecord) => ({
        ...prevGameRecord,
        selectedPieceLegalMoves: [],
      }));
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
          if (isMultiplayer && currentPlayer === "black") {
            // reverse the index for black player
            destinationIndex = gameRecord.boardState.board.length - 1 - index;
          } else {
            destinationIndex = index;
          }
          closestChild = child as HTMLDivElement;
          closestDistance = distance;
        }
      });
      if (destinationIndex === null || closestChild === null) {
        clearSelectionContext();
        return;
      }
      const { isValid, boardUpdates, ...canMakeMoveResponse } = computeCanMakeMove({
        ...gameRecord.boardState,
        piece: gameRecord.boardState.board[originIndex],
        playerTurn: gameRecord.playerTurn,
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
        board: gameRecord.boardState.board.map((piece, index) => boardUpdates[index] ?? piece),
        playerTurn: gameRecord.playerTurn === "white" ? "black" : "white",
      };
      const isInCheck = getIsKingInCheck(checkAndCheckmateProps);
      const isCheckmate = getIsCheckmate(checkAndCheckmateProps);
      const lastMoveAlgebraicNotation = convertMoveToAlgebraicNotation({
        origin: originIndex,
        destination: destinationIndex,
        originPiece: gameRecord.boardState.board[originIndex],
        destinationPiece: gameRecord.boardState.board[destinationIndex],
        isInCheck,
        isCheckmate,
      });
      const updatedGameRecord: GameRecord = {
        ...gameRecord,
        lastMovedPiece: lastMove,
        moveHistory: {
          ...gameRecord.moveHistory,
          [gameRecord.playerTurn]: {
            moves: [...gameRecord.moveHistory[gameRecord.playerTurn].moves, lastMove],
            algebraicNotationMoves: [
              ...gameRecord.moveHistory[gameRecord.playerTurn].algebraicNotationMoves,
              lastMoveAlgebraicNotation,
            ],
          },
        },
        boardState: {
          ...gameRecord.boardState,
          ...canMakeMoveResponse,
          board: gameRecord.boardState.board.map((piece, index) => boardUpdates[index] ?? piece),
        },
      };
      setGameRecord(updatedGameRecord);
      if (isMultiplayer && makeNetworkMove !== undefined) {
        makeNetworkMove(updatedGameRecord);
      }
    },
    [gameRecord.boardState, gameRecord.playerTurn],
  );

  const getTiles = () => {
    if (isMultiplayer && currentPlayer === "black") {
      return gameRecord.boardState.board
        .slice()
        .reverse()
        .map((_square, index) => (
          <Tile key={index} position={gameRecord.boardState.board.length - 1 - index} grabPiece={grabPiece} />
        ));
    }
    return gameRecord.boardState.board.map((_square, index) => (
      <Tile key={index} position={index} grabPiece={grabPiece} />
    ));
  };

  useEffect(() => {
    clearSelectionContext();
  }, [gameRecord.boardState]);

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
  }, [gameRecord.boardState, gameRecord.playerTurn]);

  return (
    <Box className="shadow-lg rounded-md truncate">
      <Box className="bg-chess-board">
        <Box className="grid grid-cols-8 grid-rows-8" ref={boardRef}>
          {getTiles()}
        </Box>
      </Box>
    </Box>
  );
};

export { ChessBoard };
