import styled from "styled-components";
import { useLocation, useNavigate } from "react-router-dom";

type TopbarProps = {
  isLoggedIn?: boolean;
  siteName?: string;
  menus?: string[];
  onSiteClick?: () => void;
  onMenuClick?: (menu: string) => void;
  onLoginClick?: () => void;
  onSignupClick?: () => void;
  onLogoutClick?: () => void;
  onMyPageClick?: () => void;
};

const Bar = styled.header`
  width: 100%;
  min-height: 68px;
  background: #ffffff;
  border-bottom: 1px solid #e2e8f0;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.03);
  padding-inline: var(--app-gutter);
  box-sizing: border-box;
`;

const BarInner = styled.div`
  width: min(100%, var(--app-max-width));
  min-height: 68px;
  margin: 0 auto;
  padding: 12px 0;
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 16px;
  box-sizing: border-box;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Section = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

const LeftSection = styled(Section)`
  justify-content: flex-start;
`;

const CenterSection = styled(Section)`
  justify-content: center;
  gap: 32px;
  flex-wrap: wrap;
`;

const RightSection = styled(Section)`
  justify-content: flex-end;
  gap: 20px;
  flex-wrap: wrap;
`;

const ActionButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: transparent;
  color: ${({ $active }) => ($active ? "#5c7f96" : "#334155")};
  font-size: 15px;
  font-family: "Segoe UI", "Noto Sans KR", sans-serif;
  font-weight: ${({ $active }) => ($active ? 700 : 600)};
  line-height: 1;
  cursor: pointer;
  padding: 8px 4px;
  border-bottom: 2px solid
    ${({ $active }) => ($active ? "#7ea0b7" : "transparent")};
  transition:
    color 0.15s ease,
    border-color 0.15s ease;

  &:hover {
    color: #5c7f96;
  }
`;

const LogoButton = styled.button`
  border: none;
  background: transparent;
  color: #0f172a;
  font-size: 20px;
  font-family: "Segoe UI", "Noto Sans KR", sans-serif;
  font-weight: 800;
  letter-spacing: -0.3px;
  cursor: pointer;
  padding: 0;
`;

const ResponsiveLeftSection = styled(LeftSection)`
  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

const ResponsiveCenterSection = styled(CenterSection)`
  @media (max-width: 768px) {
    justify-content: center;
    gap: 18px;
    width: 100%;
  }
`;

const ResponsiveRightSection = styled(RightSection)`
  @media (max-width: 768px) {
    justify-content: center;
    width: 100%;
  }
`;

const MENU_PATH_MAP: Record<string, string> = {
  "재료 등록": "/ingredients",
  "매출 관리": "/sales-check",
  "직원 관리": "/employee-manage",
};

export default function Topbar({
  isLoggedIn = false,
  siteName = "B-SIGHT",
  menus = ["재료 등록", "매출 관리", "직원 관리"],
  onSiteClick,
  onMenuClick,
  onLoginClick,
  onSignupClick,
  onLogoutClick,
  onMyPageClick,
}: TopbarProps) {
  const navigate = useNavigate();
  const { pathname } = useLocation();

  const handleMenuClick = (menu: string) => {
    const targetPath = MENU_PATH_MAP[menu];
    if (targetPath) {
      navigate(targetPath);
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
    navigate("/register");
  };

  const handleMyPageClick = () => {
    if (onMyPageClick) {
      onMyPageClick();
      return;
    }
    navigate("/mypage");
  };

  const handleLogoutClick = () => {
    if (onLogoutClick) {
      onLogoutClick();
      return;
    }
    localStorage.removeItem("accessToken");
    navigate("/");
  };

  return (
    <Bar>
      <BarInner>
        <ResponsiveLeftSection>
          <LogoButton
            type="button"
            onClick={onSiteClick || (() => navigate("/"))}
          >
            {siteName}
          </LogoButton>
        </ResponsiveLeftSection>

        <ResponsiveCenterSection>
          {isLoggedIn &&
            menus.map((menu) => {
              const targetPath = MENU_PATH_MAP[menu];
              const isActive = targetPath
                ? pathname.startsWith(targetPath)
                : false;
              return (
                <ActionButton
                  key={menu}
                  type="button"
                  $active={isActive}
                  onClick={() => handleMenuClick(menu)}
                >
                  {menu}
                </ActionButton>
              );
            })}
        </ResponsiveCenterSection>

        <ResponsiveRightSection>
          {isLoggedIn ? (
            <>
              <ActionButton
                type="button"
                $active={pathname.startsWith("/mypage")}
                onClick={handleMyPageClick}
              >
                마이페이지
              </ActionButton>
              <ActionButton type="button" onClick={handleLogoutClick}>
                로그아웃
              </ActionButton>
            </>
          ) : (
            <>
              <ActionButton
                type="button"
                $active={pathname.startsWith("/login")}
                onClick={handleLoginClick}
              >
                로그인
              </ActionButton>
              <ActionButton
                type="button"
                $active={pathname.startsWith("/register")}
                onClick={handleSignupClick}
              >
                회원가입
              </ActionButton>
            </>
          )}
        </ResponsiveRightSection>
      </BarInner>
    </Bar>
  );
}
