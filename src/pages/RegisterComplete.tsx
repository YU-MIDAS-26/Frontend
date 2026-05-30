import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SubmitButton } from "../components/Common";

const Page = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 70px); /* 헤더 제외 중앙 정렬 */
  padding: clamp(24px, 4vw, 40px) clamp(16px, 3vw, 24px);
  background-color: var(--app-page-bg);
`;

const Card = styled.section`
  width: 100%;
  max-width: 36rem;
  padding: clamp(48px, 6vw, 80px) clamp(20px, 4.5vw, 60px);
  border-radius: 8px;
  background: white;
  outline: 3px #7ea0b7 solid;
  outline-offset: -3px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: clamp(36px, 5vw, 62px);
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 44px 20px;
    gap: 40px;
  }
`;

const MessageGroup = styled.div`
  text-align: center;
`;

const MainTitle = styled.h1`
  color: black;
  font-size: 32px;
  font-family: "ONE Mobile Title", sans-serif;
  font-weight: 400;
  line-height: 1.3;
  margin: 0 0 24px 0;
  word-wrap: break-word;
`;

const SubDescription = styled.p`
  color: #333;
  font-size: 20px;
  font-family: "ONE Mobile", sans-serif;
  font-weight: 400;
  line-height: 1.6;
  margin: 0;
  word-break: keep-all; /* 한글 가독성 상향 */
`;

const HomeButton = styled(SubmitButton)`
  height: 48px;
  width: 100%;
  font-family: "ONE Mobile", sans-serif;
`;

const RegisterComplete = () => {
  const navigate = useNavigate();

  return (
    <S.Page>
      <S.Card>
        <S.MessageGroup>
          <S.MainTitle>회원가입이 완료되었습니다.</S.MainTitle>

          <S.SubDescription>
            관리자 승인 이후에 사이트 사용이 가능합니다.
            <span style={{ fontSize: "16px", opacity: 0.8 }}>
              <br></br>승인 여부는 가입하신 이메일로 알려드립니다.
            </span>
          </S.SubDescription>
        </S.MessageGroup>

        <S.HomeButton isActive={true} onClick={() => navigate("/")}>
          메인으로 돌아가기
        </S.HomeButton>
      </S.Card>
    </S.Page>
  );
};

const S = {
  Page,
  Card,
  MessageGroup,
  MainTitle,
  SubDescription,
  HomeButton,
};

export default RegisterComplete;
