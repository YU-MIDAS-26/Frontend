import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import ResetStyle from "./style/ResetStyle.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResetStyle />
    <App />
  </StrictMode>
);
