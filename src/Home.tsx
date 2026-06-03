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
          매출 CSV 파일 업로드 한 번으로 분석하는 우리 매장 현황부터, 네이버
          최저가와 KAMIS 전국 시세를 결합한 스마트한 식자재 관리까지. 자영업자를
          위한 AI 경영 전략 리포트를 경험해 보세요.
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
            <CardTitle>식자재 실시간 시세 분석</CardTitle>
            <CardText>
              등록한 재료의 전국 농산물 시세(KAMIS)를 확인하고, 네이버 쇼핑
              API를 통해 실시간 최저가 정보를 즉시 검색합니다. 궁금한 품목은
              직접 수기로 타이핑하여 찾아볼 수도 있습니다.
            </CardText>
          </FeatureCard>

          <FeatureCard>
            <CardNumber>02</CardNumber>
            <CardTitle>CSV 기반 매출 시각화</CardTitle>
            <CardText>
              매장의 매출 CSV 파일을 업로드하면 <strong>일별 매출 추이</strong>,{" "}
              <strong>채널별 매출 비중</strong>은 물론, 매장이 가장 바쁜
              시간대를 한눈에 파악하는{" "}
              <strong>요일 × 시간대별 매출 집중도 히트맵</strong>을 시각화하여
              보여줍니다.
            </CardText>
          </FeatureCard>

          <FeatureCard>
            <CardNumber>03</CardNumber>
            <CardTitle>AI 데이터 통합 리포트</CardTitle>
            <CardText>
              시각화된 매출 데이터와 실시간 식자재 시세를 AI가 종합 분석합니다.
              단순한 수치를 넘어 견고한 순이익 유지를 위한 비용 절감 방안,
              비수기 사전 대비 마케팅 전략, 고객 확보 프로모션 등 구체적인 운영
              가이드를 제안합니다.
            </CardText>
          </FeatureCard>
        </CardGrid>
      </Section>

      {/* 분석 프로세스 섹션 */}
      <Section style={{ background: "#ffffff" }}>
        <SectionTitle>데이터 수집 및 분석 방식</SectionTitle>
        <ProcessBox>
          <ProcessItem>
            <ProcessTag>INPUT</ProcessTag>
            <ProcessTitle>데이터 입력 및 수집</ProcessTitle>
            <ProcessText>
              - 매출 CSV 파일 업로드
              <br />
              - 식자재 품목 등록 및 수기 검색
              <br />- KAMIS & 네이버 API 연동
            </ProcessText>
          </ProcessItem>

          <ProcessArrow>→</ProcessArrow>

          <ProcessItem>
            <ProcessTag>ANALYSIS</ProcessTag>
            <ProcessTitle>시각화 및 시세 분석</ProcessTitle>
            <ProcessText>
              - 일별/채널별 그래프 생성
              <br />
              - 요일×시간대 매출 히트맵 분석
              <br />- 전국 농산물 시세 추이 분석
            </ProcessText>
          </ProcessItem>

          <ProcessArrow>→</ProcessArrow>

          <ProcessItem>
            <ProcessTag>REPORT</ProcessTag>
            <ProcessTitle>AI 경영 제안</ProcessTitle>
            <ProcessText>
              - 최저가 기반 식자재 구매 전략
              <br />
              - 연중 비수기 예측 및 사전 마케팅 제안
              <br />- 총 판매량·비용 분석을 통한 순이익 리포트
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
  width: min(100%, 750px);
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
  width: 180px;
  height: 52px;
  border: none;
  border-radius: 12px;
  background: #7ea0b7;
  color: white;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  transition: background 0.2s;
  &:hover {
    background: #6a8ba3;
  }
`;

const SecondaryButton = styled.button`
  width: 180px;
  height: 52px;
  border: 1px solid #7ea0b7;
  border-radius: 12px;
  background: white;
  color: #7ea0b7;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  &:hover {
    background: #f0f4f8;
  }
`;

const Section = styled.section`
  padding: 100px clamp(24px, 10vw, 120px);
  box-sizing: border-box;
`;

const SectionTitle = styled.h2`
  margin: 0 0 48px;
  font-size: 36px;
  font-weight: 800;
  color: #111827;
  text-align: center;
`;

const CardGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
  }
`;

const FeatureCard = styled.article`
  min-height: 300px;
  padding: 40px;
  border-radius: 28px;
  background: white;
  box-shadow: 0 15px 35px rgba(15, 23, 42, 0.06);
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
`;

const CardNumber = styled.div`
  font-size: 20px;
  font-weight: 800;
  color: #7ea0b7;
  margin-bottom: 24px;
`;

const CardTitle = styled.h3`
  margin: 0 0 20px;
  font-size: 24px;
  font-weight: 800;
  color: #1f2937;
`;

const CardText = styled.p`
  margin: 0;
  font-size: 16px;
  line-height: 1.8;
  color: #4b5563;
  strong {
    color: #172554;
  }
`;

const ProcessBox = styled.div`
  display: flex;
  align-items: flex-start;
  flex-wrap: wrap;
  gap: 24px;
  justify-content: center;
`;

const ProcessItem = styled.div`
  flex: 1;
  min-width: 280px;
  padding: 32px;
  border-radius: 24px;
  background: #f9fafb;
  border: 1px solid #e5e7eb;
  box-sizing: border-box;
`;

const ProcessTag = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 8px;
  background: #e2e8f0;
  color: #475569;
  font-size: 12px;
  font-weight: 700;
  margin-bottom: 16px;
`;

const ProcessTitle = styled.h3`
  margin: 0 0 16px;
  font-size: 21px;
  font-weight: 800;
  color: #1f2937;
`;

const ProcessText = styled.p`
  margin: 0;
  font-size: 15px;
  line-height: 1.8;
  color: #6b7280;
`;

const ProcessArrow = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 32px;
  font-weight: 800;
  color: #cbd5e1;
  padding-top: 60px;
  @media (max-width: 980px) {
    display: none;
  }
`;

const Footer = styled.footer`
  width: 100%;
  padding: 40px 0;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #a0a8b3;
  border-top: 1px solid #e5e7eb;
`;
