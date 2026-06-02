import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  ingredientApi,
  naverApi,
  type IngredientData,
  type NaverShopItem,
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

  const handleDelete = (id: number) => {
    setIngredients((prev) => prev.filter((item) => item.id !== id));
  };

  const handleEdit = (item: IngredientItem) => {
    setName(item.name);

    const numberMatch = item.unit.match(/^[\d.]+/);
    const unitMatch = item.unit.replace(/^[\d.]+/, "").trim();

    if (numberMatch) {
      setUnitValue(numberMatch[0]);
      setUnitType(unitMatch || "kg");
    } else {
      setUnitValue("");
      setUnitType("kg");
    }

    setEditingId(item.id);

    alert("수정 API 연동 전입니다.");
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
                    <FlexButtonWrapper>
                      <ButtonSub onClick={() => handleEdit(item)}>
                        수정
                      </ButtonSub>
                    </FlexButtonWrapper>
                    <FlexButtonWrapper>
                      <FlexButtonWrapper>
                        <DeleteButton onClick={() => handleDelete(item.id)}>
                          삭제
                        </DeleteButton>
                      </FlexButtonWrapper>
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
                              {/* 1번 요구사항: 말줄임표 처리 완료 */}
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
    </Page>
  );
}
