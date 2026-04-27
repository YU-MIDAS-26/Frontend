import { useState } from "react";
import MypagePrivacy from "./MypagePrivacy";
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
          {selectedTab === "privacy" && <MypagePrivacy />}

          {selectedTab === "basic" && (
            <S.EmptyContent>
              기본 자료 화면은 추후 구현 예정입니다.
            </S.EmptyContent>
          )}

          {selectedTab === "admin" && (
            <S.EmptyContent>
              관리자 페이지 화면은 추후 구현 예정입니다.
            </S.EmptyContent>
          )}
        </S.ContentArea>
      </S.Inner>
    </S.Page>
  );
}

export default Mypage;
