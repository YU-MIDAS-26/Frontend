import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import router from "./Router.tsx";
import ResetStyle from "./style/ResetStyle.tsx";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ResetStyle />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </StrictMode>,
);
