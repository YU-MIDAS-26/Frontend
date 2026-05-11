import * as S from "../../style/SalesManage.Style";

export default function SalesReport() {
  return (
    <>
      <S.Section>
        <S.SectionTitle>보고서 확인</S.SectionTitle>
        <S.SubTitle>
          뉴스, 원가 변동, 최근 매출 추세를 조합해 한눈에 실행할 수 있는 추천
          내용을 제공합니다.
        </S.SubTitle>
      </S.Section>

      <S.ReportGrid>
        <S.Card>
          <S.CardTitle>한눈에 볼 수 있는 추천내용</S.CardTitle>
          <S.List>
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
          </S.List>
          <S.Highlight>
            종합 권고: 고원가 품목은 선구매 리스크를 줄이고, 고마진 품목
            중심으로 재고와 판매 전략을 조정하세요.
          </S.Highlight>
        </S.Card>

        <S.Card>
          <S.CardTitle>데이터 기반 요약</S.CardTitle>
          <S.List>
            <li>방문 이벤트 영향 지수: 높음 (전일 대비 +18% 예상)</li>
            <li>식자재 원가 변동 지수: 상승 (주요 수입 품목 +4~7% 리스크)</li>
            <li>시간대 집중도: 점심/저녁 피크에 매출 55% 이상 집중</li>
            <li>
              운영 액션 우선순위: 재고 확보 &gt; 피크 인력 조정 &gt; 프로모션
              문구 최적화
            </li>
          </S.List>
          <S.Highlight>
            실행 체크: 오전 발주 수량 확정, 점심 전 재고 점검, 저녁 피크 전 인력
            재배치까지 당일 완료를 권장합니다.
          </S.Highlight>
        </S.Card>
      </S.ReportGrid>
    </>
  );
}
