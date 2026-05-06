import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Topbar from "./components/Topbar";
import { useAuth } from "./contexts/AuthContext";

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
  const { isLoggedIn, logout } = useAuth();
  const handleMenuClick = (menu: string) => {
    if (menu === "재료 등록") {
      navigate("/ingredients");
    }
    if (menu === "매출 확인") {
      navigate("/sales-check");
    }
    if (menu === "직원 관리") {
      navigate("/employee-manage");
    }
    if (menu === "AI 챗봇") {
      navigate("/ai-chat");
    }
  };

  const handleLogoutClick = () => {
    if (!isLoggedIn) {
      return;
    }

    logout();
    navigate("/");
  };

  return (
    <Page>
      <Canvas>
        <Topbar
          isLoggedIn={isLoggedIn}
          menus={["재료 등록", "매출 확인", "직원 관리", "AI 챗봇"]}
          onSiteClick={() => navigate("/")}
          onMenuClick={handleMenuClick}
          onLogoutClick={handleLogoutClick}
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
