import styled from "styled-components";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";

function MainIntro() {
  const navigate = useNavigate();
  const featureSectionRef = useRef<HTMLElement | null>(null);

  const handleStartClick = () => {
    navigate("/login");
  };

  const handleFeatureClick = () => {
    featureSectionRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };
  return (
    <Page>
      <HeroSection>
        <Title>
          음식점 운영,
          <br />
          이제 감이 아니라 데이터로 판단하세요.
        </Title>

        <Description>
          매출 데이터, 식자재 시세, 주변 상권 가격, 지역 뉴스까지 종합 분석하여
          음식점 자영업자에게 필요한 경영 전략을 AI 리포트로 제공합니다.
        </Description>

        <ButtonGroup>
          <PrimaryButton type="button" onClick={handleStartClick}>
            서비스 시작하기
          </PrimaryButton>

          <SecondaryButton type="button" onClick={handleFeatureClick}>
            주요 기능 보기
          </SecondaryButton>
        </ButtonGroup>
      </HeroSection>

      <Section ref={featureSectionRef}>
        <SectionTitle>서비스 핵심 기능</SectionTitle>
        <CardGrid>
          <FeatureCard>
            <CardNumber>01</CardNumber>
            <CardTitle>통합 데이터 분석</CardTitle>
            <CardText>
              매장 매출 데이터와 KAMIS 식자재 시세, 주변 업체 메뉴 가격, 지역
              뉴스 데이터를 함께 분석합니다.
            </CardText>
          </FeatureCard>

          <FeatureCard>
            <CardNumber>02</CardNumber>
            <CardTitle>AI 경영 리포트</CardTitle>
            <CardText>
              분석 결과를 기반으로 가격 최적화, 로컬 이슈 대응, 폐기 예측,
              트렌드 추천 등 실제 운영 전략을 제안합니다.
            </CardText>
          </FeatureCard>

          <FeatureCard>
            <CardNumber>03</CardNumber>
            <CardTitle>예상 매출 및 순수익 계산</CardTitle>
            <CardText>
              월별 예상 매출을 분석하고 공과금, 직원 급여 등을 제외한 실제
              순수익을 계산해 안정적인 운영 계획을 돕습니다.
            </CardText>
          </FeatureCard>
        </CardGrid>
      </Section>

      <Section>
        <SectionTitle>데이터 수집 및 분석 방식</SectionTitle>
        <ProcessBox>
          <ProcessItem>
            <ProcessTitle>공공데이터 API</ProcessTitle>
            <ProcessText>
              KAMIS Open API를 활용해 실시간 식자재 시세를 수집합니다.
            </ProcessText>
          </ProcessItem>

          <ProcessArrow>→</ProcessArrow>

          <ProcessItem>
            <ProcessTitle>크롤링</ProcessTitle>
            <ProcessText>
              Beautiful Soup와 Selenium으로 주변 메뉴 가격 정보를 수집합니다.
            </ProcessText>
          </ProcessItem>

          <ProcessArrow>→</ProcessArrow>

          <ProcessItem>
            <ProcessTitle>AI 분석 서버</ProcessTitle>
            <ProcessText>
              FastAPI 기반 AI 서버에서 데이터를 통합 분석합니다.
            </ProcessText>
          </ProcessItem>

          <ProcessArrow>→</ProcessArrow>

          <ProcessItem>
            <ProcessTitle>LLM 리포트</ProcessTitle>
            <ProcessText>
              분석 수치를 사용자가 이해하기 쉬운 경영 제안 문장으로 변환합니다.
            </ProcessText>
          </ProcessItem>
        </ProcessBox>
      </Section>
      <Footer>© 2026 Team Acta. All Rights Reserved.</Footer>
    </Page>
  );
}

export default MainIntro;

const Page = styled.main`
  width: 100%;
  min-height: 100vh;
  background: #f5f7f9;
  color: #1f2933;
`;

const HeroSection = styled.section`
  width: 100%;
  min-height: 520px;
  padding: clamp(56px, 8vw, 96px) clamp(24px, 6vw, 72px) clamp(48px, 7vw, 80px);
  box-sizing: border-box;
  background: linear-gradient(135deg, #c8d7e1 0%, #ffffff 60%);
`;

const Title = styled.h1`
  margin: 0;
  font-size: 52px;
  line-height: 1.25;
  font-weight: 800;
  color: #172554;
`;

const Description = styled.p`
  width: min(100%, 680px);
  margin: 28px 0 0;
  font-size: 20px;
  line-height: 1.8;
  color: #4b5563;
`;

const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  margin-top: 42px;
`;

const PrimaryButton = styled.button`
  width: 160px;
  height: 48px;
  border: none;
  border-radius: 12px;
  background: #7ea0b7;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const SecondaryButton = styled.button`
  width: 160px;
  height: 48px;
  border: 1px solid #7ea0b7;
  border-radius: 12px;
  background: white;
  color: #7ea0b7;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
`;

const Section = styled.section`
  padding: 80px 120px;
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  margin: 0 0 36px;
  font-size: 32px;
  font-weight: 800;
  color: #111827;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 28px;

  @media (max-width: 980px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  min-height: 260px;
  padding: 32px;
  border-radius: 24px;
  background: white;
  box-shadow: 0 12px 32px rgba(15, 23, 42, 0.08);
  box-sizing: border-box;
`;

const CardNumber = styled.div`
  font-size: 18px;
  font-weight: 800;
  color: #7ea0b7;
  margin-bottom: 22px;
`;

const CardTitle = styled.h3`
  margin: 0 0 18px;
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
`;

const CardText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.8;
  color: #4b5563;
`;

const ProcessBox = styled.div`
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;
  gap: 18px;
`;

const ProcessItem = styled.div`
  flex: 1;
  padding: 28px 24px;
  border-radius: 20px;
  background: white;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
`;

const ProcessTitle = styled.h3`
  margin: 0 0 14px;
  font-size: 20px;
  font-weight: 800;
  color: #1f2937;
`;

const ProcessText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: #6b7280;
`;

const ProcessArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 28px;
  font-weight: 800;
  color: #9ca3af;

  @media (max-width: 980px) {
    width: 100%;
    transform: rotate(90deg);
  }
`;

const Footer = styled.footer`
  width: 100%;
  padding: 24px 0 36px;
  text-align: center;

  font-size: 13px;
  font-weight: 500;
  color: #a0a8b3;

  background: transparent;
`;
