import { useEffect, useState, useMemo } from "react";
import styled from "styled-components";
import {
  ingredientApi,
  naverApi,
  priceApi,
  type IngredientData,
  type NaverShopItem,
  type PriceRecord,
} from "../api/ingredient_api";
import {
  ButtonMain,
  ButtonSelected,
  ButtonSub,
  TextField,
} from "../components/Common";

const Page = styled.main`
  min-height: calc(100vh - 70px);
  background: var(--app-page-bg, #f8fafc);
  padding: 28px 24px 48px;
`;

const Container = styled.div`
  max-width: 1120px;
  margin: 0 auto;
`;

const Section = styled.section`
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 22px 24px;
  margin-bottom: 20px;
`;

const Title = styled.h2`
  margin: 0 0 16px;
  font-size: 19px;
  font-weight: 700;
  color: #0f172a;
`;

const SubDesc = styled.p`
  font-size: 13px;
  color: #64748b;
  margin: -10px 0 18px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 180px;
  gap: 10px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  height: 44px;
  border: 1px solid #cbd5e1;
  background: #ffffff;
  border-radius: 8px;
  padding: 0 14px;
  font-size: 14px;
  color: #0f172a;
  outline: none;
  box-sizing: border-box;
  cursor: pointer;
  transition:
    border-color 0.15s ease,
    box-shadow 0.15s ease;

  &:focus {
    border-color: #7ea0b7;
    box-shadow: 0 0 0 3px rgba(126, 160, 183, 0.2);
  }
`;

const CardGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const Card = styled.div`
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  padding: 14px 18px;
  background: #ffffff;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
  transition: border-color 0.15s ease;

  &:hover {
    border-color: #cbd5e1;
  }
`;

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
  min-width: 0;
  flex: 1;
`;

const EllipsisText = styled.strong`
  display: block;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-size: 15px;
  color: #0f172a;
`;

const ButtonGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  flex-shrink: 0;
`;

const SmallActionBtn = styled.button<{ $danger?: boolean }>`
  height: 36px;
  padding: 0 14px;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  background: #ffffff;
  border: 1px solid ${({ $danger }) => ($danger ? "#fca5a5" : "#cbd5e1")};
  color: ${({ $danger }) => ($danger ? "#ef4444" : "#475569")};
  transition: all 0.15s ease;

  &:hover {
    background: ${({ $danger }) => ($danger ? "#fef2f2" : "#f8fafc")};
    border-color: ${({ $danger }) => ($danger ? "#ef4444" : "#94a3b8")};
    color: ${({ $danger }) => ($danger ? "#dc2626" : "#0f172a")};
  }

  &:active {
    transform: scale(0.98);
  }
`;

const FixedWidthButtonWrapper = styled.div`
  width: 106px;
  height: 36px;
  flex-shrink: 0;
`;

const ActionPillWrapper = styled.div`
  min-width: 92px;
  height: 36px;
`;

const ActionButtonWrapper = styled.div`
  width: 100%;
  height: 44px;
`;

const Small = styled.span`
  color: #64748b;
  font-size: 13px;
`;

/* ===== KAMIS 시세 분석실 전용 스타일 ===== */

const KamisSearchRow = styled.div`
  display: grid;
  grid-template-columns: 140px 1fr 110px;
  gap: 10px;
  max-width: 640px;
  margin-bottom: 22px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const KamisHeaderCard = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
  padding: 16px 20px;
  background: #f8fafc;
  border: 1px solid #e2e8f0;
  border-radius: 10px;
  margin-bottom: 16px;
`;

const KamisSummaryGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;
  margin-bottom: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const SummaryBox = styled.div<{ $highlight?: boolean }>`
  padding: 16px 18px;
  border-radius: 10px;
  border: 1px solid ${({ $highlight }) => ($highlight ? "#bfd3e0" : "#e2e8f0")};
  background: ${({ $highlight }) => ($highlight ? "#f2f7fa" : "#ffffff")};
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const SummaryLabel = styled.span`
  font-size: 12px;
  font-weight: 600;
  color: #64748b;
`;

const SummaryValue = styled.strong<{ $tone?: "up" | "down" | "neutral" }>`
  font-size: 20px;
  font-weight: 700;
  font-variant-numeric: tabular-nums;
  color: ${({ $tone }) =>
    $tone === "up" ? "#dc2626" : $tone === "down" ? "#2563eb" : "#0f172a"};
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  background: #ffffff;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

