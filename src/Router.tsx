import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Home from "./Home";
import Login from "./pages/Login";
import ReportPage from "./pages/ReportPage";
import SalesForecastPage from "./pages/SalesForecastPage";
import Register from "./pages/Register";
import RegisterComplete from "./pages/RegisterComplete";
import RegisterStepTwo from "./pages/RegisterStepTwo";

import Mypage from "./pages/mypage/Mypage";

import PasswardFind from "./pages/PasswardFind";
import PasswardReset from "./pages/PasswardReset";

import EmployeeManage from "./pages/EmployeeManage/EmployeeManage";
import IngredientPage from "./pages/IngredientPage";
import AiChatPage from "./pages/AiChatPage";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/sales-check",
        element: <SalesForecastPage />,
      },
      {
        path: "/report",
        element: <ReportPage />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      { path: "/register", element: <Register /> },
      { path: "/register2", element: <RegisterStepTwo /> },
      { path: "/register-complete", element: <RegisterComplete /> },

      { path: "/mypage", element: <Mypage /> },
      {
        path: "/password-find",
        element: <PasswardFind />,
      },
      {
        path: "/password-reset",
        element: <PasswardReset />,
      },
      {
        path: "/employee-manage",
        element: <EmployeeManage />,
      },
      {
        path: "/ingredients",
        element: <IngredientPage />,
      },
      {
        path: "/ai-chat",
        element: <AiChatPage />,
      },
    ],
  },
]);

export default router;
