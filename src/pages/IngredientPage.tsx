import { useMemo, useState } from "react";
import styled from "styled-components";

type Ingredient = {
  id: number;
  name: string;
  weight: string;
  origin: string;
  showStores?: boolean;
};

type Store = {
  id: number;
  name: string;
  price: number;
  delivery: string;
  url: string;
};

const Page = styled.main`
  min-height: calc(100vh - 70px);
  background: #dfe1e5;
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
  grid-template-columns: repeat(3, 1fr) auto;
  gap: 10px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;

const Input = styled.input`
  border: 1px solid #c8cdd2;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
`;

const Button = styled.button`
  border: none;
  background: #7ea0b7;
  color: #111;
  font-weight: 700;
  border-radius: 6px;
  padding: 10px 14px;
  cursor: pointer;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 8px;
`;

const EditButton = styled(Button)`
  background: #ffc107;
`;

const DeleteButton = styled(Button)`
  background: #dc3545;
  color: white;
`;

const SearchButton = styled(Button)`
  background: #28a745;
  color: white;
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
  gap: 12px;
  align-items: center;
`;

const StoreInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`;

const Small = styled.span`
  color: #555;
  font-size: 13px;
`;

const mockStores: Store[] = [
  { id: 1, name: "농산물 직거래몰", price: 15900, delivery: "내일 도착", url: "https://www.kamis.or.kr" },
  { id: 2, name: "푸드마켓 A", price: 16800, delivery: "2일 내 배송", url: "https://www.kamis.or.kr" },
  { id: 3, name: "식자재마트 B", price: 17200, delivery: "오늘 출고", url: "https://www.kamis.or.kr" },
  { id: 4, name: "로컬 도매몰", price: 18100, delivery: "3일 내 배송", url: "https://www.kamis.or.kr" },
  { id: 5, name: "온라인 식재료몰", price: 18900, delivery: "일반 배송", url: "https://www.kamis.or.kr" },
];

export default function IngredientPage() {
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [name, setName] = useState("");
  const [weight, setWeight] = useState("");
  const [origin, setOrigin] = useState("");

  const cheapestStores = useMemo(() => {
    return [...mockStores].sort((a, b) => a.price - b.price).slice(0, 5);
  }, []);

  const handleAdd = () => {
    if (!name.trim() || !weight.trim() || !origin.trim()) {
      alert("재료명, 무게, 원산지를 모두 입력해주세요.");
      return;
    }

    const newIngredient: Ingredient = {
      id: Date.now(),
      name,
      weight,
      origin,
    };

    setIngredients((prev) => [...prev, newIngredient]);
    setName("");
    setWeight("");
    setOrigin("");
  };

  const handleComplete = () => {
    if (ingredients.length === 0) {
      alert("등록된 재료가 없습니다.");
      return;
    }

    alert("재료 등록이 완료되었습니다.");
  };

  const handleDelete = (id: number) => {
  setIngredients((prev) =>
    prev.filter((item) => item.id !== id)
  );
};

const handleEdit = (item: Ingredient) => {
  setName(item.name);
  setWeight(item.weight);
  setOrigin(item.origin);

  setIngredients((prev) =>
    prev.filter((i) => i.id !== item.id)
  );
};

const handleShowStores = (id: number) => {
  setIngredients((prev) =>
    prev.map((item) =>
      item.id === id
        ? {
            ...item,
            showStores: !item.showStores,
          }
        : item
    )
  );
};

  return (
    <Page>
      <Section>
        <Title>재료 등록</Title>

        <FormGrid>
          <Input
            placeholder="재료명 예: 양파"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <Input
            placeholder="무게 예: 10kg"
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
          />
          <Input
            placeholder="원산지 예: 국내산"
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
          />
          <Button onClick={handleAdd}>사용하는 재료 추가하기</Button>
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
        <strong>{item.name}</strong>

        <Small>
          무게: {item.weight}
          {" / "}
          원산지: {item.origin}
        </Small>
      </StoreInfo>

      <ButtonGroup>
        <EditButton
          onClick={() => handleEdit(item)}
        >
          수정
        </EditButton>

        <DeleteButton
          onClick={() => handleDelete(item.id)}
        >
          삭제
        </DeleteButton>

        <SearchButton
          onClick={() => handleShowStores(item.id)}
        >
          최저가 검색
        </SearchButton>
      </ButtonGroup>
    </Card>

    {item.showStores && (
      <Section
        style={{
          marginTop: "10px",
        }}
      >
        <Title>
          {item.name} 최저가 구매처 TOP 5
        </Title>

        <CardGrid>
          {cheapestStores.map(
            (store, index) => (
              <Card key={store.id}>
                <StoreInfo>
                  <strong>
                    {index + 1}.
                    {" "}
                    {store.name}
                  </strong>

                  <Small>
                    가격:
                    {" "}
                    {store.price.toLocaleString()}
                    원
                    {" / "}
                    {store.delivery}
                  </Small>
                </StoreInfo>

                <Button
                  onClick={() =>
                    window.open(
                      store.url,
                      "_blank"
                    )
                  }
                >
                  구매처 이동
                </Button>
              </Card>
            )
          )}
        </CardGrid>
      </Section>
    )}
  </div>
))
            )
          }
        </CardGrid>

        <div style={{ marginTop: "16px" }}>
          <Button onClick={handleComplete}>추가완료</Button>
        </div>
      </Section>

      
    </Page>
  );
}
