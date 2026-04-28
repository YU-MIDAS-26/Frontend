import { useMemo, useState } from "react";
import {
  OneButtonAlert,
  TwoButtonAlert,
  SubmitButton,
  TextField,
} from "../../components/Common";
import * as S from "../../style/MypageAdmin.Style";

type UserRole = "관리자" | "회원";

type AdminUser = {
  id: string;
  name: string;
  joinedAt: string;
  role: UserRole;
};

const USERS_PER_PAGE = 10;

// TODO: 백엔드 연결되면 이 배열만 API 데이터로 교체
const mockUsers: AdminUser[] = [
  { id: "user001", name: "율무", joinedAt: "2025-12-11 08:59", role: "관리자" },
  { id: "user002", name: "유진", joinedAt: "2025-12-11 09:00", role: "회원" },
  { id: "user003", name: "테스트", joinedAt: "2025-12-11 10:20", role: "회원" },
  { id: "user004", name: "김민지", joinedAt: "2025-12-12 11:30", role: "회원" },
  { id: "user005", name: "박서준", joinedAt: "2025-12-13 13:10", role: "회원" },
  {
    id: "user006",
    name: "이하늘",
    joinedAt: "2025-12-14 14:22",
    role: "관리자",
  },
  { id: "user007", name: "최나래", joinedAt: "2025-12-15 15:41", role: "회원" },
  { id: "user008", name: "정다은", joinedAt: "2025-12-16 16:03", role: "회원" },
  { id: "user009", name: "한지민", joinedAt: "2025-12-17 17:25", role: "회원" },
  { id: "user010", name: "오세훈", joinedAt: "2025-12-18 18:40", role: "회원" },
  {
    id: "user011",
    name: "강도윤",
    joinedAt: "2025-12-19 19:00",
    role: "관리자",
  },
];

