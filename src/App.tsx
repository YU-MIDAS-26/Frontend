import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Topbar from "./components/Topbar";

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f7f9;
  overflow-x: hidden;
`;

const Canvas = styled.div`
  width: 100%;
  min-height: 100vh;
  background: #f5f7f9;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  min-height: calc(100vh - 70px);
  flex: 1;
  overflow: visible;
`;

function App() {
  const navigate = useNavigate();
  const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
  const handleMenuClick = (menu: string) => {
    if (menu === "매출 확인") {
      navigate("/sales-check");
    }
  };

  const handleAuthClick = () => {
    if (isLoggedIn) {
      localStorage.removeItem("isLoggedIn");
      localStorage.removeItem("userId");
      navigate("/");
    } else {
      navigate("/login");
    }
  };

  return (
    <Page>
      <Canvas>
        <Topbar
          isLoggedIn={isLoggedIn}
          onSiteClick={() => navigate("/")}
          onMenuClick={handleMenuClick}
          onAuthClick={handleAuthClick}
          onMyPageClick={() => navigate("/mypage")}
        />
        <Content>
          <Outlet />
        </Content>
      </Canvas>
    </Page>
  );
}

export default App;
