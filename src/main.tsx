import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import router from "./Router.tsx";
import ResetStyle from "./style/ResetStyle.tsx";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ResetStyle />
    <RouterProvider router={router} />
  </StrictMode>,
);
