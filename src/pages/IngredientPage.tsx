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
  background: var(--app-page-bg);
  padding: 24px;
`;

const Section = styled.section`
  background: #ffffff;
  border: 1px solid #d0d4d9;
  border-radius: 8px;
  padding: 18px;
  margin-bottom: 16px;
`;

const Title = styled.h2`
  margin: 0 0 16px;
  font-size: 22px;
`;

const FormGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1.2fr;
  gap: 10px;
  align-items: center;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Select = styled.select`
  width: 100%;
  border: none;
  background: #c8d7e1;
  border-radius: 8px;
  padding: 12px 16px;
  font-size: 14px;
  outline: none;
  color: black;
  height: 48px;
  box-sizing: border-box;
`;

const CardGrid = styled.div`
  display: grid;
  gap: 10px;
`;

const Card = styled.div`
  border: 1px solid #d0d4d9;
  border-radius: 8px;
  padding: 14px;
  background: #fafbfd;
  display: flex;
  justify-content: space-between;
  gap: 16px;
  align-items: center;
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
  word-break: break-all;
  font-size: 15px;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
  flex-shrink: 0;
`;

const FixedWidthButtonWrapper = styled.div`
  width: 110px;
  height: 40px;
  flex-shrink: 0;
`;

const FlexButtonWrapper = styled.div`
  min-width: 60px;
  height: 38px;
`;

const LargeButtonWrapper = styled(FlexButtonWrapper)`
  min-width: 95px;
`;

const ActionButtonWrapper = styled.div`
  width: 180px;
  height: 48px;
  @media (max-width: 900px) {
    width: 100%;
  }
`;

const Small = styled.span`
  color: #555;
  font-size: 13px;
`;

const DeleteButton = styled.button`
  min-width: 60px;
  height: 38px;
  border: none;
  border-radius: 8px;
  background: #f87171;
  color: white;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.2s;

  &:hover {
    background: #ef4444;
  }

  &:active {
    transform: scale(0.98);
  }
`;

const ChartContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
  margin-top: 20px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 8px;
  border: 1px dashed #cbd5e1;
`;

const ChartBarRow = styled.div`
  display: grid;
  grid-template-columns: 100px 1fr 100px;
  align-items: center;
  gap: 12px;
`;

const BarWrapper = styled.div`
  background: #e2e8f0;
  border-radius: 6px;
  height: 24px;
  width: 100%;
  overflow: hidden;
`;

