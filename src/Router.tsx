import { createBrowserRouter } from "react-router-dom";
import App from "./App";
import Login from "./pages/Login";

const Home = () => null;

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
        path: "login",
        element: <Login />,
      },
    ],
  },
]);

export default router;
