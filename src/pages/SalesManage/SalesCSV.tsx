import React, { useState, useEffect, useMemo } from "react";
import { csvApi, type DailyStats, type UploadResult } from "../../api/csv_api";
import * as CS from "../../style/Salescsv.Style";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { ButtonMain } from "../../components/Common";
import styled from "styled-components";

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
  const [currentMonth, setCurrentMonth] = useState(now.getMonth() + 1); // 1월 ~ 12월

  const [status, setStatus] = useState<UploadStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const [uploadResult, setUploadResult] = useState<UploadResult | null>(null);
  const [chartData, setChartData] = useState<DailyStats[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const totalMonthAmount = useMemo(() => {
    return chartData.reduce((acc, cur) => acc + cur.amount, 0);
  }, [chartData]);

  useEffect(() => {
    const fromDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-01`;
    const toDate = `${currentYear}-${String(currentMonth).padStart(2, "0")}-${String(
      new Date(currentYear, currentMonth, 0).getDate(),
    ).padStart(2, "0")}`;

    const loadStats = async () => {
      try {
        const statsData = await csvApi.getDailyStats(fromDate, toDate);
        setChartData(fillMonthDates(statsData, currentYear, currentMonth));
      } catch (err) {
        setStatus("error");
        if (err instanceof Error) {
          setErrorMessage(err.message);
        } else {
          setErrorMessage("파일 분석 중 에러가 발생했습니다.");
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

  return (
    <CS.Container>
      <h3>매출 입력 - CSV</h3>

      <CS.UploadBox>
        <p>판매전표 CSV 파일을 업로드하여 데이터를 일괄 적재합니다.</p>
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
          파일 데이터 분석 중입니다...
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
          <div>• 총 행 수: {uploadResult.totalRows}건</div>
          <div>• 성공적으로 반영된 매출: {uploadResult.savedCount}건</div>
          <div>• 스킵된 데이터 건수: {uploadResult.skippedCount}건</div>
        </CS.ResultSummary>
      )}

      <CS.ChartWrapper>
        <ChartHeader>
          <h4>
            {currentYear}년 {currentMonth}월 매출 추이
          </h4>
          <ButtonGroup>
            <ButtonWrapper>
              <ButtonMain onClick={handlePrevMonth}>이전달</ButtonMain>
            </ButtonWrapper>
            <ButtonWrapper>
              <ButtonMain onClick={handleNextMonth}>다음달</ButtonMain>
            </ButtonWrapper>
          </ButtonGroup>
        </ChartHeader>

        {totalMonthAmount === 0 ? (
          <EmptyDataBox>
            받은 데이터가 없습니다. (해당 월의 판매전표 내역이 비어있습니다.)
          </EmptyDataBox>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                dataKey="date"
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tickFormatter={(tick) => tick.slice(5)}
              />
              <YAxis
                stroke="#64748b"
                style={{ fontSize: "12px" }}
                tickFormatter={(val) => `${(val / 10000).toLocaleString()}만`}
              />
              <Tooltip
                formatter={(v) => [`${Number(v).toLocaleString()}원`, "매출액"]}
              />
              <Line
                type="monotone"
                dataKey="amount"
                stroke="#7ea0b7"
                strokeWidth={2.5}
                dot={{ r: 3 }}
                activeDot={{ r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        )}
      </CS.ChartWrapper>
    </CS.Container>
  );
}

const ChartHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const ButtonWrapper = styled.div`
  width: 90px;
  height: 38px;
`;

const EmptyDataBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 250px;
  background: #f8fafc;
  border-radius: 8px;
  color: #64748b;
  font-size: 14px;
  border: 1px dashed #cbd5e1;
`;
