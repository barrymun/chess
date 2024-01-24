import { TileColor } from "utils";

interface TileProps {
  type: TileColor;
}

const Tile = (props: TileProps) => {
  const { type } = props;
  return <div className={`w-100 h-100 flex ${type === "light" ? "bg-chess-tile-light" : "bg-inherit"}`} />;
};

export { Tile };