const ChartBarRow = styled.div`
  display: grid;
  grid-template-columns: 84px 1fr 96px;
  align-items: center;
  gap: 14px;
`;

const ChartLabel = styled.span<{ $bold?: boolean; $accent?: boolean }>`
  font-size: 13px;
  font-weight: ${({ $bold }) => ($bold ? 700 : 500)};
  color: ${({ $accent, $bold }) =>
    $accent ? "#0f766e" : $bold ? "#0f172a" : "#475569"};
`;

const BarWrapper = styled.div`
  background: #f1f5f9;
  border-radius: 999px;
  height: 12px;
  width: 100%;
  overflow: hidden;
`;

const ActiveBar = styled.div<{
  $widthPercent: number;
  $variant?: "today" | "avg" | "past";
}>`
  width: ${(props) => props.$widthPercent}%;
  height: 100%;
  border-radius: 999px;
  background: ${({ $variant }) =>
    $variant === "today"
      ? "#4f738e"
      : $variant === "avg"
        ? "#14b8a6"
        : "#94b4c9"};
  transition: width 0.5s cubic-bezier(0.4, 0, 0.2, 1);
`;

const PriceText = styled.span<{ $bold?: boolean; $accent?: boolean }>`
  text-align: right;
  font-size: 13px;
  font-variant-numeric: tabular-nums;
  font-weight: ${({ $bold }) => ($bold ? 700 : 500)};
  color: ${({ $accent, $bold }) =>
    $accent ? "#0f766e" : $bold ? "#0f172a" : "#334155"};
`;

interface IngredientItem extends IngredientData {
  showStores?: boolean;
  stores?: NaverShopItem[];
  loadingStores?: boolean;
}

