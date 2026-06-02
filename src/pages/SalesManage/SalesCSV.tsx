import React, { useState, useEffect, useMemo } from "react";
import {
  csvApi,
  type DailyStats,
  type UploadResult,
  type HourlyHeatmap,
  type ChannelBreakdown,
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
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import { ButtonMain } from "../../components/Common";
import ReactECharts from "echarts-for-react";

type UploadStatus = "idle" | "loading" | "success" | "error";

const CHANNEL_COLORS = {
  OFFLINE: "#3b82f6", // 매장: 파랑
  DELIVERY: "#f59e0b", // 배달: 주황
};

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
  const [channelData, setChannelData] = useState<ChannelBreakdown[]>([]); // 채널 데이터 상태 추가
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const totalMonthAmount = useMemo(() => {
    return chartData.reduce((acc, cur) => acc + cur.amount, 0);
  }, [chartData]);

  const hasLineData = useMemo(() => {
    return chartData.length > 0 && chartData.some((d) => d.amount > 0);
  }, [chartData]);

  const hasHeatmapData = useMemo(() => {
    return heatmapData.length > 0 && heatmapData.some((d) => d.amount > 0);
  }, [heatmapData]);

  useEffect(() => {
    const fromDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
    const toDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
      new Date(currentYear, currentMonth, 0).getDate(),
    ).padStart(2, "0")}`;

    const loadData = async () => {
      try {
        const [statsData, heatmapResponse, channelResponse] = await Promise.all(
          [
            csvApi.getDailyStats(fromDate, toDate),
            csvApi.getHourlyHeatmap(fromDate, toDate),
            csvApi.getChannelStats(fromDate, toDate),
          ],
        );

        setChartData(fillMonthDates(statsData, currentYear, currentMonth));
        setHeatmapData(heatmapResponse);
        setChannelData(channelResponse);
      } catch (err) {
        console.error(err);
      }
    };

    void loadData();
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

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files || e.target.files.length === 0) return;
    const file = e.target.files[0];

    setStatus("loading");
    try {
      const result = await csvApi.uploadCsv(file);
      setUploadResult(result);
      setStatus("success");
      setRefreshTrigger((prev) => prev + 1);
    } catch (err) {
      setStatus("error");
      setErrorMessage(
        err instanceof Error ? err.message : "알 수 없는 에러가 발생했습니다.",
      );
    }
  };

  interface EChartsTooltipParams {
    value: [string | number, number, number];
  }

  const echartsOption = useMemo(() => {
    const days = ["월", "화", "수", "목", "금", "토", "일"];
    const hours = Array.from({ length: 24 }, (_, i) => `${i}시`);

    const validAmounts = heatmapData.map((d) => d.amount);
    const maxAmount =
      validAmounts.length > 0 ? Math.max(...validAmounts, 1) : 100000;

    const formattedData = heatmapData.map((d) => {
      const dayIndex = d.dayOfWeek >= 1 ? d.dayOfWeek - 1 : 6;
      return [d.hour, dayIndex, d.amount];
    });

    return {
      tooltip: {
        position: "top",
        formatter: (params: EChartsTooltipParams) => {
          const hour = params.value[0];
          const dayName = days[params.value[1]];
          const amount = params.value[2];
          return `${dayName}요일 ${hour}시<br/>매출: <b>${amount.toLocaleString()}원</b>`;
        },
      },
      grid: {
        height: "75%",
        top: "4%",
        bottom: "15%",
        left: "6%",
        right: "4%",
      },
      xAxis: {
        type: "category",
        data: hours,
        splitArea: { show: true },
      },
      yAxis: {
        type: "category",
        data: days,
        splitArea: { show: true },
      },
      visualMap: {
        min: 0,
        max: maxAmount,
        calculable: true,
        orient: "horizontal",
        left: "center",
        bottom: "0%",
        inRange: {
          color: ["#f1f5f9", "#e0f2fe", "#7dd3fc", "#0284c7", "#0c4a6e"],
        },
      },
      series: [
        {
          name: "매출액",
          type: "heatmap",
          data: formattedData,
          label: { show: false },
          emphasis: {
            itemStyle: {
              shadowBlur: 10,
              shadowColor: "rgba(0, 0, 0, 0.5)",
            },
          },
        },
      ],
    };
  }, [heatmapData]);

  const insightStats = useMemo(() => {
    if (heatmapData.length === 0) return null;
    const days = ["월", "화", "수", "목", "금", "토", "일"];

    let maxItem = heatmapData[0];
    let minItem = heatmapData[0];

    heatmapData.forEach((d) => {
      if (d.amount > maxItem.amount) maxItem = d;
      if (d.amount < minItem.amount && d.amount > 0) minItem = d;
    });

    const maxDayIdx = maxItem.dayOfWeek >= 1 ? maxItem.dayOfWeek - 1 : 6;
    const minDayIdx = minItem.dayOfWeek >= 1 ? minItem.dayOfWeek - 1 : 6;

    return {
      peak: `${days[maxDayIdx]}요일 ${maxItem.hour}시 (${maxItem.amount.toLocaleString()}원)`,
      idle:
        minItem.amount === 0
          ? "데이터 없음"
          : `${days[minDayIdx]}요일 ${minItem.hour}시 (${minItem.amount.toLocaleString()}원)`,
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

      {status === "error" && (
        <CS.StatusBadge $status="error">
          분석 실패: {errorMessage}
        </CS.StatusBadge>
      )}
      {status === "success" && (
        <CS.StatusBadge $status="success">
          분석 완료! 성공적으로 저장되었습니다.
        </CS.StatusBadge>
      )}

      <CS.ChartHeader>
        <CS.CalendarTitle>
          {currentYear}년 {currentMonth}월 리포트
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
      <CS.FlexRow>
        <CS.ChartPane style={{ flex: 1.3 }}>
          <CS.ChartWrapper>
            <CS.SectionTitle>일별 매출 추이</CS.SectionTitle>
            {!hasLineData ? (
              <CS.EmptyDataBox>
                분석할 매출 레이아웃이 존재하지 않습니다.
              </CS.EmptyDataBox>
            ) : (
              <ResponsiveContainer width="100%" height={260}>
                <LineChart
                  data={chartData}
                  margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                  <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                  <XAxis
                    dataKey="date"
                    tickFormatter={(t) => t.slice(5)}
                    style={{ fontSize: "11px" }}
                  />
                  <YAxis
                    tickFormatter={(v) => `${(v / 10000).toLocaleString()}만`}
                    style={{ fontSize: "11px" }}
                  />
                  <RechartsTooltip
                    formatter={(value) => [
                      `${Number(value).toLocaleString()}원`,
                      "매출액",
                    ]}
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
        </CS.ChartPane>

        <CS.InsightPane
          style={{ flex: 0.7, background: "#fff", padding: 0, border: "none" }}
        >
          <CS.ChartWrapper style={{ width: "100%", margin: 0 }}>
            <CS.SectionTitle>채널별 매출 비중</CS.SectionTitle>
            {channelData.length === 0 ||
            !channelData.some((d) => d.amount > 0) ? (
              <CS.EmptyDataBox>채널별 데이터가 없습니다.</CS.EmptyDataBox>
            ) : (
              <CS.DonutContainer>
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={channelData}
                      dataKey="amount"
                      nameKey="label"
                      cx="50%"
                      cy="50%"
                      innerRadius={55}
                      outerRadius={80}
                      paddingAngle={4}
                    >
                      {channelData.map((entry) => (
                        <Cell
                          key={entry.channel}
                          fill={CHANNEL_COLORS[entry.channel] || "#cbd5e1"}
                        />
                      ))}
                    </Pie>
                    <RechartsTooltip
                      formatter={(v: unknown) =>
                        `${Number(v || 0).toLocaleString()}원`
                      }
                    />
                    <Legend
                      verticalAlign="bottom"
                      height={32}
                      iconSize={10}
                      style={{ fontSize: "12px" }}
                    />
                  </PieChart>
                </ResponsiveContainer>
                <CS.DonutCenterText>
                  <div className="total-amount">
                    {totalMonthAmount.toLocaleString()}원
                  </div>
                  <div className="label">총 매출</div>
                </CS.DonutCenterText>
              </CS.DonutContainer>
            )}
          </CS.ChartWrapper>
        </CS.InsightPane>
      </CS.FlexRow>

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
