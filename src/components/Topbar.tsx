import styled from "styled-components";
import { useNavigate } from "react-router-dom";

type TopbarProps = {
  isLoggedIn?: boolean;
  siteName?: string;
  menus?: [string, string, string];
  onSiteClick?: () => void;
  onMenuClick?: (menu: string) => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onLogoutClick?: () => void;
  onMyPageClick?: () => void;
  onAuthClick: () => void;
};

const Bar = styled.header`
  width: 100%;
  min-height: 70px;
  background: #7ea0b7;
  padding: 12px 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-sizing: border-box;
  flex-wrap: wrap;
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
  gap: 36px;
  flex-wrap: wrap;
`;

const RightSection = styled(Section)`
  justify-content: flex-end;
  gap: 16px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button`
  border: none;
  background: transparent;
  color: #111111;
  font-size: 16px;
  font-family: "Segoe UI", "Noto Sans KR", sans-serif;
  font-weight: 700;
  line-height: 1;
  cursor: pointer;
  padding: 0;
`;

const LogoButton = styled(ActionButton)`
  font-weight: 700;
  letter-spacing: 0.2px;
`;

const ResponsiveLeftSection = styled(LeftSection)`
  @media (max-width: 768px) {
    justify-content: center;
    flex-basis: 100%;
  }
`;

const ResponsiveCenterSection = styled(CenterSection)`
  @media (max-width: 768px) {
    justify-content: center;
    gap: 18px;
    flex-basis: 100%;
  }
`;

const ResponsiveRightSection = styled(RightSection)`
  @media (max-width: 768px) {
    justify-content: center;
    flex-basis: 100%;
  }
`;

export default function Topbar({
  isLoggedIn = false,
  siteName = "B-SIGHT",
  menus = ["재료 등록", "매출 확인", "직원 관리"],
  onSiteClick,
  onMenuClick,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onMyPageClick,
}: TopbarProps) {
  const navigate = useNavigate();

  const handleMenuClick = (menu: string) => {
    if (menu === "직원 관리") {
      navigate("/employee-manage");
      return;
    }

    onMenuClick?.(menu);
  };

  const handleLoginClick = () => {
    if (onLoginClick) {
      onLoginClick();
      return;
    }

    navigate("/login");
  };

  const handleSignupClick = () => {
    if (onSignupClick) {
      onSignupClick();
      return;
    }

    navigate("/signup");
  };

  const handleMyPageClick = () => {
    if (onMyPageClick) {
      onMyPageClick();
      return;
    }

    navigate("/mypage");
  };

  const handleLogoutClick = () => {
    onLogoutClick?.();
  };

  return (
    <Bar>
      <ResponsiveLeftSection>
        <LogoButton type="button" onClick={onSiteClick}>
          {siteName}
        </LogoButton>
      </ResponsiveLeftSection>

      <ResponsiveCenterSection>
        {menus.map((menu) => (
          <ActionButton
            key={menu}
            type="button"
            onClick={() => handleMenuClick(menu)}
          >
            {menu}
          </ActionButton>
        ))}
      </ResponsiveCenterSection>

      <ResponsiveRightSection>
        {isLoggedIn ? (
          <>
            <ActionButton type="button" onClick={handleMyPageClick}>
              마이페이지
            </ActionButton>
            <ActionButton type="button" onClick={handleLogoutClick}>
              로그아웃
            </ActionButton>
          </>
        ) : (
          <>
            <ActionButton type="button" onClick={handleLoginClick}>
              로그인
            </ActionButton>
            <ActionButton type="button" onClick={handleSignupClick}>
              회원가입
            </ActionButton>
          </>
        )}
      </ResponsiveRightSection>
    </Bar>
  );
}
