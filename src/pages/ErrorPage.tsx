import {
  useNavigate,
  useRouteError,
  isRouteErrorResponse,
} from "react-router-dom";
import styled from "styled-components";
import { ButtonSelected } from "../components/Common"; // 💡 Common.tsx의 정석 버튼 활용

const Page = styled.main`
  min-height: 100vh;
  background: var(--app-page-bg, #f4f7f9);
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
`;

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 24px;
  max-width: 480px;
`;

const ErrorCode = styled.h1`
  font-size: 96px;
  font-weight: 900;
  color: #7ea0b7;
  margin: 0;
  line-height: 1;
  font-family: "ONE Mobile Title", sans-serif;
`;

const Title = styled.h2`
  font-size: 22px;
  font-weight: 700;
  color: #2c3e50;
  margin: 0;
`;

const Description = styled.p`
  font-size: 15px;
  color: #4f6270;
  line-height: 1.6;
  margin: 0;
  word-break: keep-all;
`;

const ButtonBox = styled.div`
  width: 180px;
  height: 44px;
  margin-top: 12px;
`;

export default function ErrorPage() {
  const navigate = useNavigate();
  const error = useRouteError(); // 💡 리액트 라우터가 던진 에러 캐치

  let statusCode = "404";
  let titleText = "페이지를 찾을 수 없습니다";
  let descriptionText =
    "요청하신 주소가 잘못되었거나, 변경 혹은 삭제되어 현재 접근할 수 없습니다. 주소를 다시 한번 확인해 주세요.";

  if (isRouteErrorResponse(error)) {
    statusCode = String(error.status);
    if (error.status === 500) {
      statusCode = "500";
      titleText = "서버가 잠시 아파요 (500)";
      descriptionText =
        "데이터를 처리하는 과정에서 내부 서버 오류가 발생했습니다. 잠시 후 다시 시도하거나 백엔드 팀원에게 문의해 주세요.";
    }
  }

  return (
    <Page>
      <Container>
        <ErrorCode>{statusCode}</ErrorCode>
        <Title>{titleText}</Title>
        <Description>{descriptionText}</Description>

        <ButtonBox>
          <ButtonSelected type="button" onClick={() => navigate("/")}>
            홈으로 돌아가기
          </ButtonSelected>
        </ButtonBox>
      </Container>
    </Page>
  );
}
