import { useState } from "react";
import EmployeeTna from "./EmployeeTna";
import * as S from "../../style/EmployeeManage.Style";

export type PayType = "daily" | "hourly";

export type Employee = {
  id: number;
  name: string;
  birth: string;
  phone: string;
  employeeNumber?: string;
  payType: PayType;
  payAmount: string;
  weeklyHolidayPay: boolean;
};

const initialEmployees: Employee[] = [
  {
    id: 1,
    name: "홍길동",
    birth: "2000-01-01",
    phone: "010-1234-5678",
    employeeNumber: "A001",
    payType: "hourly",
    payAmount: "10,000원",
    weeklyHolidayPay: true,
  },
];

const formatPhoneNumber = (value: string) => {
  const onlyNumber = value.replace(/\D/g, "").slice(0, 11);

  if (onlyNumber.length < 4) return onlyNumber;
  if (onlyNumber.length < 8) {
    return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3)}`;
  }

  return `${onlyNumber.slice(0, 3)}-${onlyNumber.slice(3, 7)}-${onlyNumber.slice(
    7,
  )}`;
};

const formatMoney = (value: string) => {
  const onlyNumber = value.replace(/\D/g, "");

  if (!onlyNumber) return "";

  return `${Number(onlyNumber).toLocaleString()}원`;
};

export default function EmployeeManage() {
  const [activeTab, setActiveTab] = useState<"employee" | "tna">("employee");
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees);
  const [selectedId, setSelectedId] = useState<number>(initialEmployees[0].id);
  const [isEditing, setIsEditing] = useState(false);

  const selectedEmployee = employees.find(
    (employee) => employee.id === selectedId,
  );

  const handleAddEmployee = () => {
    const newEmployee: Employee = {
      id: Date.now(),
      name: "",
      birth: "",
      phone: "",
      employeeNumber: "",
      payType: "hourly",
      payAmount: "",
      weeklyHolidayPay: false,
    };

    setEmployees((prev) => [...prev, newEmployee]);
    setSelectedId(newEmployee.id);
    setIsEditing(true);
  };

  const handleChangeEmployee = <K extends keyof Employee>(
    key: K,
    value: Employee[K],
  ) => {
    setEmployees((prev) =>
      prev.map((employee) =>
        employee.id === selectedId ? { ...employee, [key]: value } : employee,
      ),
    );
  };

  const handleDeleteEmployee = () => {
    if (!selectedEmployee) return;

    const isConfirmed = window.confirm(
      `${selectedEmployee.name || "선택한 직원"} 정보를 삭제할까요?`,
    );

    if (!isConfirmed) return;

    const nextEmployees = employees.filter(
      (employee) => employee.id !== selectedId,
    );

    setEmployees(nextEmployees);
    setSelectedId(nextEmployees[0]?.id ?? 0);
    setIsEditing(false);
  };

  const isRequiredFilled =
    selectedEmployee?.name &&
    selectedEmployee?.birth &&
    selectedEmployee?.phone &&
    selectedEmployee?.payAmount;

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
                {employees.map((employee) => (
                  <S.EmployeeButton
                    key={employee.id}
                    type="button"
                    $active={employee.id === selectedId}
                    onClick={() => {
                      setSelectedId(employee.id);
                      setIsEditing(false);
                    }}
                  >
                    {employee.name || "새 직원"}
                  </S.EmployeeButton>
                ))}
              </S.EmployeeList>

              <S.AddButton type="button" onClick={handleAddEmployee}>
                + 추가
              </S.AddButton>
            </>
          )}
        </S.Sidebar>

        <S.Content>
          {activeTab === "tna" ? (
            <EmployeeTna employees={employees} />
          ) : (
            <>
              <S.ContentHeader>
                <S.Title>직원 정보</S.Title>

                {selectedEmployee && (
                  <S.ActionGroup>
                    <S.TextButton
                      type="button"
                      onClick={() => setIsEditing(true)}
                    >
                      수정
                    </S.TextButton>
                    <S.TextButton type="button" onClick={handleDeleteEmployee}>
                      삭제
                    </S.TextButton>
                  </S.ActionGroup>
                )}
              </S.ContentHeader>

              {selectedEmployee ? (
                <S.Form>
                  <S.Field>
                    <S.Label>이름 *</S.Label>
                    <S.Input
                      value={selectedEmployee.name}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleChangeEmployee("name", e.target.value)
                      }
                    />
                  </S.Field>

                  <S.Field>
                    <S.Label>생년월일 *</S.Label>
                    <S.Input
                      type="date"
                      value={selectedEmployee.birth}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleChangeEmployee("birth", e.target.value)
                      }
                    />
                  </S.Field>

                  <S.Field>
                    <S.Label>전화번호 *</S.Label>
                    <S.Input
                      value={selectedEmployee.phone}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleChangeEmployee(
                          "phone",
                          formatPhoneNumber(e.target.value),
                        )
                      }
                      placeholder="010-0000-0000"
                    />
                  </S.Field>

                  <S.Field>
                    <S.Label>사원번호</S.Label>
                    <S.Input
                      value={selectedEmployee.employeeNumber}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleChangeEmployee("employeeNumber", e.target.value)
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
                        $active={selectedEmployee.payType === "daily"}
                        onClick={() => handleChangeEmployee("payType", "daily")}
                      >
                        일급
                      </S.PayTypeButton>
                      <S.PayTypeButton
                        type="button"
                        disabled={!isEditing}
                        $active={selectedEmployee.payType === "hourly"}
                        onClick={() =>
                          handleChangeEmployee("payType", "hourly")
                        }
                      >
                        시급
                      </S.PayTypeButton>
                    </S.PayTypeGroup>
                  </S.Field>

                  <S.Field>
                    <S.Label>
                      {selectedEmployee.payType === "daily" ? "일급" : "시급"} *
                    </S.Label>
                    <S.Input
                      value={selectedEmployee.payAmount}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleChangeEmployee(
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
                      checked={selectedEmployee.weeklyHolidayPay}
                      disabled={!isEditing}
                      onChange={(e) =>
                        handleChangeEmployee(
                          "weeklyHolidayPay",
                          e.target.checked,
                        )
                      }
                    />
                    <span>주휴수당 적용 여부</span>
                  </S.CheckField>

                  {isEditing && (
                    <S.SaveButton
                      type="button"
                      disabled={!isRequiredFilled}
                      onClick={() => setIsEditing(false)}
                    >
                      저장
                    </S.SaveButton>
                  )}
                </S.Form>
              ) : (
                <S.EmptyText>등록된 직원이 없습니다.</S.EmptyText>
              )}
            </>
          )}
        </S.Content>
      </S.Layout>
    </S.Page>
  );
}
