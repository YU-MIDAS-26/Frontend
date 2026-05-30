import { useState } from "react";
import EmployeeTna from "./EmployeeTna";
import * as S from "../../style/EmployeeManage.Style";
import {
  useEmployeesQuery,
  useCreateEmployeeMutation,
  useUpdateEmployeeMutation,
  useDeleteEmployeeMutation,
} from "../../api/employee_api";

export type LocalEmployeeForm = {
  id?: number;
  name: string;
  birthDate: string;
  phoneNumber: string;
  employeeNumber: string;
  payType: "DAILY" | "HOURLY";
  payAmount: string;
  weeklyHolidayPayApplied: boolean;
};

const formatPhoneNumber = (value: string) => {
  const onlyNumber = value.replace(/\D/g, "").slice(0, 11);
  if (onlyNumber.length < 4) return onlyNumber;
  if (onlyNumber.length < 8) {
    return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
  }
  return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(7)}`;
};

const formatMoney = (value: string) => {
  const onlyNumber = value.replace(/\D/g, "");
  if (!onlyNumber) return "";
  return `${Number(onlyNumber).toLocaleString()}원`;
};

export default function EmployeeManage() {
  const [activeTab, setActiveTab] = useState<"employee" | "tna">("employee");
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddingNew, setIsAddingNew] = useState(false);

  const { data: serverEmployees = [], isLoading } = useEmployeesQuery();
  const createMutation = useCreateEmployeeMutation();
  const updateMutation = useUpdateEmployeeMutation();
  const deleteMutation = useDeleteEmployeeMutation();

  const actualSelectedId =
    selectedId ?? (serverEmployees.length > 0 ? serverEmployees[0].id : null);

  const currentSelectedEmployee = serverEmployees.find(
    (emp) => emp.id === actualSelectedId,
  );

  const [editFormState, setEditFormState] = useState<LocalEmployeeForm | null>(
    null,
  );

  const formState: LocalEmployeeForm =
    isEditing && editFormState
      ? editFormState
      : {
          name: currentSelectedEmployee?.name || "",
          birthDate: currentSelectedEmployee?.birthDate || "",
          phoneNumber: formatPhoneNumber(
            currentSelectedEmployee?.phoneNumber || "",
          ),
          employeeNumber: currentSelectedEmployee?.employeeNumber || "",
          payType: currentSelectedEmployee?.payType || "HOURLY",
          payAmount: formatMoney(
            String(currentSelectedEmployee?.payAmount || ""),
          ),
          weeklyHolidayPayApplied:
            currentSelectedEmployee?.weeklyHolidayPayApplied || false,
        };

  const handleAddEmployeeClick = () => {
    setIsAddingNew(true);
    setSelectedId(null);
    setIsEditing(true);
    setEditFormState({
      name: "",
      birthDate: "",
      phoneNumber: "",
      employeeNumber: "",
      payType: "HOURLY",
      payAmount: "",
      weeklyHolidayPayApplied: false,
    });
  };

  const handleFormChange = <K extends keyof LocalEmployeeForm>(
    key: K,
    value: LocalEmployeeForm[K],
  ) => {
    setEditFormState((prev) => {
      const base = prev || formState;
      return { ...base, [key]: value };
    });
  };

  const handleCancelOrSelect = (empId: number) => {
    setIsAddingNew(false);
    setIsEditing(false);
    setEditFormState(null);
    setSelectedId(empId);
  };

  const handleStartEditClick = () => {
    setEditFormState({ ...formState });
    setIsEditing(true);
  };

  const handleSaveSubmit = async () => {
    const numericPayAmount = Number(formState.payAmount.replace(/\D/g, ""));
    const cleanPhoneNumber = formState.phoneNumber.replace(/\D/g, "");

    const payload = {
      name: formState.name,
      birthDate: formState.birthDate,
      phoneNumber: cleanPhoneNumber,
      employeeNumber: formState.employeeNumber,
      payType: formState.payType,
      payAmount: numericPayAmount,
      weeklyHolidayPayApplied: formState.weeklyHolidayPayApplied,
    };

    if (isAddingNew) {
      createMutation.mutate(payload, {
        onSuccess: (res) => {
          setIsAddingNew(false);
          setIsEditing(false);
          setEditFormState(null);
          setSelectedId(res.data.id);
          alert("새 직원이 성공적으로 등록되었습니다.");
        },
        onError: (err) => alert(err.message || "직원 등록에 실패했습니다."),
      });
    } else if (actualSelectedId) {
      updateMutation.mutate(
        { id: actualSelectedId, payload },
        {
          onSuccess: () => {
            setIsEditing(false);
            setEditFormState(null);
            alert("직원 정보가 수정되었습니다.");
          },
          onError: (err) => alert(err.message || "직원 수정에 실패했습니다."),
        },
      );
    }
  };

  const handleDeleteClick = () => {
    if (!actualSelectedId) return;
    const isConfirmed = window.confirm(
      `${formState.name || "선택한 직원"} 정보를 삭제할까요?`,
    );
    if (!isConfirmed) return;

    deleteMutation.mutate(actualSelectedId, {
      onSuccess: () => {
        alert("직원 정보가 삭제되었습니다.");
        const remaining = serverEmployees.filter(
          (e) => e.id !== actualSelectedId,
        );
        setSelectedId(remaining.length > 0 ? remaining[0].id : null);
        setIsEditing(false);
        setEditFormState(null);
      },
      onError: (err) => alert(err.message || "직원 삭제에 실패했습니다."),
    });
  };

  const isRequiredFilled =
    formState.name.trim() &&
    formState.birthDate.trim() &&
    formState.phoneNumber.trim() &&
    formState.payAmount.trim();

  const convertedEmployeesForTna = serverEmployees.map((emp) => ({
    id: emp.id,
    name: emp.name,
    birth: emp.birthDate,
    phone: emp.phoneNumber,
    employeeNumber: emp.employeeNumber,
    payType: emp.payType.toLowerCase() as "daily" | "hourly",
    payAmount: `${emp.payAmount.toLocaleString()}원`,
    weeklyHolidayPay: emp.weeklyHolidayPayApplied,
  }));

  if (isLoading) {
    return (
      <S.Page>
        <S.EmptyText>직원 목록을 불러오는 중입니다...</S.EmptyText>
      </S.Page>
    );
  }

  return (
    <S.Page>
      <S.Layout>
        <S.Sidebar>
          <S.SideTitle>직원 관리</S.SideTitle>

          <S.MenuButton
            type="button"
            $active={activeTab === "employee"}
            onClick={() => setActiveTab("employee")}
          >
            직원 목록
          </S.MenuButton>

          <S.MenuButton
            type="button"
            $active={activeTab === "tna"}
            onClick={() => setActiveTab("tna")}
          >
            근태 관리
          </S.MenuButton>

          {activeTab === "employee" && (
            <>
              <S.EmployeeList>
                {serverEmployees.map((employee) => (
                  <S.EmployeeButton
                    key={employee.id}
                    type="button"
                    $active={employee.id === actualSelectedId}
                    onClick={() => handleCancelOrSelect(employee.id)}
                  >
                    {employee.name || "이름 없음"}
                  </S.EmployeeButton>
                ))}
              </S.EmployeeList>

              <S.AddButton type="button" onClick={handleAddEmployeeClick}>
                + 추가
              </S.AddButton>
            </>
          )}
        </S.Sidebar>

        <S.Content>
          {activeTab === "tna" ? (
            <EmployeeTna employees={convertedEmployeesForTna} />
          ) : (
            <>
              <S.ContentHeader>
                <S.Title>{isAddingNew ? "새 직원 등록" : "직원 정보"}</S.Title>

                {actualSelectedId && !isAddingNew && (
                  <S.ActionGroup>
                    {/* ✅ 수정 클릭 시 handleStartEditClick 함수로 브릿지 연결 */}
                    <S.TextButton type="button" onClick={handleStartEditClick}>
                      수정
                    </S.TextButton>
                    <S.TextButton type="button" onClick={handleDeleteClick}>
                      삭제
                    </S.TextButton>
                  </S.ActionGroup>
                )}
              </S.ContentHeader>

              {actualSelectedId || isAddingNew ? (
                <S.Form onSubmit={(e) => e.preventDefault()}>
                  <S.Field>
                    <S.Label>이름 *</S.Label>
                    <S.Input
                      value={formState.name}
                      disabled={!isEditing}
                      onChange={(e) => handleFormChange("name", e.target.value)}
                    />
                  </S.Field>

                  <S.Field>
                    <S.Label>생년월일 *</S.Label>
                    <S.Input
                      type="date"
                      value={formState.birthDate}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFormChange("birthDate", e.target.value)
                      }
                    />
                  </S.Field>

                  <S.Field>
                    <S.Label>전화번호 *</S.Label>
                    <S.Input
                      value={formState.phoneNumber}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFormChange(
                          "phoneNumber",
                          formatPhoneNumber(e.target.value),
                        )
                      }
                      placeholder="010-0000-0000"
                    />
                  </S.Field>

                  <S.Field>
                    <S.Label>사원번호</S.Label>
                    <S.Input
                      value={formState.employeeNumber}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFormChange("employeeNumber", e.target.value)
                      }
                      placeholder="선택사항"
                    />
                  </S.Field>

                  <S.Field>
                    <S.Label>급여 방식 *</S.Label>
                    <S.PayTypeGroup>
                      <S.PayTypeButton
                        type="button"
                        disabled={!isEditing}
                        $active={formState.payType === "DAILY"}
                        onClick={() => handleFormChange("payType", "DAILY")}
                      >
                        일급
                      </S.PayTypeButton>
                      <S.PayTypeButton
                        type="button"
                        disabled={!isEditing}
                        $active={formState.payType === "HOURLY"}
                        onClick={() => handleFormChange("payType", "HOURLY")}
                      >
                        시급
                      </S.PayTypeButton>
                    </S.PayTypeGroup>
                  </S.Field>

                  <S.Field>
                    <S.Label>
                      {formState.payType === "DAILY" ? "일급" : "시급"} *
                    </S.Label>
                    <S.Input
                      value={formState.payAmount}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFormChange(
                          "payAmount",
                          formatMoney(e.target.value),
                        )
                      }
                      placeholder="10,000원"
                    />
                  </S.Field>

                  <S.CheckField>
                    <S.Checkbox
                      type="checkbox"
                      checked={formState.weeklyHolidayPayApplied}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleFormChange(
                          "weeklyHolidayPayApplied",
                          e.target.checked,
                        )
                      }
                    />
                    <span>주휴수당 적용 여부</span>
                  </S.CheckField>

                  {isEditing && (
                    <S.SaveButton
                      type="button"
                      disabled={
                        !isRequiredFilled ||
                        createMutation.isPending ||
                        updateMutation.isPending
                      }
                      onClick={handleSaveSubmit}
                    >
                      저장
                    </S.SaveButton>
                  )}
                </S.Form>
              ) : (
                <S.EmptyText>
                  등록된 직원이 없습니다. 추가 버튼을 눌러 직원을 생성해 주세요.
                </S.EmptyText>
              )}
            </>
          )}
        </S.Content>
      </S.Layout>
    </S.Page>
  );
}
