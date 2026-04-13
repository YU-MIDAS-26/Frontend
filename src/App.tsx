import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Topbar from "./components/Topbar";

const Page = styled.div`
  min-height: 100vh;
  background: #f5f7f9;
  overflow: auto;
`;

const Canvas = styled.div`
  width: 1440px;
  max-width: 1440px;
  min-width: 1440px;
  min-height: 1024px;
  margin: 0 auto;
  background: #f5f7f9;
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  min-height: calc(1024px - 70px);
  flex: 1;
  overflow: visible;
`;

function App() {
  const navigate = useNavigate();
  const handleMenuClick = (menu: string) => {
    if (menu === "매출 확인") {
      navigate("/sales-check");
    }
  };

  return (
    <Page>
      <Canvas>
        <Topbar
          isLoggedIn={false}
          onSiteClick={() => navigate("/")}
          onMenuClick={handleMenuClick}
          onAuthClick={() => navigate("/login")}
        />
        <Content>
          <Outlet />
        </Content>
      </Canvas>
    </Page>
  );
}

export default App;
