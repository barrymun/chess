import { Link } from "react-router-dom";

const Home = () => {
  return (
    <div>
      <h1>Welcome to the game!</h1>
      <p>
        <Link to="play">Play</Link>
      </p>
    </div>
  );
};

export { Home };