export default function IngredientPage() {
  const [ingredients, setIngredients] = useState<IngredientItem[]>([]);

  const [name, setName] = useState("");
  const [unitValue, setUnitValue] = useState("");
  const [unitType, setUnitType] = useState("kg");

  const [editingId, setEditingId] = useState<number | null>(null);

  const [priceSearchKeyword, setPriceSearchKeyword] = useState("");
  const [searchedPriceData, setSearchedPriceData] =
    useState<PriceRecord | null>(null);
  const [isPriceLoading, setIsPriceLoading] = useState(false);

  const [categoryCode, setCategoryCode] = useState<string>("");

  useEffect(() => {
    const fetchIngredients = async () => {
      try {
        const res = await ingredientApi.getIngredients();
        if (res.status === "SUCCESS") {
          setIngredients(res.data);
        }
      } catch (error) {
        console.error(error);
        alert("재료 목록을 불러오는 중 오류가 발생했습니다.");
      }
    };
    fetchIngredients();
  }, []);

  const handleAdd = async () => {
    if (!name.trim() || !unitValue.trim()) {
      alert("재료명과 단위를 모두 입력해주세요.");
      return;
    }

    const combinedUnit = `${unitValue.trim()}${unitType}`;

    if (editingId !== null) {
      try {
        const res = await ingredientApi.updateIngredient(editingId, {
          name: name.trim(),
          unit: combinedUnit,
        });

        if (res.status === "SUCCESS") {
          alert("재료 정보가 성공적으로 수정되었습니다.");

          setIngredients((prev) =>
            prev.map((item) =>
              item.id === editingId ? { ...item, ...res.data } : item,
            ),
          );

          setName("");
          setUnitValue("");
          setEditingId(null);
        }
      } catch (error) {
        console.error(error);
        alert("재료 수정에 실패했습니다.");
      }
      return;
    }

    const isDuplicate = ingredients.some(
      (item) => item.name && item.name.trim() === name.trim(),
    );

    if (isDuplicate) {
      alert(
        `[${name.trim()}]은(는) 이미 등록된 재료입니다. 기존 재료를 확인해 주세요!`,
      );
      return;
    }

    try {
      const res = await ingredientApi.createIngredient({
        name: name.trim(),
        unit: combinedUnit,
      });

      if (res.status === "SUCCESS") {
        alert("재료가 등록되었습니다.");
        setName("");
        setUnitValue("");

        const newInven: IngredientItem = res.data;
        setIngredients((prev) => {
          if (prev.some((item) => item.id === newInven.id)) return prev;
          return [...prev, newInven];
        });
      }
    } catch (error) {
      console.error(error);
      alert("재료 등록에 실패했습니다.");
    }
  };

  const handleDelete = async (id: number) => {
    if (
      !confirm("정말 이 재료를 삭제하시겠습니까? 삭제 시 복구할 수 없습니다.")
    )
      return;

    try {
      const res = await ingredientApi.deleteIngredient(id);
      if (res.status === "SUCCESS") {
        alert("재료가 영구 삭제되었습니다.");
        setIngredients((prev) => prev.filter((item) => item.id !== id));
      }
    } catch (error) {
      console.error(error);
      alert("서버 통신 실패로 재료를 삭제하지 못했습니다.");
    }
  };

  const handleEdit = (item: IngredientItem) => {
    setName(item.name);

    const numberMatch = item.unit.match(/^[\d.]+/);
    const unitMatch = item.unit.replace(/^[\d.]+/, "").trim();

    if (numberMatch) {
      setUnitValue(numberMatch[0]);
      setUnitType(
        ["kg", "g", "개", "ml", "L"].includes(unitMatch) ? unitMatch : "kg",
      );
    } else {
      setUnitValue("");
      setUnitType("kg");
    }

    setEditingId(item.id);
  };

  const handleShowStores = async (item: IngredientItem) => {
    if (item.showStores) {
      setIngredients((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, showStores: false } : i)),
      );
      return;
    }

    if (!item.stores) {
      setIngredients((prev) =>
        prev.map((i) =>
          i.id === item.id
            ? { ...i, loadingStores: true, showStores: true }
            : i,
        ),
      );

      try {
        const res = await naverApi.getLowestPrice(item.name, 5);
        if (res.status === "SUCCESS") {
          setIngredients((prev) =>
            prev.map((i) =>
              i.id === item.id
                ? { ...i, stores: res.data.items, loadingStores: false }
                : i,
            ),
          );
        }
      } catch (error) {
        console.error(error);
        alert("최저가 정보를 가져오지 못했습니다.");
        setIngredients((prev) =>
          prev.map((i) =>
            i.id === item.id
              ? { ...i, loadingStores: false, showStores: false }
              : i,
          ),
        );
      }
    } else {
      setIngredients((prev) =>
        prev.map((i) => (i.id === item.id ? { ...i, showStores: true } : i)),
      );
    }
  };

  const handleFetchKamisPrice = async (targetName: string) => {
    if (!targetName.trim()) {
      alert("검색할 품목명을 입력해 주세요.");
      return;
    }

    setIsPriceLoading(true);
    setSearchedPriceData(null);

    try {
      const res = await priceApi.getPriceList(
        targetName.trim(),
        categoryCode || undefined,
      );

      if (res.status === "SUCCESS" && res.data.length > 0) {
        setSearchedPriceData(res.data[0]);
      } else {
        alert(`[${targetName}] 시세 데이터가 없습니다.`);
      }
    } catch (error) {
      console.error(error);
      alert("시세 데이터를 조회하는 중 서버 에러가 발생했습니다.");
    } finally {
      setIsPriceLoading(false);
    }
  };

  const calculateBarWidth = (currentPrice: number | null, maxPrice: number) => {
    if (!currentPrice || !maxPrice) return 0;
    return Math.max(6, Math.round((currentPrice / maxPrice) * 100));
  };

  const maxPeriodPrice = useMemo(() => {
    if (!searchedPriceData) return 0;
    const {
      priceToday,
      price1dAgo,
      price1wAgo,
      price2wAgo,
      price1mAgo,
      price1yAgo,
      priceAvgYear,
    } = searchedPriceData;
    return Math.max(
      priceToday ?? 0,
      price1dAgo ?? 0,
      price1wAgo ?? 0,
      price2wAgo ?? 0,
      price1mAgo ?? 0,
      price1yAgo ?? 0,
      priceAvgYear ?? 0,
      1,
    );
  }, [searchedPriceData]);

  const diffFromAvg = useMemo(() => {
    if (
      !searchedPriceData ||
      !searchedPriceData.priceToday ||
      !searchedPriceData.priceAvgYear
    ) {
      return null;
    }
    const diff = searchedPriceData.priceToday - searchedPriceData.priceAvgYear;
    const rate = ((diff / searchedPriceData.priceAvgYear) * 100).toFixed(1);
    return { diff, rate };
  }, [searchedPriceData]);

  const chartRows = useMemo(() => {
    if (!searchedPriceData) return [];
    return [
      {
        label: "당일 시세",
        price: searchedPriceData.priceToday,
        variant: "today" as const,
      },
      {
        label: "1일 전",
        price: searchedPriceData.price1dAgo,
        variant: "past" as const,
      },
      {
        label: "1주 전",
        price: searchedPriceData.price1wAgo,
        variant: "past" as const,
      },
      {
        label: "2주 전",
        price: searchedPriceData.price2wAgo,
        variant: "past" as const,
      },
      {
        label: "1달 전",
        price: searchedPriceData.price1mAgo,
        variant: "past" as const,
      },
      {
        label: "1년 전",
        price: searchedPriceData.price1yAgo,
        variant: "past" as const,
      },
      {
        label: "평년 평균가",
        price: searchedPriceData.priceAvgYear,
        variant: "avg" as const,
      },
    ];
  }, [searchedPriceData]);

  return (
    <Page>
      <Container>
        <Section>
          <Title>재료 등록</Title>
          <FormGrid>
            <TextField
              placeholder="재료명 예: 양파"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              type="number"
              placeholder="수량/크기 예: 10"
              value={unitValue}
              onChange={(e) => setUnitValue(e.target.value)}
            />
            <Select
              value={unitType}
              onChange={(e) => setUnitType(e.target.value)}
            >
              <option value="kg">kg</option>
              <option value="g">g</option>
              <option value="개">개</option>
              <option value="ml">ml</option>
              <option value="L">L</option>
            </Select>
            <ActionButtonWrapper>
              <ButtonSelected onClick={handleAdd}>
                {editingId ? "재료 수정하기" : "사용하는 재료 추가하기"}
              </ButtonSelected>
            </ActionButtonWrapper>
          </FormGrid>
        </Section>

        <Section>
          <Title>등록된 재료</Title>
          <CardGrid>
            {ingredients.length === 0 ? (
              <Small>아직 등록된 재료가 없습니다.</Small>
            ) : (
              ingredients.map((item) => (
                <div key={item.id}>
                  <Card>
                    <StoreInfo>
                      <EllipsisText>{item.name}</EllipsisText>
                      <Small>단위/기준: {item.unit}</Small>
                    </StoreInfo>

                    <ButtonGroup>
                      <ActionPillWrapper>
                        <ButtonSub
                          onClick={() => {
                            setPriceSearchKeyword(item.name);
                            handleFetchKamisPrice(item.name);
                          }}
                        >
                          시세 분석
                        </ButtonSub>
                      </ActionPillWrapper>
                      <ActionPillWrapper>
                        {item.showStores ? (
                          <ButtonMain onClick={() => handleShowStores(item)}>
                            검색 닫기
                          </ButtonMain>
                        ) : (
                          <ButtonSelected
                            onClick={() => handleShowStores(item)}
                          >
                            최저가 검색
                          </ButtonSelected>
                        )}
                      </ActionPillWrapper>
                      <SmallActionBtn
                        type="button"
                        onClick={() => handleEdit(item)}
                      >
                        수정
                      </SmallActionBtn>
                      <SmallActionBtn
                        type="button"
                        $danger
                        onClick={() => handleDelete(item.id)}
                      >
                        삭제
                      </SmallActionBtn>
                    </ButtonGroup>
                  </Card>

                  {item.loadingStores && (
                    <Section style={{ marginTop: "10px", marginBottom: "0" }}>
                      <Small>네이버 최저가 정보를 가져오는 중입니다...</Small>
                    </Section>
                  )}

                  {item.showStores && item.stores && (
                    <Section style={{ marginTop: "10px", marginBottom: "0" }}>
                      <Title>{item.name} 최저가 구매처 TOP 5</Title>
                      <CardGrid>
                        {item.stores.length === 0 ? (
                          <Small>검색된 최저가 상품이 없습니다.</Small>
                        ) : (
                          item.stores.map((store, index) => (
                            <Card key={index}>
                              <StoreInfo>
                                <EllipsisText
                                  dangerouslySetInnerHTML={{
                                    __html: `${index + 1}. [${store.mallName || "쇼핑몰"}] ${store.title}`,
                                  }}
                                />
                                <Small>
                                  가격: {store.lowestPrice.toLocaleString()}원
                                </Small>
                              </StoreInfo>

                              <FixedWidthButtonWrapper>
                                <ButtonSelected
                                  onClick={() =>
                                    window.open(store.link, "_blank")
                                  }
                                >
                                  구매처 이동
                                </ButtonSelected>
                              </FixedWidthButtonWrapper>
                            </Card>
                          ))
                        )}
                      </CardGrid>
                    </Section>
                  )}
                </div>
              ))
            )}
          </CardGrid>
        </Section>

        <Section>
          <Title>전국 농산물 실시간 시세 분석 (KAMIS)</Title>
          <SubDesc>
            등록된 재료의 [시세 분석] 버튼을 누르거나, 궁금한 농산물 품목명을
            직접 검색해 보세요.
          </SubDesc>

          <KamisSearchRow>
            <Select
              value={categoryCode}
              onChange={(e) => setCategoryCode(e.target.value)}
            >
              <option value="">전체 부류</option>
              <option value="100">식량작물</option>
              <option value="200">채소</option>
              <option value="400">과일</option>
              <option value="500">축산물</option>
              <option value="600">수산물</option>
            </Select>

            <TextField
              placeholder="품목명 직접 입력 (예: 배추, 상추, 양파)"
              value={priceSearchKeyword}
              onChange={(e) => setPriceSearchKeyword(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleFetchKamisPrice(priceSearchKeyword);
                }
              }}
            />

            <ActionButtonWrapper>
              <ButtonSelected
                onClick={() => handleFetchKamisPrice(priceSearchKeyword)}
              >
                시세 검색
              </ButtonSelected>
            </ActionButtonWrapper>
          </KamisSearchRow>

          {isPriceLoading && (
            <Small>KAMIS 공공 시세 데이터를 불러오는 중입니다...</Small>
          )}

          {searchedPriceData && (
            <div>
              <KamisHeaderCard>
                <div>
                  <strong style={{ fontSize: "16px", color: "#0f172a" }}>
                    {searchedPriceData.itemName} ({searchedPriceData.kindName})
                    · {searchedPriceData.rank}
                  </strong>
                </div>
                <Small>
                  조사일자 {searchedPriceData.collectedDate} · 단위{" "}
                  {searchedPriceData.unit}
                </Small>
              </KamisHeaderCard>

              <KamisSummaryGrid>
                <SummaryBox $highlight>
                  <SummaryLabel>당일 시세</SummaryLabel>
                  <SummaryValue>
                    {searchedPriceData.priceToday != null
                      ? `${searchedPriceData.priceToday.toLocaleString()}원`
                      : "-"}
                  </SummaryValue>
                </SummaryBox>

                <SummaryBox>
                  <SummaryLabel>평년 평균가</SummaryLabel>
                  <SummaryValue>
                    {searchedPriceData.priceAvgYear != null
                      ? `${searchedPriceData.priceAvgYear.toLocaleString()}원`
                      : "-"}
                  </SummaryValue>
                </SummaryBox>

                <SummaryBox>
                  <SummaryLabel>평년 대비</SummaryLabel>
                  <SummaryValue
                    $tone={
                      diffFromAvg
                        ? diffFromAvg.diff > 0
                          ? "up"
                          : diffFromAvg.diff < 0
                            ? "down"
                            : "neutral"
                        : "neutral"
                    }
                  >
                    {diffFromAvg
                      ? `${diffFromAvg.diff > 0 ? "+" : ""}${diffFromAvg.rate}%`
                      : "-"}
                  </SummaryValue>
                </SummaryBox>
              </KamisSummaryGrid>

              <ChartContainer>
                {chartRows.map((row) => (
                  <ChartBarRow key={row.label}>
                    <ChartLabel
                      $bold={row.variant === "today" || row.variant === "avg"}
                      $accent={row.variant === "avg"}
                    >
                      {row.label}
                    </ChartLabel>
                    <BarWrapper>
                      <ActiveBar
                        $variant={row.variant}
                        $widthPercent={calculateBarWidth(
                          row.price,
                          maxPeriodPrice,
                        )}
                      />
                    </BarWrapper>
                    <PriceText
                      $bold={row.variant === "today" || row.variant === "avg"}
                      $accent={row.variant === "avg"}
                    >
                      {row.price != null
                        ? `${row.price.toLocaleString()}원`
                        : "-"}
                    </PriceText>
                  </ChartBarRow>
                ))}
              </ChartContainer>
            </div>
          )}

          {!searchedPriceData && !isPriceLoading && (
            <div
              style={{
                textAlign: "center",
                padding: "36px 0",
                color: "#94a3b8",
                fontSize: "14px",
              }}
            >
              분석할 농산물 품목을 선택하거나 검색해 주세요.
            </div>
          )}
        </Section>
      </Container>
    </Page>
  );
}
