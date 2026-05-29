import { useState } from "react";
import styled from "styled-components";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

/* ===== 우측 하단 전체 영역 ===== */

const Wrapper = styled.div`
  position: fixed;
  right: 24px;
  bottom: 24px;
  z-index: 9999;
`;

/* ===== 동그란 챗봇 버튼 ===== */

const FloatingButton = styled.button`
  width: 64px;
  height: 64px;
  border-radius: 50%;
  border: none;
  background: #7ea0b7;
  color: white;
  font-weight: bold;
  cursor: pointer;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);

  &:hover {
    transform: scale(1.05);
  }

  transition: all 0.2s ease;
`;

/* ===== 채팅창 ===== */

const ChatBox = styled.section<{ $open: boolean }>`
  position: absolute;
  right: 0;
  bottom: 80px;

  width: 380px;
  height: 560px;

  background: white;
  border-radius: 16px;
  border: 1px solid #d0d4d9;

  display: flex;
  flex-direction: column;

  overflow: hidden;

  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.2);

  opacity: ${(props) => (props.$open ? 1 : 0)};
  visibility: ${(props) => (props.$open ? "visible" : "hidden")};
  transform: ${(props) =>
    props.$open ? "translateY(0)" : "translateY(20px)"};

  transition: all 0.25s ease;
`;

/* ===== 헤더 ===== */

const Header = styled.div`
  background: #7ea0b7;
  color: white;
  padding: 16px;
  font-weight: bold;

  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const CloseButton = styled.button`
  border: none;
  background: transparent;
  color: white;
  font-size: 18px;
  cursor: pointer;
`;

/* ===== 메시지 ===== */

const Messages = styled.div`
  flex: 1;
  padding: 16px;

  overflow-y: auto;

  display: flex;
  flex-direction: column;
  gap: 10px;

  background: #f8f9fa;
`;

const Bubble = styled.div<{ $role: "user" | "assistant" }>`
  max-width: 75%;
  align-self: ${(props) =>
    props.$role === "user" ? "flex-end" : "flex-start"};

  background: ${(props) =>
    props.$role === "user" ? "#7ea0b7" : "#e9ecef"};

  color: ${(props) => (props.$role === "user" ? "white" : "#111")};

  border-radius: 14px;
  padding: 12px;
  line-height: 1.5;
`;

/* ===== 입력창 ===== */

const InputArea = styled.div`
  display: flex;
  gap: 10px;

  padding: 14px;
  border-top: 1px solid #e5e7eb;
`;

const Input = styled.input`
  flex: 1;

  border: 1px solid #c8cdd2;
  border-radius: 8px;

  padding: 12px;
`;

const Button = styled.button`
  border: none;
  background: #7ea0b7;
  color: white;

  border-radius: 8px;
  padding: 0 16px;

  cursor: pointer;
`;

function makeMockAnswer(question: string) {
  const q = question.replaceAll(" ", "");

  if (q.includes("저번주") && q.includes("토요일")) {
    return "저번 주 토요일 저녁 시간대 매출은 약 1,240,000원입니다.";
  }

  if (q.includes("양파")) {
    return "최근 양파 가격은 전주 대비 약 8.4% 상승했습니다.";
  }

  return "현재는 테스트용 AI 응답입니다.";
}

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "안녕하세요. 자영업자 가게 관리를 도와주는 AI 비서입니다.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: input,
    };

    const assistantMessage: Message = {
      id: Date.now() + 1,
      role: "assistant",
      content: makeMockAnswer(input),
    };

    setMessages((prev) => [...prev, userMessage, assistantMessage]);

    setInput("");
  };

  return (
    <Wrapper>
      <ChatBox $open={open}>
        <Header>
          AI 챗봇
          <CloseButton onClick={() => setOpen(false)}>
            ✕
          </CloseButton>
        </Header>

        <Messages>
          {messages.map((message) => (
            <Bubble key={message.id} $role={message.role}>
              {message.content}
            </Bubble>
          ))}
        </Messages>

        <InputArea>
          <Input
            placeholder="질문을 입력하세요"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />

          <Button onClick={handleSend}>전송</Button>
        </InputArea>
      </ChatBox>

      <FloatingButton onClick={() => setOpen((prev) => !prev)}>
        챗봇
      </FloatingButton>
    </Wrapper>
  );
}