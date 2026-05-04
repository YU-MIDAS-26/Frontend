import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import type { Employee } from "./EmployeeManage";
import * as S from "../../style/EmployeeTna.Style";

type TnaRecord = {
  id: number;
  date: string;
  employeeId: number;
  displayName: string;
  startTime: string;
  endTime: string;
  hasBreak: boolean;
  breakStart: string;
  breakEnd: string;
};

type EmployeeTnaProps = {
  employees: Employee[];
};

const formatDate = (date: Date) => {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");

  return `${year}-${month}-${day}`;
};

const getDisplayName = (
  employeeId: number,
  records: TnaRecord[],
  employees: Employee[],
) => {
  const employee = employees.find((item) => item.id === employeeId);
  const name = employee?.name || "이름 없음";

  const sameNameEmployees = employees.filter((item) => item.name === name);

  if (sameNameEmployees.length <= 1) return name;

  const sameNameIndex = sameNameEmployees.findIndex(
    (item) => item.id === employeeId,
  );

  return sameNameIndex === 0 ? name : `${name}${sameNameIndex + 1}`;
};

export default function EmployeeTna({ employees }: EmployeeTnaProps) {
  const today = new Date();

  const [selectedDate, setSelectedDate] = useState<Date>(today);
  const [records, setRecords] = useState<TnaRecord[]>([
    {
      id: 1,
      date: formatDate(today),
      employeeId: employees[0]?.id ?? 0,
      displayName: employees[0]?.name ?? "이름 없음",
      startTime: "09:00",
      endTime: "18:00",
      hasBreak: true,
      breakStart: "12:00",
      breakEnd: "13:00",
    },
  ]);

  const [editingId, setEditingId] = useState<number | null>(null);

  const selectedDateText = formatDate(selectedDate);

  const selectedRecords = records.filter(
    (record) => record.date === selectedDateText,
  );

  const handleAddRecord = () => {
    const newRecord: TnaRecord = {
      id: Date.now(),
      date: selectedDateText,
      employeeId: employees[0]?.id ?? 0,
      displayName: employees[0]?.name ?? "이름 없음",
      startTime: "",
      endTime: "",
      hasBreak: false,
      breakStart: "",
      breakEnd: "",
    };

    setRecords((prev) => [...prev, newRecord]);
    setEditingId(newRecord.id);
  };

  const handleChangeRecord = <K extends keyof TnaRecord>(
    id: number,
    key: K,
    value: TnaRecord[K],
  ) => {
    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, [key]: value } : record,
      ),
    );
  };

  const handleSaveRecord = (id: number) => {
    const targetRecord = records.find((record) => record.id === id);

    if (!targetRecord) return;

    const displayName = getDisplayName(
      targetRecord.employeeId,
      records,
      employees,
    );

    setRecords((prev) =>
      prev.map((record) =>
        record.id === id ? { ...record, displayName } : record,
      ),
    );

    setEditingId(null);
  };

  const handleDeleteRecord = (id: number) => {
    const isConfirmed = window.confirm("해당 근무 기록을 삭제할까요?");
    if (!isConfirmed) return;

    setRecords((prev) => prev.filter((record) => record.id !== id));
    setEditingId(null);
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
          <S.AddButton type="button" onClick={handleAddRecord}>
            + 직원 추가
          </S.AddButton>
        </S.ContentHeader>

        <S.RecordList>
          {selectedRecords.map((record) => {
            const isEditing = editingId === record.id;

            return (
              <S.RecordCard key={record.id}>
                <S.RecordTop>
                  <S.RecordName>{record.displayName}</S.RecordName>

                  <S.ActionGroup>
                    {isEditing ? (
                      <S.TextButton
                        type="button"
                        onClick={() => handleSaveRecord(record.id)}
                      >
                        저장
                      </S.TextButton>
                    ) : (
                      <S.TextButton
                        type="button"
                        onClick={() => setEditingId(record.id)}
                      >
                        수정
                      </S.TextButton>
                    )}

                    <S.TextButton
                      type="button"
                      onClick={() => handleDeleteRecord(record.id)}
                    >
                      삭제
                    </S.TextButton>
                  </S.ActionGroup>
                </S.RecordTop>

                {isEditing ? (
                  <S.RecordForm>
                    <S.Field>
                      <S.Label>직원이름</S.Label>
                      <S.Select
                        value={record.employeeId}
                        onChange={(e) =>
                          handleChangeRecord(
                            record.id,
                            "employeeId",
                            Number(e.target.value),
                          )
                        }
                      >
                        {employees.map((employee) => (
                          <option key={employee.id} value={employee.id}>
                            {employee.name || "이름 없음"}
                          </option>
                        ))}
                      </S.Select>
                    </S.Field>

                    <S.Field>
                      <S.Label>출근</S.Label>
                      <S.Input
                        type="time"
                        value={record.startTime}
                        onChange={(e) =>
                          handleChangeRecord(
                            record.id,
                            "startTime",
                            e.target.value,
                          )
                        }
                      />
                    </S.Field>

                    <S.Field>
                      <S.Label>퇴근</S.Label>
                      <S.Input
                        type="time"
                        value={record.endTime}
                        onChange={(e) =>
                          handleChangeRecord(
                            record.id,
                            "endTime",
                            e.target.value,
                          )
                        }
                      />
                    </S.Field>

                    <S.BreakField>
                      <S.Checkbox
                        type="checkbox"
                        checked={record.hasBreak}
                        onChange={(e) =>
                          handleChangeRecord(
                            record.id,
                            "hasBreak",
                            e.target.checked,
                          )
                        }
                      />

                      <S.Label>휴게시간</S.Label>

                      <S.TimeGroup>
                        <S.TimeInput
                          type="time"
                          value={record.breakStart}
                          disabled={!record.hasBreak}
                          onChange={(e) =>
                            handleChangeRecord(
                              record.id,
                              "breakStart",
                              e.target.value,
                            )
                          }
                        />
                        <span>~</span>
                        <S.TimeInput
                          type="time"
                          value={record.breakEnd}
                          disabled={!record.hasBreak}
                          onChange={(e) =>
                            handleChangeRecord(
                              record.id,
                              "breakEnd",
                              e.target.value,
                            )
                          }
                        />
                      </S.TimeGroup>
                    </S.BreakField>
                  </S.RecordForm>
                ) : (
                  <S.InfoList>
                    <S.InfoRow>
                      <span>출근</span>
                      <strong>{record.startTime || "-"}</strong>
                    </S.InfoRow>

                    <S.InfoRow>
                      <span>퇴근</span>
                      <strong>{record.endTime || "-"}</strong>
                    </S.InfoRow>

                    <S.InfoRow>
                      <span>휴게시간</span>
                      <strong>
                        {record.hasBreak
                          ? `${record.breakStart || "-"} ~ ${record.breakEnd || "-"}`
                          : "없음"}
                      </strong>
                    </S.InfoRow>
                  </S.InfoList>
                )}
              </S.RecordCard>
            );
          })}

          {selectedRecords.length === 0 && (
            <S.EmptyText>해당 날짜의 근무자가 없습니다.</S.EmptyText>
          )}
        </S.RecordList>
      </S.WorkSection>
    </S.Wrapper>
  );
}
