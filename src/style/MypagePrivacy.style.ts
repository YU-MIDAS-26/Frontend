import styled from "styled-components";

export const Page = styled.main`
  min-height: calc(1024px - 70px);
  background: white;
  padding: 0;
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: flex-start;
`;

export const Inner = styled.div`
  width: 760px;
  margin-top: 136px;

  display: grid;
  grid-template-columns: 100px 1fr;
  column-gap: 76px;
  align-items: start;
`;

export const SideMenu = styled.nav`
  width: 100px;
  padding: 6px 4px;
  border: 2px solid #7ea0b7;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

export const SideMenuButton = styled.button<{ $active?: boolean }>`
  border: none;
  background: transparent;
  padding: 0;
  text-align: left;
  color: ${({ $active }) => ($active ? "#111111" : "#333333")};
  font-size: 14px;
  line-height: 24px;
  font-weight: ${({ $active }) => ($active ? 700 : 400)};
  cursor: pointer;
`;

export const ContentArea = styled.div`
  width: 360px;
  min-width: 360px;
`;

export const Section = styled.section`
  margin-bottom: 44px;
`;

export const Title = styled.h2`
  margin: 0 0 18px;
  color: #7ea0b7;
  font-size: 20px;
  font-weight: 400;
  line-height: 28px;
`;

export const InfoList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

export const InfoRow = styled.div`
  min-height: 40px;
  display: grid;
  grid-template-columns: 1fr 84px;
  align-items: center;
  column-gap: 24px;
`;

export const Label = styled.span`
  color: black;
  font-size: 14px;
  line-height: 24px;
  white-space: nowrap;
`;

export const Value = styled.span`
  color: black;
  font-size: 14px;
  line-height: 24px;
  white-space: nowrap;
`;

export const PhoneInput = styled.input`
  width: 150px;
  height: 30px;
  padding: 0 10px;
  border: 1px solid #7ea0b7;
  border-radius: 8px;
  outline: none;
  font-size: 14px;
  box-sizing: border-box;
`;

export const SmallButtonBox = styled.div`
  width: 54px;
  height: 30px;
  margin-left: 18px;

  button {
    border-radius: 10px;
    padding: 4px 8px;
  }

  span {
    font-size: 11px;
    line-height: 16px;
  }
`;

export const TextGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
  min-width: 0;
`;

export const DeleteRow = styled.div`
  min-height: 40px;
  display: grid;
  grid-template-columns: 1fr 84px;
  align-items: center;
  column-gap: 24px;
`;

export const DeleteText = styled.span`
  color: black;
  font-size: 14px;
  line-height: 24px;
`;

export const DeleteButton = styled.button`
  width: 84px;
  height: 40px;
  border: none;
  border-radius: 12px;
  background: #d32f2f;
  color: black;
  font-size: 14px;
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
  color: #555555;
  font-size: 16px;
  line-height: 24px;
`;

export const FixedButtonBox = styled.div`
  width: 84px;
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
