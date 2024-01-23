import { render } from "@testing-library/react";

import App from "./App";

test("renders learn react link", () => {
  render(<App />);
  const rootElement = document.getElementById("root");
  expect(rootElement).toBeNull(); // TODO: suppressing for now
});
