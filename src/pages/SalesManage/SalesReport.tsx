import { useState } from "react";
import * as S from "../../style/SalesManage.Style";
import { toYearMonth, useAiInsight } from "../../api/sales_api";

export default function SalesReport() {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const yearMonth = toYearMonth(year, monthIndex);
  const { data, isLoading, isError, error, isFetching } = useAiInsight(yearMonth);

  return (
    <>
      <S.Section>
        <S.SectionTitle>보고서 확인</S.SectionTitle>
        <S.CalendarHeader>
          <S.CalendarTitle>
            {year}년 {monthIndex + 1}월 AI 경영 보고서
          </S.CalendarTitle>
          <S.NavButtons>
            <S.NavButton
              type="button"
              onClick={() => {
                const b = new Date(year, monthIndex - 1, 1);
                setYear(b.getFullYear());
                setMonthIndex(b.getMonth());
              }}
            >
              이전 달
            </S.NavButton>
            <S.NavButton
              type="button"
              onClick={() => {
                const b = new Date(year, monthIndex + 1, 1);
                setYear(b.getFullYear());
                setMonthIndex(b.getMonth());
              }}
            >
              다음 달
            </S.NavButton>
          </S.NavButtons>
        </S.CalendarHeader>
        {isFetching && (
          <S.Value style={{ fontSize: 13, color: "#555" }}>보고서 갱신 중...</S.Value>
        )}
      </S.Section>
      {isLoading && (
        <S.Section>
          <S.Value>불러오는 중...</S.Value>
        </S.Section>
      )}
      {isError && (
        <S.Section>
          <S.Value>{error instanceof Error ? error.message : "조회 실패"}</S.Value>
        </S.Section>
      )}
      {data && (
        <S.ReportGrid>
          <S.Card>
            {data.coreSummary.trim() && (
              <>
                <S.CardTitle>핵심 요약</S.CardTitle>
                <S.Highlight>{data.coreSummary}</S.Highlight>
              </>
            )}
            <S.CardTitle>한눈에 볼 수 있는 추천내용</S.CardTitle>
            {data.recommendations.length > 0 ? (
              <S.List>
                {data.recommendations.map((t) => (
                  <li key={t}>{t}</li>
                ))}
              </S.List>
            ) : (
              <S.Value>추천 내용이 없습니다.</S.Value>
            )}
            {data.financeSummary.trim() && (
              <S.Highlight>{data.financeSummary}</S.Highlight>
            )}
          </S.Card>
          <S.Card>
            <S.CardTitle>데이터 기반 요약</S.CardTitle>
            {data.salesFlow.trim() ? (
              <S.List>
                <li>{data.salesFlow}</li>
              </S.List>
            ) : (
              <S.Value>요약 데이터가 없습니다.</S.Value>
            )}
            {data.additionalInsight.trim() && (
              <>
                <S.CardTitle style={{ marginTop: 16 }}>추가 인사이트</S.CardTitle>
                <S.Highlight>{data.additionalInsight}</S.Highlight>
              </>
            )}
          </S.Card>
        </S.ReportGrid>
      )}
    </>
  );
}
