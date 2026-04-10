import { Outlet, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Topbar from "./components/Topbar";

const Page = styled.div`
  min-height: 100vh;
  background: #f5f7f9;
`;

const Content = styled.main`
  flex: 1;
`;

function App() {
  const navigate = useNavigate();

  return (
    <Page>
      <Topbar
        isLoggedIn={false}
        onSiteClick={() => navigate("/")}
        onAuthClick={() => navigate("/login")}
      />
      <Content>
        <Outlet />
      </Content>
    </Page>
  );
}

export default App;
