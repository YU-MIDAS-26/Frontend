import styled from "styled-components";

export const Page = styled.main`
  min-height: calc(100vh - 70px);
  background: var(--app-page-bg);
  padding: 40px;
  box-sizing: border-box;
`;

export const Inner = styled.div`
  width: 100%;
  max-width: 1104px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 48px;
  align-items: start;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
    gap: 24px;
  }
`;

export const SideMenu = styled.nav`
  position: sticky;
  top: 40px;
  padding: 24px 18px;
  border: 1px solid #d9e0e6;
  border-radius: 18px;
  background: #ffffff;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 10px;

  @media (max-width: 900px) {
    position: static;
  }
`;

export const SideMenuButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: ${({ $active }) => ($active ? "#e7f0f6" : "transparent")};
  padding: 12px 14px;
  border-radius: 12px;
  text-align: left;
  color: ${({ $active }) => ($active ? "#234056" : "#333333")};
  font-size: 15px;
  line-height: 24px;
  font-weight: ${({ $active }) => ($active ? 700 : 500)};
  cursor: pointer;

  &:hover {
    background: ${({ $active }) => ($active ? "#e7f0f6" : "#f3f6f8")};
  }
`;

export const ContentArea = styled.div`
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

export const PageHeader = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

export const PageTitle = styled.h1`
  margin: 0;
  color: #111111;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.3;
`;

export const PageDescription = styled.p`
  margin: 0;
  color: #5f6b76;
  font-size: 15px;
  line-height: 1.6;
`;

export const Section = styled.section`
  padding: 28px 32px;
  border: 1px solid #d9e0e6;
  border-radius: 18px;
  background: #ffffff;

  @media (max-width: 640px) {
    padding: 22px 20px;
  }
`;

export const Title = styled.h2`
  margin: 0 0 20px;
  color: #111111;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.4;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 14px;
`;

export const InfoRow = styled.div`
  min-height: 64px;
  display: grid;
  grid-template-columns: minmax(110px, 160px) minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 24px;
  padding: 16px 0;
  border-bottom: 1px solid #e9edf1;

  &:first-child {
    padding-top: 0;
  }

  &:last-child {
    padding-bottom: 0;
    border-bottom: none;
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    row-gap: 10px;
  }
`;

export const Label = styled.span`
  color: #60707c;
  font-size: 14px;
  font-weight: 600;
  line-height: 24px;
  white-space: nowrap;
`;

export const Value = styled.span`
  color: #111111;
  font-size: 15px;
  line-height: 24px;
  font-weight: 600;
  word-break: break-word;
`;

export const PhoneInput = styled.input`
  width: min(100%, 280px);
  height: 40px;
  padding: 0 12px;
  border: 1px solid #c8d4dd;
  border-radius: 10px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
`;

export const SmallButtonBox = styled.div`
  width: 84px;
  height: 40px;

  button {
    width: 100%;
    height: 100%;
    border-radius: 10px;
    padding: 8px 10px;
  }

  span {
    font-size: 13px;
    line-height: 18px;
  }
`;

export const TextGroup = styled.div`
  display: flex;
  align-items: center;
  min-width: 0;
`;

export const DeleteRow = styled.div`
  min-height: 64px;
  display: grid;
  grid-template-columns: minmax(0, 1fr) auto;
  align-items: center;
  column-gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    row-gap: 14px;
  }
`;

export const DeleteText = styled.span`
  color: #333333;
  font-size: 15px;
  line-height: 24px;
`;

export const DeleteButton = styled.button`
  width: 110px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: #d32f2f;
  color: white;
  font-size: 14px;
  font-weight: 700;
  line-height: 24px;
  cursor: pointer;
  white-space: nowrap;
`;

export const AlertOverlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.32);
  display: flex;
  align-items: center;
  justify-content: center;

  z-index: 1000;
`;

export const AlertBox = styled.div`
  width: 400px;
  min-height: 201px;
  > div {
    box-sizing: border-box;
    width: 100%;
    min-height: 201px;
  }
  span {
    word-break: keep-all;
  }
  button {
    width: 120px; /* 둘 다 동일하게 */
    height: 40px;
    padding: 0;
    white-space: nowrap;
    flex: none;
  }
  > div > div:last-child {
    justify-content: center;
    gap: 24px;
  }
  button:last-child {
    background: #d32f2f;
  }
`;

export const EmptyContent = styled.div`
  padding: 28px 32px;
  border: 1px solid #d9e0e6;
  border-radius: 18px;
  background: #ffffff;
  color: #555555;
  font-size: 16px;
  line-height: 24px;
`;

export const FixedButtonBox = styled.div`
  width: 110px;
  height: 40px;

  button {
    width: 100%;
    height: 100%;
    padding: 8px 12px;
    border-radius: 12px;
    white-space: nowrap;
  }

  span {
    font-size: 14px;
    line-height: 24px;
    white-space: nowrap;
  }
`;
