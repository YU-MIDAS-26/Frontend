import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Topbar from "./components/Topbar";
import FloatingChatBot from "./components/FloatingChatBot";
import { OneButtonAlert } from "./components/Common";
import { useAuth } from "./contexts/AuthContext";

const Page = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--app-page-bg);
  overflow-x: hidden;
`;

const Canvas = styled.div`
  width: 100%;
  min-height: 100vh;
  background: var(--app-page-bg);
  position: relative;
  display: flex;
  flex-direction: column;
`;

const Content = styled.main`
  width: 100%;
  min-height: calc(100vh - 70px);
  flex: 1;
  overflow: visible;
  padding-inline: var(--app-gutter);

  & > * {
    width: min(100%, var(--app-max-width));
    margin-inline: auto;
  }
`;

const AlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  z-index: 10000;
  background: rgba(15, 23, 42, 0.45);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const AlertBox = styled.div`
  width: min(100%, 360px);
`;

function App() {
  const navigate = useNavigate();
  const { isLoggedIn, logout } = useAuth();
  const [alertMessage, setAlertMessage] = useState<string | null>(null);

  // 앱 전체의 기본 alert() 호출을 OneButtonAlert 팝업으로 자동 전환
  useEffect(() => {
    const originalAlert = window.alert;
    window.alert = (message?: unknown) => {
      setAlertMessage(String(message ?? ""));
    };
    return () => {
      window.alert = originalAlert;
    };
  }, []);

  const handleMenuClick = (menu: string) => {
    if (menu === "재료 등록") {
      navigate("/ingredients");
    }
    if (menu === "매출 관리") {
      navigate("/sales-check");
    }
    if (menu === "매출입력") {
      navigate("/sales-input");
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
          menus={["재료 등록", "매출 관리", "직원 관리"]}
          onSiteClick={() => navigate("/")}
          onMenuClick={handleMenuClick}
          onLogoutClick={handleLogoutClick}
          onMyPageClick={() => navigate("/mypage")}
        />
        <Content>
          <Outlet />
        </Content>

        <FloatingChatBot />

        {alertMessage !== null && (
          <AlertOverlay onClick={() => setAlertMessage(null)}>
            <AlertBox onClick={(e) => e.stopPropagation()}>
              <OneButtonAlert
                title="알림"
                description={alertMessage}
                buttonText="확인"
                onButtonClick={() => setAlertMessage(null)}
              />
            </AlertBox>
          </AlertOverlay>
        )}
      </Canvas>
    </Page>
  );
}

export default App;
