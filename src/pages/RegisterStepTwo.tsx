import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import * as S from "../style/RegisterStepTwo.Style";
import {
  type RegisterStepTwoPayload,
  useRegisterStepTwoMutation,
} from "../api/register_api";

type FormKey = keyof RegisterStepTwoPayload;

const BUSINESS_TYPE_OPTIONS: Array<RegisterStepTwoPayload["businessType"]> = [
  "대기업",
  "중견기업",
  "중소기업",
  "중소상공인",
];

const TAX_TYPE_OPTIONS: Array<Exclude<RegisterStepTwoPayload["taxType"], "">> = [
  "과세",
  "비과세",
];

const RegisterStepTwo = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<RegisterStepTwoPayload>({
    businessNumber: "",
    companyName: "",
    ceoName: "",
    representativeNumber: "",
    address: "",
    businessType: "",
    openingDate: "",
    taxType: "",
    businessCategory: "",
    businessItem: "",
    businessLicenseFile: null,
  });
  const [submitError, setSubmitError] = useState("");

  const { mutate, isPending } = useRegisterStepTwoMutation();

  const isBusinessNumberValid = formData.businessNumber.length === 10;

  const isFormComplete = useMemo(
    () =>
      isBusinessNumberValid &&
      formData.companyName.trim().length > 0 &&
      formData.ceoName.trim().length > 0 &&
      formData.representativeNumber.trim().length > 0 &&
      formData.address.trim().length > 0 &&
      formData.businessType.length > 0 &&
      formData.openingDate.trim().length > 0 &&
      formData.taxType.length > 0 &&
      formData.businessCategory.trim().length > 0 &&
      formData.businessItem.trim().length > 0 &&
      formData.businessLicenseFile !== null,
    [formData, isBusinessNumberValid],
  );

  const handleChange = <K extends FormKey>(
    key: K,
    value: RegisterStepTwoPayload[K],
  ) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
    setSubmitError("");
  };

  const handleBusinessNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChange(
      "businessNumber",
      event.target.value.replace(/\D/g, "").slice(0, 10),
    );
  };

  const handleRepresentativeNumberChange = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    handleChange(
      "representativeNumber",
      event.target.value.replace(/\D/g, "").slice(0, 11),
    );
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!isBusinessNumberValid) {
      setSubmitError("사업자 등록 번호는 하이픈 없이 10자리로 입력해 주세요.");
      return;
    }

    if (!isFormComplete) {
      setSubmitError("필수 정보를 모두 입력해 주세요.");
      return;
    }

    console.log("[RegisterStepTwo] step two submit payload:", formData);

    mutate(formData, {
      onSuccess: () => {
        navigate("/register-complete");
      },
      onError: (error) => {
        setSubmitError(error.message);
      },
    });
  };

  return (
    <S.Page>
      <S.Card>
        <S.Title>회원가입</S.Title>
        <S.Form onSubmit={handleSubmit}>
          <S.StepTitle>2. 사업자 정보 입력하기</S.StepTitle>

          <S.FormTextField
            value={formData.businessNumber}
            placeholder="사업자 등록 번호"
            inputMode="numeric"
            maxLength={10}
            onChange={handleBusinessNumberChange}
          />

          {formData.businessNumber.length > 0 && !isBusinessNumberValid ? (
            <S.Message $tone="error">
              사업자 등록 번호는 하이픈 없이 10자리로 입력해 주세요.
            </S.Message>
          ) : null}

          <S.FormTextField
            value={formData.companyName}
            placeholder="회사명"
            onChange={(e) => handleChange("companyName", e.target.value)}
          />

          <S.FormTextField
            value={formData.ceoName}
            placeholder="대표자명"
            onChange={(e) => handleChange("ceoName", e.target.value)}
          />

          <S.FormTextField
            value={formData.representativeNumber}
            placeholder="대표번호"
            inputMode="numeric"
            maxLength={11}
            onChange={handleRepresentativeNumberChange}
          />

          <S.FormTextField
            value={formData.address}
            placeholder="회사 주소"
            onChange={(e) => handleChange("address", e.target.value)}
          />

          <S.SelectField
            value={formData.businessType}
            onChange={(e) =>
              handleChange(
                "businessType",
                e.target.value as RegisterStepTwoPayload["businessType"],
              )
            }
          >
            <option value="" disabled>
              기업구분
            </option>
            {BUSINESS_TYPE_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </S.SelectField>

          <S.DateWrapper>
            <S.FormTextField
              type={formData.openingDate ? "date" : "text"}
              placeholder="개업일"
              onFocus={(e) => (e.target.type = "date")}
              onBlur={(e) => {
                if (!e.target.value) {
                  e.target.type = "text";
                }
              }}
              value={formData.openingDate}
              onChange={(e) => handleChange("openingDate", e.target.value)}
            />
          </S.DateWrapper>

          <S.RadioGroup>
            <S.RadioGroupLabel>과세 구분</S.RadioGroupLabel>
            <S.RadioOptions>
              {TAX_TYPE_OPTIONS.map((option) => (
                <S.RadioLabel key={option}>
                  <S.RadioInput
                    type="radio"
                    name="taxType"
                    value={option}
                    checked={formData.taxType === option}
                    onChange={(e) =>
                      handleChange(
                        "taxType",
                        e.target.value as RegisterStepTwoPayload["taxType"],
                      )
                    }
                  />
                  <S.RadioMark $checked={formData.taxType === option} />
                  <span>{option}</span>
                </S.RadioLabel>
              ))}
            </S.RadioOptions>
          </S.RadioGroup>

          <S.HalfRow>
            <S.FormTextField
              value={formData.businessCategory}
              placeholder="업태명"
              onChange={(e) => handleChange("businessCategory", e.target.value)}
            />
            <S.FormTextField
              value={formData.businessItem}
              placeholder="종목명"
              onChange={(e) => handleChange("businessItem", e.target.value)}
            />
          </S.HalfRow>

          <S.FileUploadField>
            <S.HiddenFileInput
              id="business-license-file"
              type="file"
              accept="image/*,.pdf"
              onChange={(e) =>
                handleChange("businessLicenseFile", e.target.files?.[0] || null)
              }
            />
            <S.FileUploadButton htmlFor="business-license-file">
              파일 첨부
            </S.FileUploadButton>
            <S.FileUploadText $hasFile={formData.businessLicenseFile !== null}>
              {formData.businessLicenseFile?.name ??
                "사업자등록증 첨부: 세금계산서 발행을 위해 사업자등록증 사본을 제출해 주세요."}
            </S.FileUploadText>
          </S.FileUploadField>

          {submitError ? <S.Message $tone="error">{submitError}</S.Message> : null}

          <S.NextButton
            type="submit"
            isActive={isFormComplete}
            disabled={!isFormComplete || isPending}
            aria-busy={isPending}
          >
            {isPending ? "처리 중..." : "다음"}
          </S.NextButton>
        </S.Form>
      </S.Card>
    </S.Page>
  );
};

export default RegisterStepTwo;
