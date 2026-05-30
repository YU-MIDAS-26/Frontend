import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  ButtonSelected,
  ButtonSelected as ButtonSub2,
  OneButtonAlert,
  TwoButtonAlert,
} from "../../components/Common";
import { useAuth } from "../../contexts/AuthContext";
import * as S from "../../style/MypagePrivacy.style";
import {
  useMyProfileQuery,
  useUpdatePhoneMutation,
  useDeleteAccountMutation,
} from "../../api/mypage_api";

export default function MypageProfileView() {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const { data: user, isLoading } = useMyProfileQuery();
  const updatePhoneMutation = useUpdatePhoneMutation();
  const deleteAccountMutation = useDeleteAccountMutation();

  const [localPhone, setLocalPhone] = useState<string | null>(null);
  const [isEditingPhone, setIsEditingPhone] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteComplete, setShowDeleteComplete] = useState(false);

  const displayPhoneNumber =
    isEditingPhone && localPhone !== null
      ? localPhone
      : user?.phoneNumber || "";

  const handleStartEdit = () => {
    setLocalPhone(user?.phoneNumber || "");
    setIsEditingPhone(true);
  };

  const handleSavePhone = () => {
    if (!displayPhoneNumber.trim()) {
      alert("전화번호를 입력해 주세요.");
      return;
    }

    const cleanPhone = displayPhoneNumber.replace(/\D/g, "");

    updatePhoneMutation.mutate(
      { phoneNumber: cleanPhone },
      {
        onSuccess: () => {
          setIsEditingPhone(false);
          setLocalPhone(null); // 수정본 상태 초기화
          alert("전화번호가 성공적으로 변경되었습니다.");
        },
        onError: (err) => {
          alert(err.message || "전화번호 변경에 실패했습니다.");
        },
      },
    );
  };

  const handleDeleteAccount = () => {
    deleteAccountMutation.mutate(undefined, {
      onSuccess: (res) => {
        if (res.status === "SUCCESS") {
          setShowDeleteConfirm(false);
          setShowDeleteComplete(true);
        }
      },
      onError: (err) => {
        alert(err.message || "회원 탈퇴 처리 중 오류가 발생했습니다.");
        setShowDeleteConfirm(false);
      },
    });
  };

  const handleDeleteComplete = () => {
    logout();
    navigate("/");
  };

  if (isLoading) {
    return (
      <S.EmptyContent>내 정보를 안전하게 불러오는 중입니다...</S.EmptyContent>
    );
  }

  return (
    <>
      <S.Section>
        <S.Title>개인 정보</S.Title>

        <S.InfoList>
          <S.InfoRow>
            <S.Label>이름</S.Label>
            <S.TextGroup>
              <S.Value>{user?.name || "-"}</S.Value>
            </S.TextGroup>
          </S.InfoRow>

          <S.InfoRow>
            <S.Label>이메일</S.Label>
            <S.TextGroup>
              <S.Value>{user?.email || "-"}</S.Value>
            </S.TextGroup>
          </S.InfoRow>

          <S.InfoRow>
            <S.Label>생년월일</S.Label>
            <S.TextGroup>
              <S.Value>{user?.birthDate || "-"}</S.Value>
            </S.TextGroup>
          </S.InfoRow>

          <S.InfoRow>
            <S.Label>전화번호</S.Label>
            <S.TextGroup>
              {isEditingPhone ? (
                <S.PhoneInput
                  value={displayPhoneNumber}
                  onChange={(event) => setLocalPhone(event.target.value)}
                  autoFocus
                />
              ) : (
                <S.Value>{user?.phoneNumber || "-"}</S.Value>
              )}
            </S.TextGroup>

            <S.FixedButtonBox>
              <ButtonSelected
                type="button"
                disabled={updatePhoneMutation.isPending}
                onClick={isEditingPhone ? handleSavePhone : handleStartEdit}
              >
                {isEditingPhone ? "저장" : "변경하기"}
              </ButtonSelected>
            </S.FixedButtonBox>
          </S.InfoRow>

          <S.InfoRow>
            <S.Label>비밀번호</S.Label>
            <S.TextGroup>
              <S.Value>보안을 위해 비밀번호는 표시되지 않습니다.</S.Value>
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
        <S.Title>계정 관리</S.Title>

        <S.DeleteRow>
          <S.DeleteText>
            회원 탈퇴를 진행하면 저장된 정보와 사용 기록이 함께 삭제됩니다.
          </S.DeleteText>
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
                  이 작업은 되돌릴 수 없습니다. 등록한 모든 자료와 보고서,
                  AI챗봇 이용내역이 함께 삭제됩니다.
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
              title="계정 삭제가 완료되었습니다."
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
