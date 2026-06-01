import React, { useState, useEffect, useMemo } from "react";
import {
  csvApi,
  type DailyStats,
  type UploadResult,
  type HourlyHeatmap,
} from "../../api/csv_api";
import * as CS from "../../style/Salescsv.Style";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ButtonMain } from "../../components/Common";
import ReactECharts from "echarts-for-react";

type UploadStatus = "idle" | "loading" | "success" | "error";

function fillMonthDates(
  stats: DailyStats[],
  year: number,
  month: number,
): DailyStats[] {
  const map = new Map(stats.map((s) => [s.date, s]));
  const result: DailyStats[] = [];

  const from = new Date(year, month - 1, 1);
  const to = new Date(year, month, 0);

  for (let d = new Date(from); d <= to; d.setDate(d.getDate() + 1)) {
    const key = d.toISOString().split("T")[0];
    result.push(map.get(key) ?? { date: key, amount: 0, count: 0 });
  }
  return result;
}

export default function SalesCSV() {
  const now = new Date();
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1);

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [chartData, setChartData] = useState<DailyStats[]>([]);

  const [heatmapData, setHeatmapData] = useState<HourlyHeatmap[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const totalMonthAmount = useMemo(() => {
    return chartData.reduce((acc, cur) => acc + cur.amount, 0);
  }, [chartData]);

  const hasHeatmapData = useMemo(() => {
    return heatmapData.length > 0 && heatmapData.some((d) => d.amount > 0);
  }, [heatmapData]);

  // 최고 피크 시간대와 가장 한가한 시간대 분석 데이터 추출
  const insightStats = useMemo(() => {
    if (!hasHeatmapData) return null;
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    const validCells = heatmapData.filter((d) => d.amount > 0);
    if (validCells.length === 0) return null;

    const peakCell = [...validCells].sort((a, b) => b.amount - a.amount)[0];
    const idleCell = [...validCells].sort((a, b) => a.amount - b.amount)[0];

    return {
      peak: `${days[peakCell.dayOfWeek >= 1 ? peakCell.dayOfWeek - 1 : peakCell.dayOfWeek]}요일 ${peakCell.hour}시 (${peakCell.amount.toLocaleString()}원)`,
      idle: `${days[idleCell.dayOfWeek >= 1 ? idleCell.dayOfWeek - 1 : idleCell.dayOfWeek]}요일 ${idleCell.hour}시 (${idleCell.amount.toLocaleString()}원)`,
    };
  }, [heatmapData, hasHeatmapData]);

  useEffect(() => {
    const fromDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
    const toDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
      new Date(currentYear, currentMonth, 0).getDate(),
    ).padStart(2, "0")}`;

    const loadStats = async () => {
      try {
        const statsData = await csvApi.getDailyStats(fromDate, toDate);
        setChartData(fillMonthDates(statsData, currentYear, currentMonth));

        const heatmapResponse = await csvApi.getHourlyHeatmap(fromDate, toDate);
        setHeatmapData(heatmapResponse);
      } catch (err) {
        setStatus("error");
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("데이터 분석 중 에러가 발생했습니다.");
        }
      }
    };

    void loadStats();
  }, [currentYear, currentMonth, refreshTrigger]);

  const handlePrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentYear((y) => y - 1);
      setCurrentMonth(12);
    } else {
      setCurrentMonth((m) => m - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentYear((y) => y + 1);
      setCurrentMonth(1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
  };

  // 프리셋 퀵 필터 핸들러
  const handlePresetFilter = (
    type: "thisMonth" | "lastMonth" | "todayMonth",
  ) => {
    const targetDate = new Date();
    if (type === "thisMonth") {
      setCurrentYear(targetDate.getFullYear());
      setCurrentMonth(targetDate.getMonth() + 1);
    } else if (type === "lastMonth") {
      targetDate.setMonth(targetDate.getMonth() - 1);
      setCurrentYear(targetDate.getFullYear());
      setCurrentMonth(targetDate.getMonth() + 1);
    } else if (type === "todayMonth") {
      setCurrentYear(2026);
      setCurrentMonth(5);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setStatus("loading");
    setErrorMessage("");
    setUploadResult(null);

    try {
      const resultData = await csvApi.uploadCsv(file);
      setUploadResult(resultData);
      setStatus("success");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setStatus("error");
      if (err instanceof Error) {
        setErrorMessage(err.message);
      } else {
        setErrorMessage("파일 분석 중 에러가 발생했습니다.");
      }
    }
  };

  const echartsOption = useMemo(() => {
    const days = ["월", "화", "수", "목", "금", "토", "일"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}시`);

    const validAmounts = heatmapData.map((d) => d.amount);
    const maxAmount =
      validAmounts.length > 0 ? Math.max(...validAmounts, 1) : 100000;

    const formattedData = heatmapData.map((d) => {
      const dayIdx = d.dayOfWeek >= 1 ? d.dayOfWeek - 1 : d.dayOfWeek;
      return [
        d.hour, // X축 인덱스 (0 ~ 23)
        dayIdx, // Y축 인덱스 (0 ~ 6)
        d.amount,
        d.count, // 인덱스 3: 주문 건수
      ];
    });
    return {
      tooltip: {
        position: "top",
        formatter: (p: { value: [number, number, number, number] }) => {
          console.log("tooltip value", p.value);

          const [hour, dayIdx, amount, count] = p.value;
          return `${days[dayIdx]}요일 ${hour}시<br/>매출: <b>${amount.toLocaleString()}원</b> (${count || 0}건)`;
        },
      },
      grid: {
        height: "80%",
        top: "4%",
        bottom: "12%",
        left: "6%",
        right: "4%",
      },
      xAxis: {
        type: "category",
        data: hours,
      },
      yAxis: {
        type: "category",
        data: days,
      },
      visualMap: {
        dimension: 2,
        type: "continuous",
        min: 0,
        max: maxAmount,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0%",
        itemWidth: 15,
        inRange: {
          color: ["#f1f5f9", "#e0f2fe", "#7dd3fc", "#0284c7", "#0c4a6e"],
        },
        text: ["최고 매출", "매출 없음"],
        textStyle: { fontSize: 11, color: "#64748b" },
      },
      series: [
        {
          name: "시간대별 매출",
          type: "heatmap",
          data: formattedData,
          encode: {
            x: 0,
            y: 1,
            value: 2,
          },
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.15)",
            },
          },
        },
      ],
    };
  }, [heatmapData]);

  return (
    <CS.Container>
      <h3>매출 입력 - CSV</h3>

      <CS.UploadBox>
        <p>판매전표 CSV 파일을 업로드하여 데이터를 일괄 추가합니다.</p>
        <CS.FileLabel htmlFor="csv-file-input">파일 선택하기</CS.FileLabel>
        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          disabled={status === "loading"}
        />
      </CS.UploadBox>

      {status === "loading" && (
        <CS.StatusBadge $status="loading">
          파일 데이터 분석 중...
        </CS.StatusBadge>
      )}
      {status === "error" && (
        <CS.StatusBadge $status="error">
          분석 실패: {errorMessage}
        </CS.StatusBadge>
      )}
      {status === "success" && (
        <CS.StatusBadge $status="success">분석 완료!</CS.StatusBadge>
      )}

      {uploadResult && (
        <CS.ResultSummary>
          <strong>처리 요약 리포트</strong>
          <div>
            • 총 행 수: {uploadResult.totalRows}건 | 성공:{" "}
            {uploadResult.savedCount}건 | 스킵: {uploadResult.skippedCount}건
          </div>
        </CS.ResultSummary>
      )}

      <CS.ChartHeader>
        <CS.CalendarTitle>
          {currentYear}년 {currentMonth}월 데이터 분석 리포트
        </CS.CalendarTitle>
        <CS.ButtonGroup>
          <CS.ButtonWrapper>
            <ButtonMain onClick={handlePrevMonth}>이전달</ButtonMain>
          </CS.ButtonWrapper>
          <CS.ButtonWrapper>
            <ButtonMain onClick={handleNextMonth}>다음달</ButtonMain>
          </CS.ButtonWrapper>
        </CS.ButtonGroup>
      </CS.ChartHeader>

      <CS.ChartWrapper>
        <CS.SectionTitle>일별 매출 추이</CS.SectionTitle>
        {totalMonthAmount === 0 ? (
          <CS.EmptyDataBox>
            해당 월의 판매전표 내역이 비어있습니다.
          </CS.EmptyDataBox>
        ) : (
          <ResponsiveContainer width="100%" height={260}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                style={{ fontSize: "11px" }}
                tickFormatter={(t) => t.slice(5)}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: "11px" }}
                tickFormatter={(v) => `${(v / 10000).toLocaleString()}만`}
              />
              <RechartsTooltip
                formatter={(v) => [`${Number(v).toLocaleString()}원`, "매출액"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#0284c7"
                strokeWidth={2}
                dot={{ r: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CS.ChartWrapper>

      <CS.ChartWrapper>
        <CS.SectionTitle>요일 × 시간대별 매출 집중도</CS.SectionTitle>
        {!hasHeatmapData ? (
          <CS.EmptyDataBox>
            분석할 매출 레이아웃이 존재하지 않습니다.
          </CS.EmptyDataBox>
        ) : (
          <CS.FlexRow>
            <CS.ChartPane>
              <ReactECharts
                option={echartsOption}
                style={{ height: "360px", width: "100%" }}
              />
            </CS.ChartPane>

            <CS.InsightPane>
              {insightStats && (
                <CS.SidebarSection>
                  <CS.SidebarTitle>데이터 인사이트 리포트</CS.SidebarTitle>
                  <CS.InsightCard $type="peak">
                    <div className="label">이번 달 피크 시간대</div>
                    <div className="value">{insightStats.peak}</div>
                  </CS.InsightCard>
                  <CS.InsightCard $type="idle">
                    <div className="label">한가한 시간대</div>
                    <div className="value">{insightStats.idle}</div>
                  </CS.InsightCard>
                </CS.SidebarSection>
              )}
            </CS.InsightPane>
          </CS.FlexRow>
        )}
      </CS.ChartWrapper>
    </CS.Container>
  );
}
