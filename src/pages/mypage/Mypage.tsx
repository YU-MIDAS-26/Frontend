import { useState } from "react";
import MypageProfileView from "./MypageProfileView";
import MypageAdmin from "./MypageAdmin";
import * as S from "../../style/MypagePrivacy.style";

type MypageTab = "privacy" | "basic" | "admin";

function Mypage() {
  const [selectedTab, setSelectedTab] = useState<MypageTab>("privacy");

  return (
    <S.Page>
      <S.Inner>
        <S.SideMenu>
          <S.SideMenuButton
            type="button"
            $active={selectedTab === "privacy"}
            onClick={() => setSelectedTab("privacy")}
          >
            개인 정보
          </S.SideMenuButton>

          <S.SideMenuButton
            type="button"
            $active={selectedTab === "basic"}
            onClick={() => setSelectedTab("basic")}
          >
            기본 자료
          </S.SideMenuButton>

          <S.SideMenuButton
            type="button"
            $active={selectedTab === "admin"}
            onClick={() => setSelectedTab("admin")}
          >
            관리자 페이지
          </S.SideMenuButton>
        </S.SideMenu>

        <S.ContentArea>
          <S.PageHeader>
            <S.PageTitle>마이페이지</S.PageTitle>
            <S.PageDescription>
              계정 정보와 관리자 기능을 한 곳에서 확인하고 관리할 수 있습니다.
            </S.PageDescription>
          </S.PageHeader>

          {selectedTab === "privacy" && <MypageProfileView />}

          {selectedTab === "basic" && (
            <S.EmptyContent>
              기본 자료 화면은 추후 구현 예정입니다.
            </S.EmptyContent>
          )}

          {selectedTab === "admin" && <MypageAdmin />}
        </S.ContentArea>
      </S.Inner>
    </S.Page>
  );
}

export default Mypage;
