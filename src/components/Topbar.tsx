import styled from "styled-components";

type TopbarProps = {
  isLoggedIn?: boolean;
  siteName?: string;
  menus?: [string, string, string];
  onSiteClick?: () => void;
  onMenuClick?: (menu: string) => void;
  onAuthClick?: () => void;
  onMyPageClick?: () => void;
};

const Bar = styled.header`
  width: 100%;
  height: 70px;
  background: #7ea0b7;
  padding: 0 28px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
`;

const Section = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  min-width: 0;
`;

const LeftSection = styled(Section)`
  justify-content: flex-start;
`;

const CenterSection = styled(Section)`
  justify-content: center;
  gap: 28px;
`;

const RightSection = styled(Section)`
  justify-content: flex-end;
  gap: 20px;
`;

const ActionButton = styled.button`
  border: none;
  background: transparent;
  color: #111111;
  font-size: 16px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
`;

const LogoButton = styled(ActionButton)`
  font-weight: 700;
`;

export default function Topbar({
  isLoggedIn = false,
  siteName = "B-SIGHT",
  menus = ["재료 등록", "대출 확인", "직원 관리"],
  onSiteClick,
  onMenuClick,
  onAuthClick,
  onMyPageClick,
}: TopbarProps) {
  return (
    <Bar>
      <LeftSection>
        <LogoButton type="button" onClick={onSiteClick}>
          {siteName}
        </LogoButton>
      </LeftSection>

      <CenterSection>
        {menus.map((menu) => (
          <ActionButton
            key={menu}
            type="button"
            onClick={() => onMenuClick?.(menu)}
          >
            {menu}
          </ActionButton>
        ))}
      </CenterSection>

      <RightSection>
        <ActionButton type="button" onClick={onAuthClick}>
          {isLoggedIn ? "로그아웃" : "로그인"}
        </ActionButton>
        <ActionButton type="button" onClick={onMyPageClick}>
          {isLoggedIn ? "마이페이지" : " "}
        </ActionButton>
      </RightSection>
    </Bar>
  );
}
