import { Route, Routes } from "react-router-dom";

import { Header } from "components";
import { Home, Multiplayer, SinglePlayer } from "routes";

function App() {
  return (
    <Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/singleplayer" element={<SinglePlayer />} />
        <Route path="/multiplayer" element={<Multiplayer />} />
      </Routes>
    </Header>
  );
}

export default App;
