import { Route, Routes } from "react-router-dom";

import { Header } from "components";
import { Home, Play } from "routes";

function App() {
  return (
    <Header>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="play" element={<Play />} />
      </Routes>
    </Header>
  );
}

export default App;