function MypageAdmin() {
  const [users, setUsers] = useState<AdminUser[]>(mockUsers);
  const [keyword, setKeyword] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [pendingRole, setPendingRole] = useState<UserRole | null>(null);
  const [showRoleComplete, setShowRoleComplete] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showDeleteComplete, setShowDeleteComplete] = useState(false);

  const isUserSelected = !!selectedUserId;

  const filteredUsers = useMemo(() => {
    const trimmedKeyword = keyword.trim().toLowerCase();

    if (!trimmedKeyword) return users;

    return users.filter(
      (user) =>
        user.id.toLowerCase().includes(trimmedKeyword) ||
        user.name.toLowerCase().includes(trimmedKeyword),
    );
  }, [keyword, users]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredUsers.length / USERS_PER_PAGE),
  );

  const visibleUsers = filteredUsers.slice(
    (page - 1) * USERS_PER_PAGE,
    page * USERS_PER_PAGE,
  );

  const selectedUser = users.find((user) => user.id === selectedUserId);

  const handleSearchChange = (value: string) => {
    setKeyword(value);
    setPage(1);
  };

  const handleRoleButtonClick = (role: UserRole) => {
    if (!selectedUserId) return;
    setPendingRole(role);
  };

  const handleConfirmRoleChange = () => {
    if (!selectedUserId || !pendingRole) return;

    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === selectedUserId ? { ...user, role: pendingRole } : user,
      ),
    );

    setPendingRole(null);
    setShowRoleComplete(true);
  };

  const handleDeleteButtonClick = () => {
    if (!selectedUserId) return;
    setShowDeleteConfirm(true);
  };

  const handleConfirmDeleteUser = () => {
    if (!selectedUserId) return;

    setUsers((prevUsers) =>
      prevUsers.filter((user) => user.id !== selectedUserId),
    );

    setSelectedUserId(null);
    setShowDeleteConfirm(false);
    setShowDeleteComplete(true);
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
              placeholder="아이디 / 이름 검색"
              onChange={(event) => handleSearchChange(event.target.value)}
            />
          </S.SearchBox>
        </S.LeftTools>

        <S.RightTools>
          <S.RoleLabel>역할 변경 :</S.RoleLabel>

          <S.SmallButtonBox>
            <SubmitButton
              type="button"
              isActive={isUserSelected}
              onClick={() => handleRoleButtonClick("관리자")}
            >
              관리자
            </SubmitButton>
          </S.SmallButtonBox>

          <S.SmallButtonBox>
            <SubmitButton
              type="button"
              isActive={isUserSelected}
              onClick={() => handleRoleButtonClick("회원")}
            >
              회원
            </SubmitButton>
          </S.SmallButtonBox>

          <S.DeleteButton
            type="button"
            disabled={!isUserSelected}
            onClick={handleDeleteButtonClick}
          >
            유저 삭제
          </S.DeleteButton>
        </S.RightTools>
      </S.ToolRow>

      <S.Table>
        <thead>
          <tr>
            <th>유저 아이디</th>
            <th>이름</th>
            <th>가입일자</th>
            <th>역할</th>
          </tr>
        </thead>

        <tbody>
          {visibleUsers.map((user) => (
            <S.TableRow
              key={user.id}
              $selected={selectedUserId === user.id}
              onClick={() => setSelectedUserId(user.id)}
            >
              <td>{user.id}</td>
              <td>{user.name}</td>
              <td>{user.joinedAt}</td>
              <td>{user.role}</td>
            </S.TableRow>
          ))}

          {visibleUsers.length === 0 && (
            <tr>
              <S.EmptyCell colSpan={4}>검색 결과가 없습니다.</S.EmptyCell>
            </tr>
          )}
        </tbody>
      </S.Table>

      <S.SelectedInfo>
        {selectedUser
          ? `선택된 유저 : ${selectedUser.id} / ${selectedUser.name} / ${selectedUser.role}`
          : "역할 변경 또는 삭제할 유저를 선택해 주세요."}
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

      {pendingRole && (
        <S.AlertOverlay>
          <S.AdminAlertBox>
            <TwoButtonAlert
              title="역할을 변경하시겠습니까?"
              description=""
              cancelText="취소"
              confirmText="확인"
              onCancelClick={() => setPendingRole(null)}
              onConfirmClick={handleConfirmRoleChange}
            />
          </S.AdminAlertBox>
        </S.AlertOverlay>
      )}

      {showRoleComplete && (
        <S.AlertOverlay>
          <S.AdminAlertBox>
            <OneButtonAlert
              title="역할 변경이 완료되었습니다."
              description=""
              buttonText="확인"
              onButtonClick={() => setShowRoleComplete(false)}
            />
          </S.AdminAlertBox>
        </S.AlertOverlay>
      )}

      {showDeleteConfirm && (
        <S.AlertOverlay>
          <S.AdminAlertBox>
            <S.DeleteConfirmAlert
              title="유저를 영구적으로 삭제하시겠습니까?"
              description={
                <>
                  이 작업은 되돌릴 수 없습니다. 등록된 모든 자료와 보고서,
                  AI챗봇 내용이 삭제됩니다.
                </>
              }
              cancelText="취소"
              confirmText="영구 삭제"
              onCancelClick={() => setShowDeleteConfirm(false)}
              onConfirmClick={handleConfirmDeleteUser}
            />
          </S.AdminAlertBox>
        </S.AlertOverlay>
      )}

      {showDeleteComplete && (
        <S.AlertOverlay>
          <S.AdminAlertBox>
            <OneButtonAlert
              title="유저 삭제가 완료되었습니다."
              description={
                <>
                  해당 유저의 계정 정보가 모두 삭제되었으며, 복구할 수 없습니다.
                </>
              }
              buttonText="확인"
              onButtonClick={() => setShowDeleteComplete(false)}
            />
          </S.AdminAlertBox>
        </S.AlertOverlay>
      )}
    </S.Page>
  );
}

export default MypageAdmin;
