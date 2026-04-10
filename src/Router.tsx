import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";
import ReportPage from "./pages/ReportPage";
import SalesForecastPage from "./pages/SalesForecastPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <SalesForecastPage />,
      },
      {
        path: "sales-check",
        element: <SalesForecastPage />,
      },
      {
        path: "report",
        element: <ReportPage />,
      },
      {
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
