import { Route, Routes } from "react-router-dom";

import { Home, Multiplayer, SinglePlayer } from "routes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/singleplayer" element={<SinglePlayer />} />
      <Route path="/multiplayer" element={<Multiplayer />} />
    </Routes>
  );
}

export default App;
