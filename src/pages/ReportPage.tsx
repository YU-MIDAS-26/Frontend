import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const Page = styled.main`
  min-height: calc(1024px - 70px);
  background: #dfe1e5;
  padding: 24px;
  box-sizing: border-box;
`;

const Header = styled.section`
  background: #ffffff;
  border: 1px solid #d0d4d9;
  border-radius: 8px;
  padding: 16px;
  margin-bottom: 14px;
`;

const HeaderRow = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;
`;

const Title = styled.h2`
  margin: 0;
  color: #101010;
  font-size: 24px;
  font-weight: 700;
`;

const SubTitle = styled.p`
  margin: 0;
  color: #2a2a2a;
  font-size: 15px;
  line-height: 1.5;
`;

const Grid = styled.section`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
`;

const Card = styled.article`
  background: #ffffff;
  border: 1px solid #d0d4d9;
  border-radius: 8px;
  padding: 16px;
`;

const CardTitle = styled.h3`
  margin: 0 0 10px;
  color: #111;
  font-size: 18px;
  font-weight: 700;
`;

const List = styled.ul`
  margin: 0;
  padding-left: 20px;
  color: #202020;
  font-size: 15px;
  line-height: 1.7;
`;

const Highlight = styled.div`
  margin-top: 12px;
  padding: 10px 12px;
  border-radius: 6px;
  background: #e9f2f8;
  border: 1px solid #c3d8e7;
  color: #17212b;
  font-size: 14px;
  line-height: 1.5;
`;

const BackButton = styled.button`
  border: 1px solid #7ea0b7;
  background: #7ea0b7;
  color: #111111;
  font-size: 14px;
  font-weight: 700;
  padding: 8px 14px;
  border-radius: 6px;
  cursor: pointer;
`;

export default function ReportPage() {
  const navigate = useNavigate();

  return (
    <Page>
      <Header>
        <HeaderRow>
          <Title>보고서 확인</Title>
          <BackButton type="button" onClick={() => navigate("/sales-check")}>
            뒤로가기
          </BackButton>
        </HeaderRow>
        <SubTitle>
          뉴스, 원가 변동, 최근 매출 추세를 조합해 한눈에 실행할 수 있는 추천
          내용을 제공합니다.
        </SubTitle>
      </Header>

      <Grid>
        <Card>
          <CardTitle>한눈에 볼 수 있는 추천내용</CardTitle>
          <List>
            <li>
              내일은 벚꽃 축제가 있어 유동 인구가 증가할 가능성이 높으니 재료를
              평소보다 12% 더 준비하세요.
            </li>
            <li>
              미국-이란 분쟁 이슈로 일부 수입 식자재 단가 인상이 예상되어 대체
              재료 비중을 검토하세요.
            </li>
            <li>
              최근 2주 매출이 우상향 곡선을 보여 피크 시간대(12~14시, 18~20시)
              인력 1명 추가 배치를 권장합니다.
            </li>
            <li>
              음료/사이드 메뉴의 마진율이 높아 세트 구성 노출을 강화하면 총수익
              개선에 유리합니다.
            </li>
          </List>
          <Highlight>
            종합 권고: 고원가 품목은 선구매 리스크를 줄이고, 고마진 품목
            중심으로 재고와 판매 전략을 조정하세요.
          </Highlight>
        </Card>

        <Card>
          <CardTitle>데이터 기반 요약</CardTitle>
          <List>
            <li>방문 이벤트 영향 지수: 높음 (전일 대비 +18% 예상)</li>
            <li>식자재 원가 변동 지수: 상승 (주요 수입 품목 +4~7% 리스크)</li>
            <li>시간대 집중도: 점심/저녁 피크에 매출 55% 이상 집중</li>
            <li>
              운영 액션 우선순위: 재고 확보 &gt; 피크 인력 조정 &gt; 프로모션
              문구 최적화
            </li>
          </List>
          <Highlight>
            실행 체크: 오전 발주 수량 확정, 점심 전 재고 점검, 저녁 피크 전 인력
            재배치까지 당일 완료를 권장합니다.
          </Highlight>
        </Card>
      </Grid>
    </Page>
  );
}
