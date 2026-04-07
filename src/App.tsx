import styled from "styled-components";
import Topbar from "./components/Topbar";

const Page = styled.div`
  min-height: 100vh;
  background: #f5f7f9;
`;

const Content = styled.main`
  padding: 20px;
`;

const Title = styled.h1`
  margin: 0;
  text-align: center;
`;

function App() {
  return (
    <Page>
      <Topbar isLoggedIn={false} />
      <Content>
        <Title>Midas 2026 Frontend</Title>
      </Content>
    </Page>
  );
}

export default App;
