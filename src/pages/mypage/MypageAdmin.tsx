import { useMemo, useState } from "react";
import {
  OneButtonAlert,
  TwoButtonAlert,
  TextField,
} from "../../components/Common";
import * as S from "../../style/MypageAdmin.Style";
import {
  usePendingUsersQuery,
  useApproveUserMutation,
  useRejectUserMutation,
  useAdminAllUsersQuery,
  type AdminAllUser,
} from "../../api/mypage_api";

const USERS_PER_PAGE = 10;

function MypageAdmin() {
  const { data: serverAllUsers = [], isLoading: isAllUsersLoading } =
    useAdminAllUsersQuery();

  const [keyword, setKeyword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [page, setPage] = useState(1);

  const [selectedPendingId, setSelectedPendingId] = useState<number | null>(
    null,
  );
  const [pendingPage, setPendingPage] = useState(1);
  const [showApproveConfirm, setShowApproveConfirm] = useState(false);
  const [showApproveComplete, setShowApproveComplete] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [showRejectComplete, setShowRejectComplete] = useState(false);

  const { data: serverPendingData = [], isLoading: isPendingLoading } =
    usePendingUsersQuery();
  const approveMutation = useApproveUserMutation();
  const rejectMutation = useRejectUserMutation();

  const filteredUsers = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();
    if (!trimmedKeyword) return serverAllUsers;
    return serverAllUsers.filter(
      (user: AdminAllUser) =>
        user.userId.toLowerCase().includes(trimmedKeyword) ||
        user.name.toLowerCase().includes(trimmedKeyword),
    );
  }, [keyword, serverAllUsers]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );
  const visibleUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE,
  );
  const selectedUser = serverAllUsers.find(
    (user: AdminAllUser) => user.userId === selectedUserId,
  );

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const pendingUsers = useMemo(() => {
    return Array.isArray(serverPendingData) ? serverPendingData : [];
  }, [serverPendingData]);

  const totalPendingPages = Math.max(
    1,
    Math.ceil(pendingUsers.length / USERS_PER_PAGE),
  );
  const visiblePendingUsers = pendingUsers.slice(
    (pendingPage - 1) * USERS_PER_PAGE,
    pendingPage * USERS_PER_PAGE,
  );
  const currentSelectedPending = pendingUsers.find(
    (u) => u.userId === selectedPendingId,
  );

  // 가입 승인 API 트리거
  const handleConfirmApprove = () => {
    if (!selectedPendingId) return;

    approveMutation.mutate(selectedPendingId, {
      onSuccess: () => {
        setShowApproveConfirm(false);
        setSelectedPendingId(null);
        setShowApproveComplete(true);
      },
      onError: (err) => {
        alert(err.message || "승인 처리 중 오류가 발생했습니다.");
        setShowApproveConfirm(false);
      },
    });
  };

  // 가입 거절 API 트리거
  const handleConfirmReject = () => {
    if (!selectedPendingId) return;
    if (!rejectionReason.trim()) {
      alert("거절 사유를 입력해 주세요.");
      return;
    }

    rejectMutation.mutate(
      {
        userId: selectedPendingId,
        payload: { rejectionReason },
      },
      {
        onSuccess: () => {
          setShowRejectModal(false);
          setRejectionReason("");
          setSelectedPendingId(null);
          setShowRejectComplete(true);
        },
        onError: (err) => {
          alert(err.message || "거절 처리 중 오류가 발생했습니다.");
        },
      },
    );
  };

  const formatSubmitDate = (isoString: string) => {
    if (!isoString) return "-";
    const date = new Date(isoString);
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
  };

  return (
    <S.Page>
      <S.Title>회원 관리</S.Title>
      <S.Divider />

      <S.SectionTitle>회원 목록</S.SectionTitle>
      <S.ToolRow>
        <S.LeftTools>
          <S.SearchBox>
            <TextField
              value={keyword}
              placeholder="유저 ID / 이름 검색"
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </S.SearchBox>
        </S.LeftTools>
        <S.RightTools />
      </S.ToolRow>

      <S.Table>
        <thead>
          <tr>
            <th>유저 ID</th>
            <th>이름</th>
            <th>가입일자</th>
            <th>역할</th>
          </tr>
        </thead>
        <tbody>
          {isAllUsersLoading ? (
            <tr>
              <S.EmptyCell colSpan={4}>
                백엔드에서 회원 목록을 불러오는 중...
              </S.EmptyCell>
            </tr>
          ) : (
            visibleUsers.map((user: AdminAllUser) => (
              <S.TableRow
                key={user.userId}
                $selected={selectedUserId === user.userId}
                onClick={() =>
                  setSelectedUserId((prev) =>
                    prev === user.userId ? null : user.userId,
                  )
                }
              >
                <td>{user.userId}</td>
                <td>{user.name}</td>
                <td>{formatSubmitDate(user.createdAt)}</td>
                <td>{user.role === "ADMIN" ? "관리자" : "회원"}</td>
              </S.TableRow>
            ))
          )}
          {!isAllUsersLoading && filteredUsers.length === 0 && (
            <tr>
              <S.EmptyCell colSpan={4}>검색 결과가 없습니다.</S.EmptyCell>
            </tr>
          )}
        </tbody>
      </S.Table>

      <S.SelectedInfo>
        {selectedUser
          ? `선택된 유저 : ${selectedUser.userId} / ${selectedUser.name} / ${selectedUser.role === "ADMIN" ? "관리자" : "회원"}`
          : "상세 내역을 확인하고 싶으시면 목록에서 유저를 선택해 주세요."}
      </S.SelectedInfo>

      <S.Pagination>
        <S.PageButton
          type="button"
          disabled={page === 1}
          onClick={() => setPage((prev) => Math.max(1, prev - 1))}
        >
          ‹
        </S.PageButton>
        <S.PageNumber>{page}</S.PageNumber>
        <S.PageButton
          type="button"
          disabled={page === totalPages}
          onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
        >
          ›
        </S.PageButton>
      </S.Pagination>

      <div style={{ margin: "50px 0" }} />

      <S.SectionTitle style={{ color: "#2c3e50" }}>
        회원 가입 승인 관리
      </S.SectionTitle>
      <p style={{ fontSize: "13px", color: "#7ea0b7", margin: "-10px 0 20px" }}>
        회원가입 후 사업자 등록증 승인을 기다리고 있는 실시간 대기자 명단입니다.
      </p>

      <S.Table>
        <thead style={{ background: "#f1f5f9" }}>
          <tr>
            <th>유저 ID</th>
            <th>대표자명</th>
            <th>회사 상호명</th>
            <th>제출 일자</th>
          </tr>
        </thead>
        <tbody>
          {isPendingLoading ? (
            <tr>
              <S.EmptyCell colSpan={4}>
                백엔드에서 가입 대기 명단을 불러오는 중...
              </S.EmptyCell>
            </tr>
          ) : (
            visiblePendingUsers.map((user) => (
              <S.TableRow
                key={user.userId}
                $selected={selectedPendingId === user.userId}
                style={
                  selectedPendingId === user.userId
                    ? { background: "#eef6fb" }
                    : {}
                }
                onClick={() =>
                  setSelectedPendingId((prev) =>
                    prev === user.userId ? null : user.userId,
                  )
                }
              >
                <td>{user.studentId}</td>
                <td>{user.representativeName || user.name}</td>
                <td>{user.companyName || "-"}</td>
                <td>{formatSubmitDate(user.submittedAt)}</td>
              </S.TableRow>
            ))
          )}
          {!isPendingLoading && pendingUsers.length === 0 && (
            <tr>
              <S.EmptyCell colSpan={4}>
                현재 가입 승인을 대기 중인 회원이 없습니다.
              </S.EmptyCell>
            </tr>
          )}
        </tbody>
      </S.Table>

      <S.Pagination style={{ marginBottom: "20px" }}>
        <S.PageButton
          type="button"
          disabled={pendingPage === 1}
          onClick={() => setPendingPage((prev) => Math.max(1, prev - 1))}
        >
          ‹
        </S.PageButton>
        <S.PageNumber>{pendingPage}</S.PageNumber>
        <S.PageButton
          type="button"
          disabled={pendingPage === totalPendingPages}
          onClick={() =>
            setPendingPage((prev) => Math.min(totalPendingPages, prev + 1))
          }
        >
          ›
        </S.PageButton>
      </S.Pagination>

      <div
        style={{
          background: "#f8fafd",
          border: "1px solid #d1dfeb",
          padding: "24px",
          borderRadius: "8px",
          textAlign: "left",
        }}
      >
        {currentSelectedPending ? (
          <div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "12px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              <div>
                <strong>유저 ID:</strong> {currentSelectedPending.studentId}
              </div>
              <div>
                <strong>이메일 주소:</strong> {currentSelectedPending.email}
              </div>
              <div>
                <strong>회사 매장명:</strong>{" "}
                {currentSelectedPending.companyName}
              </div>
              <div>
                <strong>사업자 등록번호:</strong>{" "}
                {currentSelectedPending.businessRegistrationNumber}
              </div>
              <div>
                <strong>대표자명 / 연락처:</strong>{" "}
                {currentSelectedPending.representativeName} (
                {currentSelectedPending.representativePhone})
              </div>
              <div>
                <strong>개업 년월일:</strong>{" "}
                {currentSelectedPending.openingDate}
              </div>
              <div>
                <strong>업태 및 종목:</strong>{" "}
                {currentSelectedPending.businessCategory} /{" "}
                {currentSelectedPending.businessItem}
              </div>
              <div>
                <strong>사업장 주소:</strong>{" "}
                {currentSelectedPending.companyAddress}
              </div>
              <div style={{ gridColumn: "span 2" }}>
                <strong>첨부 라이센스 문서:</strong>{" "}
                <span
                  style={{
                    color: "#7ea0b7",
                    cursor: "pointer",
                    textDecoration: "underline",
                  }}
                >
                  {currentSelectedPending.licenseOriginalFileName ||
                    "첨부 없음"}
                </span>
              </div>
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "flex-end",
                marginTop: "16px",
              }}
            >
              <button
                type="button"
                style={{
                  padding: "8px 20px",
                  background: "#e57373",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setShowRejectModal(true)}
              >
                가입 거절
              </button>
              <button
                type="button"
                style={{
                  padding: "8px 20px",
                  background: "#4caf50",
                  color: "white",
                  border: "none",
                  borderRadius: "4px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
                onClick={() => setShowApproveConfirm(true)}
              >
                가입 승인
              </button>
            </div>
          </div>
        ) : (
          <div
            style={{ color: "#666", textAlign: "center", padding: "10px 0" }}
          >
            하단 목록에서 대기 회원을 클릭하면 상세 사업자 프로필 확인 및
            승인/거절 처리를 수행할 수 있습니다.
          </div>
        )}
      </div>

      {showApproveConfirm && (
        <S.AlertOverlay>
          <S.AdminAlertBox
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <TwoButtonAlert
              title="가입을 승인하시겠습니까?"
              description="승인 시 사장님 계정이 활성화(ACTIVE) 상태로 즉시 변경됩니다."
              cancelText="취소"
              confirmText="승인 확정"
              onCancelClick={() => setShowApproveConfirm(false)}
              onConfirmClick={handleConfirmApprove}
            />
          </S.AdminAlertBox>
        </S.AlertOverlay>
      )}

      {showApproveComplete && (
        <S.AlertOverlay>
          <S.AdminAlertBox
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <OneButtonAlert
              title="회원 가입 승인이 완료되었습니다."
              description=""
              buttonText="확인"
              onButtonClick={() => setShowApproveComplete(false)}
            />
          </S.AdminAlertBox>
        </S.AlertOverlay>
      )}

      {showRejectModal && (
        <S.AlertOverlay>
          <S.AdminAlertBox
            style={{
              background: "white",
              width: "400px",
              padding: "24px",
              borderRadius: "12px",
              boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
              display: "flex",
              flexDirection: "column",
              gap: "16px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                textAlign: "center",
              }}
            >
              <span
                style={{
                  fontSize: "16px",
                  fontWeight: "700",
                  color: "black",
                  lineHeight: "24px",
                }}
              >
                가입 승인 거절 사유 입력
              </span>
              <span
                style={{
                  fontSize: "13px",
                  color: "#4f6270",
                  lineHeight: "20px",
                }}
              >
                반려 사유가 가입 유저에게 시스템 문구로 안내됩니다.
              </span>
            </div>

            <textarea
              style={{
                width: "100%",
                height: "90px",
                padding: "12px",
                boxSizing: "border-box",
                borderRadius: "8px",
                border: "none",
                background: "#c8d7e1",
                color: "black",
                fontSize: "14px",
                lineHeight: "20px",
                resize: "none",
                outline: "none",
              }}
              placeholder="사유를 정확하게 작성해 주세요. (예: 첨부파일 이미지 판독 불가)"
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
            />

            <div style={{ display: "flex", gap: "16px", width: "100%" }}>
              <button
                type="button"
                style={{
                  flex: 1,
                  height: "40px",
                  background: "white",
                  border: "none",
                  borderRadius: "12px",
                  outline: "1px #7ea0b7 solid",
                  outlineOffset: "-1px",
                  color: "black",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  setShowRejectModal(false);
                  setRejectionReason("");
                }}
              >
                취소
              </button>
              <button
                type="button"
                style={{
                  flex: 1,
                  height: "40px",
                  background: "#7ea0b7",
                  border: "none",
                  borderRadius: "12px",
                  color: "black",
                  fontSize: "14px",
                  fontWeight: "500",
                  cursor: "pointer",
                }}
                onClick={handleConfirmReject}
              >
                거절 반려
              </button>
            </div>
          </S.AdminAlertBox>
        </S.AlertOverlay>
      )}

      {showRejectComplete && (
        <S.AlertOverlay>
          <S.AdminAlertBox
            style={{
              background: "white",
              borderRadius: "12px",
              overflow: "hidden",
            }}
          >
            <OneButtonAlert
              title="가입 거절 처리가 정상 반영되었습니다."
              description=""
              buttonText="확인"
              onButtonClick={() => setShowRejectComplete(false)}
            />
          </S.AdminAlertBox>
        </S.AlertOverlay>
      )}
    </S.Page>
  );
}

export default MypageAdmin;
