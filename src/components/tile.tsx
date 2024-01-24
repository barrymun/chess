import { useGameState } from "hooks";
import { TileColor, assetSanPieceMap } from "utils";

interface TileProps {
  position: number;
}

const Tile = (props: TileProps) => {
  const { position } = props;
  const { board } = useGameState();
  const tileColor: TileColor = (Math.floor(position / 8) + position) % 2 === 0 ? "light" : "dark";
  const imgSrc = board[position] !== " " ? `assets/img/${assetSanPieceMap[board[position]]}.png` : undefined;
  return (
    <div className={`w-100 h-100 flex ${tileColor === "light" ? "bg-chess-tile-light" : "bg-inherit"}`}>
      {imgSrc && <img src={imgSrc} alt={board[position]} className="w-full h-full object-contain" />}
    </div>
  );
};

export { Tile };
