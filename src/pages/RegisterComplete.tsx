import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { SubmitButton } from "../components/Common";

const Page = styled.main`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: calc(100vh - 100px); /* 헤더 제외 중앙 정렬 */
  padding: 40px 20px;
  background-color: #f5f7f9;
`;

const Card = styled.section`
  width: 100%;
  max-width: 540px;
  padding: 80px 60px;
  border-radius: 8px;
  background: white;
  /* 피그마 수치 반영 */
  outline: 3px #7ea0b7 solid;
  outline-offset: -3px;

  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 62px;
  box-sizing: border-box;

  @media (max-width: 640px) {
    padding: 60px 24px;
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

/**
 * [Component] 메인 컴포넌트
 */
const RegisterComplete = () => {
  const navigate = useNavigate();

  return (
    <S.Page>
      <S.Card>
        <S.MessageGroup>
          {/* 피그마 디자인대로 메인 타이틀과 서브 문구 배치 */}
          <S.MainTitle>
            회원가입이 <br /> 완료되었습니다.
          </S.MainTitle>

          <S.SubDescription>
            관리자 승인 이후에 <br />
            사이트 사용이 가능합니다. <br />
            <span style={{ fontSize: "16px", opacity: 0.8 }}>
              승인 여부는 가입하신 이메일로 알려드립니다.
            </span>
          </S.SubDescription>
        </S.MessageGroup>

        {/* 메인으로 돌아가는 액션 */}
        <S.HomeButton isActive={true} onClick={() => navigate("/")}>
          메인으로 돌아가기
        </S.HomeButton>
      </S.Card>
    </S.Page>
  );
};

// 위에서 정의한 스타일을 S 객체로 묶어서 사용 (코드 깔끔하게)
const S = {
  Page,
  Card,
  MessageGroup,
  MainTitle,
  SubDescription,
  HomeButton,
};

export default RegisterComplete;
