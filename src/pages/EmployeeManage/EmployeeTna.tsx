import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Employee } from "./EmployeeManage";
import * as S from "../../style/EmployeeTna.Style";
import {
  useAttendancesQuery,
  useCreateAttendanceMutation,
  useUpdateAttendanceMutation,
  useDeleteAttendanceMutation,
  type AttendanceRecord,
} from "../../api/employee_api";

type EmployeeTnaProps = {
  employees: Employee[];
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
};

const formatToBackendTime = (timeStr: string): string | null => {
  if (!timeStr) return null;
  return timeStr.split(":").length === 2 ? `${timeStr}:00` : timeStr;
};

const formatToInputTime = (timeStr: string | null): string => {
  if (!timeStr) return "";
  const parts = timeStr.split(":");
  return parts.slice(0, 2).join(":"); // 시, 분만 조합해서 "13:30" 리턴
};

export default function EmployeeTna({ employees }: EmployeeTnaProps) {
  const today = new Date();
  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const selectedDateText = formatDate(selectedDate);

  const { data: serverAttendances = [], isLoading } =
    useAttendancesQuery(selectedDateText);
  const createAttendanceMutation = useCreateAttendanceMutation();
  const updateAttendanceMutation = useUpdateAttendanceMutation();
  const deleteAttendanceMutation = useDeleteAttendanceMutation();

  const [editingId, setEditingId] = useState<number | null>(null);
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [formState, setFormState] = useState<{
    employeeId: number;
    startTime: string;
    endTime: string;
    hasBreak: boolean;
    breakStart: string;
    breakEnd: string;
  }>({
    employeeId: employees[0]?.id ?? 0,
    startTime: "",
    endTime: "",
    hasBreak: false,
    breakStart: "",
    breakEnd: "",
  });

  const handleAddRecordClick = () => {
    if (employees.length === 0) {
      alert("등록된 직원이 없습니다. 직원 목록에서 먼저 직원을 추가해 주세요.");
      return;
    }
    setIsAddingMode(true);
    setEditingId(-1);
    setFormState({
      employeeId: employees[0].id,
      startTime: "09:00",
      endTime: "18:00",
      hasBreak: false,
      breakStart: "",
      breakEnd: "",
    });
  };

  const handleStartEditClick = (record: AttendanceRecord) => {
    setIsAddingMode(false);
    setEditingId(record.id);
    setFormState({
      employeeId: record.employeeId,
      startTime: formatToInputTime(record.checkInTime),
      endTime: formatToInputTime(record.checkOutTime),
      hasBreak: record.breakTimeApplied,
      breakStart: formatToInputTime(record.breakStartTime),
      breakEnd: formatToInputTime(record.breakEndTime),
    });
  };

  const handleSaveSubmit = () => {
    const payload = {
      employeeId: formState.employeeId,
      workDate: selectedDateText,
      checkInTime: formatToBackendTime(formState.startTime),
      checkOutTime: formatToBackendTime(formState.endTime),
      breakTimeApplied: formState.hasBreak,
      breakStartTime: formState.hasBreak
        ? formatToBackendTime(formState.breakStart)
        : null,
      breakEndTime: formState.hasBreak
        ? formatToBackendTime(formState.breakEnd)
        : null,
    };

    if (isAddingMode) {
      createAttendanceMutation.mutate(payload, {
        onSuccess: () => {
          setEditingId(null);
          setIsAddingMode(false);
          alert("근무 기록이 등록되었습니다.");
        },
        onError: (err) =>
          alert(err.message || "근무 기록 등록에 실패했습니다."),
      });
    } else if (editingId && editingId !== -1) {
      updateAttendanceMutation.mutate(
        { attendanceId: editingId, payload },
        {
          onSuccess: () => {
            setEditingId(null);
            alert("근무 기록이 수정되었습니다.");
          },
          onError: (err) =>
            alert(err.message || "근무 기록 수정에 실패했습니다."),
        },
      );
    }
  };

  const handleDeleteClick = (attendanceId: number, name: string) => {
    const isConfirmed = window.confirm(
      `[${name}]님의 해당 근무 기록을 삭제할까요?`,
    );
    if (!isConfirmed) return;

    deleteAttendanceMutation.mutate(
      { attendanceId, workDate: selectedDateText },
      {
        onSuccess: () => alert("근무 기록이 삭제되었습니다."),
        onError: (err) =>
          alert(err.message || "근무 기록 삭제에 실패했습니다."),
      },
    );
  };

  return (
    <S.Wrapper>
      <S.CalendarSection>
        <S.CalendarTitle>달력</S.CalendarTitle>
        <S.CalendarBox>
          <Calendar
            value={selectedDate}
            onChange={(value) => {
              if (value instanceof Date) {
                setSelectedDate(value);
                setEditingId(null);
                setIsAddingMode(false);
              }
            }}
            calendarType="gregory"
            formatDay={(_, date) => String(date.getDate())}
          />
        </S.CalendarBox>
      </S.CalendarSection>

      <S.WorkSection>
        <S.ContentHeader>
          <S.Title>{selectedDateText} 근무 목록</S.Title>
          <S.AddButton
            type="button"
            onClick={handleAddRecordClick}
            disabled={isAddingMode}
          >
            + 직원 추가
          </S.AddButton>
        </S.ContentHeader>

        <S.RecordList>
          {isAddingMode && editingId === -1 && (
            <S.RecordCard>
              <S.RecordTop>
                <S.RecordName style={{ color: "#7ea0b7", fontSize: "14px" }}>
                  신규 근무 등록
                </S.RecordName>
                <S.ActionGroup>
                  <S.TextButton type="button" onClick={handleSaveSubmit}>
                    저장
                  </S.TextButton>
                  <S.TextButton
                    type="button"
                    onClick={() => {
                      setEditingId(null);
                      setIsAddingMode(false);
                    }}
                  >
                    취소
                  </S.TextButton>
                </S.ActionGroup>
              </S.RecordTop>

              <S.RecordForm>
                <S.Field>
                  <S.Label>직원이름</S.Label>
                  <S.Select
                    value={formState.employeeId}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        employeeId: Number(e.target.value),
                      }))
                    }
                  >
                    {employees.map((emp) => (
                      <option key={emp.id} value={emp.id}>
                        {emp.name}
                      </option>
                    ))}
                  </S.Select>
                </S.Field>

                <S.Field>
                  <S.Label>출근</S.Label>
                  <S.Input
                    type="time"
                    value={formState.startTime}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        startTime: e.target.value,
                      }))
                    }
                  />
                </S.Field>

                <S.Field>
                  <S.Label>퇴근</S.Label>
                  <S.Input
                    type="time"
                    value={formState.endTime}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        endTime: e.target.value,
                      }))
                    }
                  />
                </S.Field>

                <S.BreakField>
                  <S.Checkbox
                    type="checkbox"
                    checked={formState.hasBreak}
                    onChange={(e) =>
                      setFormState((prev) => ({
                        ...prev,
                        hasBreak: e.target.checked,
                      }))
                    }
                  />
                  <S.Label>휴게시간</S.Label>
                  <S.TimeGroup>
                    <S.TimeInput
                      type="time"
                      value={formState.breakStart}
                      disabled={!formState.hasBreak}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          breakStart: e.target.value,
                        }))
                      }
                    />
                    <span>~</span>
                    <S.TimeInput
                      type="time"
                      value={formState.breakEnd}
                      disabled={!formState.hasBreak}
                      onChange={(e) =>
                        setFormState((prev) => ({
                          ...prev,
                          breakEnd: e.target.value,
                        }))
                      }
                    />
                  </S.TimeGroup>
                </S.BreakField>
              </S.RecordForm>
            </S.RecordCard>
          )}

          {isLoading ? (
            <S.EmptyText>근무 내역을 불러오는 중...</S.EmptyText>
          ) : (
            serverAttendances.map((record) => {
              const isEditing = editingId === record.id;

              return (
                <S.RecordCard key={record.id}>
                  <S.RecordTop>
                    <S.RecordName>{record.employeeName}</S.RecordName>
                    <S.ActionGroup>
                      {isEditing ? (
                        <S.TextButton type="button" onClick={handleSaveSubmit}>
                          저장
                        </S.TextButton>
                      ) : (
                        <S.TextButton
                          type="button"
                          onClick={() => handleStartEditClick(record)}
                        >
                          수정
                        </S.TextButton>
                      )}
                      <S.TextButton
                        type="button"
                        onClick={() =>
                          handleDeleteClick(record.id, record.employeeName)
                        }
                      >
                        삭제
                      </S.TextButton>
                    </S.ActionGroup>
                  </S.RecordTop>

                  {isEditing ? (
                    <S.RecordForm>
                      <S.Field>
                        <S.Label>출근</S.Label>
                        <S.Input
                          type="time"
                          value={formState.startTime}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              startTime: e.target.value,
                            }))
                          }
                        />
                      </S.Field>

                      <S.Field>
                        <S.Label>퇴근</S.Label>
                        <S.Input
                          type="time"
                          value={formState.endTime}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              endTime: e.target.value,
                            }))
                          }
                        />
                      </S.Field>

                      <S.BreakField>
                        <S.Checkbox
                          type="checkbox"
                          checked={formState.hasBreak}
                          onChange={(e) =>
                            setFormState((prev) => ({
                              ...prev,
                              hasBreak: e.target.checked,
                            }))
                          }
                        />
                        <S.Label>휴게시간</S.Label>
                        <S.TimeGroup>
                          <S.TimeInput
                            type="time"
                            value={formState.breakStart}
                            disabled={!formState.hasBreak}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                breakStart: e.target.value,
                              }))
                            }
                          />
                          <span>~</span>
                          <S.TimeInput
                            type="time"
                            value={formState.breakEnd}
                            disabled={!formState.hasBreak}
                            onChange={(e) =>
                              setFormState((prev) => ({
                                ...prev,
                                breakEnd: e.target.value,
                              }))
                            }
                          />
                        </S.TimeGroup>
                      </S.BreakField>
                    </S.RecordForm>
                  ) : (
                    <S.InfoList>
                      <S.InfoRow>
                        <span>출근</span>
                        <strong>
                          {formatToInputTime(record.checkInTime) || "-"}
                        </strong>
                      </S.InfoRow>
                      <S.InfoRow>
                        <span>퇴근</span>
                        <strong>
                          {formatToInputTime(record.checkOutTime) || "-"}
                        </strong>
                      </S.InfoRow>
                      <S.InfoRow>
                        <span>휴게시간</span>
                        <strong>
                          {record.breakTimeApplied
                            ? `${formatToInputTime(record.breakStartTime)} ~ ${formatToInputTime(record.breakEndTime)}`
                            : "없음"}
                        </strong>
                      </S.InfoRow>
                    </S.InfoList>
                  )}
                </S.RecordCard>
              );
            })
          )}

          {!isAddingMode && serverAttendances.length === 0 && !isLoading && (
            <S.EmptyText>해당 날짜의 근무자가 없습니다.</S.EmptyText>
          )}
        </S.RecordList>
      </S.WorkSection>
    </S.Wrapper>
  );
}
