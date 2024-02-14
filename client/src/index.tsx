import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";

import App from "App";
import { Header } from "components";
import { GameStateProvider, LocalStorageProvider, PlayerInfoProvider, ThemeProvider } from "hooks";
import reportWebVitals from "reportWebVitals";

import "@radix-ui/themes/styles.css";
import "index.css";

const root = createRoot(document.getElementById("root") as HTMLElement);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <LocalStorageProvider>
        <ThemeProvider>
          <Header>
            <PlayerInfoProvider>
              <GameStateProvider>
                <App />
              </GameStateProvider>
            </PlayerInfoProvider>
          </Header>
        </ThemeProvider>
      </LocalStorageProvider>
    </BrowserRouter>
  </React.StrictMode>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
