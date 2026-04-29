import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ButtonSub2,
  OneButtonAlert,
  TwoButtonAlert,
} from "../../components/Common";
import * as S from "../../style/MypagePrivacy.style";

function MypagePrivacy() {
  const navigate = useNavigate();

  const [phoneNumber, setPhoneNumber] = useState("010-1234-5678");
  const [isEditingPhone, setIsEditingPhone] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteComplete, setShowDeleteComplete] = useState(false);

  //백엔드 연결되면 여기 값만 받아온 사용자 정보로 교체하면 됨
  const user = {
    name: "XXX",
    email: "abc@naver.com",
    birthDate: "2025-04-16",
  };

  const handleSavePhone = () => {
    setIsEditingPhone(false);
  };

  const handleDeleteAccount = () => {
    setShowDeleteConfirm(false);
    setShowDeleteComplete(true);
  };

  const handleDeleteComplete = () => {
    localStorage.removeItem("isLoggedIn");
    localStorage.removeItem("userId");

    navigate("/");
    window.location.reload();
  };

  return (
    <>
      <S.Section>
        <S.Title>개인 정보</S.Title>

        <S.InfoList>
          <S.InfoRow>
            <S.TextGroup>
              <S.Label>이름 :</S.Label>
              <S.Value>{user.name}</S.Value>
            </S.TextGroup>
          </S.InfoRow>

          <S.InfoRow>
            <S.TextGroup>
              <S.Label>이메일 :</S.Label>
              <S.Value>{user.email}</S.Value>
            </S.TextGroup>
          </S.InfoRow>

          <S.InfoRow>
            <S.TextGroup>
              <S.Label>생년월일 :</S.Label>
              <S.Value>{user.birthDate}</S.Value>
            </S.TextGroup>
          </S.InfoRow>

          <S.InfoRow>
            <S.TextGroup>
              <S.Label>전화번호 :</S.Label>

              {isEditingPhone ? (
                <S.PhoneInput
                  value={phoneNumber}
                  onChange={(event) => setPhoneNumber(event.target.value)}
                  autoFocus
                />
              ) : (
                <S.Value>{phoneNumber}</S.Value>
              )}
            </S.TextGroup>

            <S.FixedButtonBox>
              <ButtonSub2
                type="button"
                onClick={
                  isEditingPhone
                    ? handleSavePhone
                    : () => setIsEditingPhone(true)
                }
              >
                {isEditingPhone ? "저장" : "변경하기"}
              </ButtonSub2>
            </S.FixedButtonBox>
          </S.InfoRow>

          <S.InfoRow>
            <S.TextGroup>
              <S.Label>비밀번호</S.Label>
            </S.TextGroup>

            <S.FixedButtonBox>
              <ButtonSub2
                type="button"
                onClick={() => navigate("/password-reset")}
              >
                변경하기
              </ButtonSub2>
            </S.FixedButtonBox>
          </S.InfoRow>
        </S.InfoList>
      </S.Section>

      <S.Section>
        <S.Title>지원</S.Title>

        <S.DeleteRow>
          <S.DeleteText>내 계정 삭제</S.DeleteText>
          <S.DeleteButton
            type="button"
            onClick={() => setShowDeleteConfirm(true)}
          >
            영구 삭제
          </S.DeleteButton>
        </S.DeleteRow>
      </S.Section>

      {showDeleteConfirm && (
        <S.AlertOverlay>
          <S.AlertBox>
            <TwoButtonAlert
              title="계정을 영구적으로 삭제하시겠습니까?"
              description={
                <>
                  이 작업은 되돌릴 수 없습니다. 등록된 모든 자료와 보고서,
                  AI챗봇 내용이 삭제됩니다.
                </>
              }
              cancelText="취소"
              confirmText="영구 삭제"
              onCancelClick={() => setShowDeleteConfirm(false)}
              onConfirmClick={handleDeleteAccount}
            />
          </S.AlertBox>
        </S.AlertOverlay>
      )}

      {showDeleteComplete && (
        <S.AlertOverlay>
          <S.AlertBox>
            <OneButtonAlert
              title="영구 삭제가 완료되었습니다."
              description={
                <>
                  이용해 주셔서 감사합니다. 계정 정보는 모두 삭제되었으며,
                  복구할 수 없습니다.
                </>
              }
              buttonText="확인"
              onButtonClick={handleDeleteComplete}
            />
          </S.AlertBox>
        </S.AlertOverlay>
      )}
    </>
  );
}

export default MypagePrivacy;
