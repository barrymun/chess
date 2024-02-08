import { Route, Routes } from "react-router-dom";

import { Home, Play } from "routes";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="play" element={<Play />} />
    </Routes>
  );
}

export default App;