const ActiveBar = styled.div<{ $widthPercent: number }>`
  width: ${(props) => props.$widthPercent}%;
  height: 100%;
  background: linear-gradient(90deg, #7ea0b7, #4f738e);
  border-radius: 6px;
  transition: width 0.6s cubic-bezier(0.4, 0, 0.2, 1);
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

  const [priceSearchKeyword, setPriceSearchKeyword] = useState(""); // 수기 시세 검색어
  const [searchedPriceData, setSearchedPriceData] =
    useState<PriceRecord | null>(null); // 최신 시세 1건 결과
  const [isPriceLoading, setIsPriceLoading] = useState(false);

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
      const res = await priceApi.getLatestPrice(targetName.trim());
      if (res.status === "SUCCESS" && res.data) {
        setSearchedPriceData(res.data);
      } else {
        alert(
          `[${targetName}] 항목의 최근 KAMIS 수집 시세가 존재하지 않습니다.`,
        );
      }
    } catch (error) {
      console.error(error);
      alert("시세 데이터를 조회하는 중 서버 에러가 발생했습니다.");
    } finally {
      setIsPriceLoading(false);
    }
  };

  const calculateBarWidth = (currentPrice: number, maxPrice: number) => {
    if (!currentPrice || !maxPrice) return 0;
    return Math.max(8, Math.round((currentPrice / maxPrice) * 100));
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
      priceToday,
      price1dAgo,
      price1wAgo,
      price2wAgo,
      price1mAgo,
      price1yAgo,
      priceAvgYear,
      1,
    );
  }, [searchedPriceData]);

  return (
    <Page>
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
                    <LargeButtonWrapper style={{ minWidth: "85px" }}>
                      <ButtonMain
                        style={{ background: "#4f738e", color: "white" }}
                        onClick={() => {
                          setPriceSearchKeyword(item.name);
                          handleFetchKamisPrice(item.name);
                        }}
                      >
                        시세 분석
                      </ButtonMain>
                    </LargeButtonWrapper>
                    <FlexButtonWrapper>
                      <ButtonSub onClick={() => handleEdit(item)}>
                        수정
                      </ButtonSub>
                    </FlexButtonWrapper>
                    <FlexButtonWrapper>
                      <DeleteButton onClick={() => handleDelete(item.id)}>
                        삭제
                      </DeleteButton>
                    </FlexButtonWrapper>
                    <LargeButtonWrapper>
                      {item.showStores ? (
                        <ButtonMain onClick={() => handleShowStores(item)}>
                          검색 닫기
                        </ButtonMain>
                      ) : (
                        <ButtonSelected onClick={() => handleShowStores(item)}>
                          최저가 검색
                        </ButtonSelected>
                      )}
                    </LargeButtonWrapper>
                  </ButtonGroup>
                </Card>

                {item.loadingStores && (
                  <Section style={{ marginTop: "10px" }}>
                    <Small>네이버 최저가 정보를 가져오는 중입니다...</Small>
                  </Section>
                )}

                {item.showStores && item.stores && (
                  <Section style={{ marginTop: "10px" }}>
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

      {/* ==================== 🌾 3. 하단 섹션: KAMIS 농산물 종합 시세 분석실 (수기 통합형) ==================== */}
      <Section style={{ borderTop: "3px solid #7ea0b7", marginTop: "30px" }}>
        <Title>전국 농산물 실시간 시세 분석 (KAMIS)</Title>
        <p
          style={{
            fontSize: "13px",
            color: "#666",
            marginTop: "-8px",
            marginBottom: "16px",
          }}
        >
          등록된 재료의 [시세 분석] 단추를 누르거나, 궁금한 농산물 품목명을
          아래에 직접 수기로 타이핑해서 검색해 보세요.
        </p>

        <div
          style={{
            display: "flex",
            gap: "12px",
            marginBottom: "20px",
            maxWidth: "500px",
          }}
        >
          <div style={{ flex: 1 }}>
            <TextField
              placeholder="품목명 직접 입력 (예: 배추, 상추, 양파)"
              value={priceSearchKeyword}
              onChange={(e) => setPriceSearchKeyword(e.target.value)}
            />
          </div>
          <div style={{ width: "100px", height: "48px" }}>
            <ButtonSelected
              onClick={() => handleFetchKamisPrice(priceSearchKeyword)}
            >
              시세 검색
            </ButtonSelected>
          </div>
        </div>

        {isPriceLoading && (
          <Small>KAMIS 공공 시세 데이터베이스를 정밀 분석 중입니다...</Small>
        )}

        {searchedPriceData && (
          <div>
            <div
              style={{
                background: "#eef4f8",
                padding: "14px",
                borderRadius: "8px",
                marginBottom: "16px",
              }}
            >
              <strong style={{ fontSize: "16px", color: "#1e293b" }}>
                🌾 {searchedPriceData.itemName} ({searchedPriceData.kindName}) -{" "}
                {searchedPriceData.rank}
              </strong>
              <div
                style={{ fontSize: "13px", color: "#4f6270", marginTop: "4px" }}
              >
                최근 조사일자: {searchedPriceData.collectedDate} | 조사단위:{" "}
                {searchedPriceData.unit}
              </div>
            </div>

            <Title style={{ fontSize: "16px", marginBottom: "12px" }}>
              기간별 가격 추이 비교 그래프
            </Title>
            <ChartContainer>
              <ChartBarRow>
                <Small style={{ fontWeight: "bold" }}>당일 시세</Small>
                <BarWrapper>
                  <ActiveBar
                    $widthPercent={calculateBarWidth(
                      searchedPriceData.priceToday,
                      maxPeriodPrice,
                    )}
                  />
                </BarWrapper>
                <strong>
                  {searchedPriceData.priceToday.toLocaleString()}원
                </strong>
              </ChartBarRow>

              <ChartBarRow>
                <Small>1일 전</Small>
                <BarWrapper>
                  <ActiveBar
                    $widthPercent={calculateBarWidth(
                      searchedPriceData.price1dAgo,
                      maxPeriodPrice,
                    )}
                  />
                </BarWrapper>
                <Small>{searchedPriceData.price1dAgo.toLocaleString()}원</Small>
              </ChartBarRow>

              <ChartBarRow>
                <Small>1주 전</Small>
                <BarWrapper>
                  <ActiveBar
                    $widthPercent={calculateBarWidth(
                      searchedPriceData.price1wAgo,
                      maxPeriodPrice,
                    )}
                  />
                </BarWrapper>
                <Small>{searchedPriceData.price1wAgo.toLocaleString()}원</Small>
              </ChartBarRow>

              <ChartBarRow>
                <Small>2주 전</Small>
                <BarWrapper>
                  <ActiveBar
                    $widthPercent={calculateBarWidth(
                      searchedPriceData.price2wAgo,
                      maxPeriodPrice,
                    )}
                  />
                </BarWrapper>
                <Small>{searchedPriceData.price2wAgo.toLocaleString()}원</Small>
              </ChartBarRow>

              <ChartBarRow>
                <Small>1달 전</Small>
                <BarWrapper>
                  <ActiveBar
                    $widthPercent={calculateBarWidth(
                      searchedPriceData.price1mAgo,
                      maxPeriodPrice,
                    )}
                  />
                </BarWrapper>
                <Small>{searchedPriceData.price1mAgo.toLocaleString()}원</Small>
              </ChartBarRow>

              <ChartBarRow>
                <Small>1년 전</Small>
                <BarWrapper>
                  <ActiveBar
                    $widthPercent={calculateBarWidth(
                      searchedPriceData.price1yAgo,
                      maxPeriodPrice,
                    )}
                  />
                </BarWrapper>
                <Small>{searchedPriceData.price1yAgo.toLocaleString()}원</Small>
              </ChartBarRow>

              <ChartBarRow>
                <Small style={{ color: "#059669", fontWeight: "bold" }}>
                  평년 평균가
                </Small>
                <BarWrapper style={{ background: "#d1fae5" }}>
                  <ActiveBar
                    style={{
                      background: "linear-gradient(90deg, #34d399, #059669)",
                    }}
                    $widthPercent={calculateBarWidth(
                      searchedPriceData.priceAvgYear,
                      maxPeriodPrice,
                    )}
                  />
                </BarWrapper>
                <strong style={{ color: "#059669" }}>
                  {searchedPriceData.priceAvgYear.toLocaleString()}원
                </strong>
              </ChartBarRow>
            </ChartContainer>
          </div>
        )}

        {!searchedPriceData && !isPriceLoading && (
          <div
            style={{
              textAlign: "center",
              padding: "30px 0",
              color: "#94a3b8",
              fontSize: "14px",
            }}
          >
            분석실에 노출할 농산물 품목을 선택해 주세요.
          </div>
        )}
      </Section>
    </Page>
  );
}
