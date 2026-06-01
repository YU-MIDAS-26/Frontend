import { useState, useEffect } from "react";
import * as S from "../../style/SalesManage.Style";
import { toYearMonth, useAiInsight } from "./salesApi";
import { A_SCOPE } from "./salesBackendScope";
import { ScopeNotice } from "./salesManageUi";

type Props = {
  isActive: boolean;
  refreshKey: number;
};

export default function SalesReport({ isActive, refreshKey }: Props) {
  const now = new Date();
  const [year, setYear] = useState(now.getFullYear());
  const [monthIndex, setMonthIndex] = useState(now.getMonth());
  const yearMonth = toYearMonth(year, monthIndex);
  const { data, isLoading, isError, error, refetch, isFetching } = useAiInsight(
    yearMonth,
    true,
  );

  useEffect(() => {
    if (!isActive) return;
    void refetch();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, refreshKey, yearMonth]);

  return (
    <>
      <S.Section>
        <S.SectionTitle>보고서 확인</S.SectionTitle>
        {A_SCOPE.aiInsightReport && (
          <ScopeNotice>
            GET /api/finance/ai-insight — 당월 데이터 기반 AI 요약 (본문 언어는 서버 응답
            기준)
          </ScopeNotice>
        )}
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
        {isFetching && isActive && (
          <S.Value style={{ fontSize: 13, color: "#555" }}>보고서 갱신 중...</S.Value>
        )}
        {data?.coreSummary && <S.SubTitle>{data.coreSummary}</S.SubTitle>}
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
            <S.CardTitle>한눈에 볼 수 있는 추천내용</S.CardTitle>
            <S.List>
              {data.recommendations.map((t) => (
                <li key={t}>{t}</li>
              ))}
            </S.List>
            <S.Highlight>{data.financeSummary}</S.Highlight>
          </S.Card>
          <S.Card>
            <S.CardTitle>데이터 기반 요약</S.CardTitle>
            <S.List>
              <li>{data.salesFlow}</li>
              <li>{data.additionalInsight}</li>
            </S.List>
            <S.Highlight>{data.coreSummary}</S.Highlight>
          </S.Card>
        </S.ReportGrid>
      )}
    </>
  );
}
