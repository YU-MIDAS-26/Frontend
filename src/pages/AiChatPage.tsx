import { useState } from "react";
import styled from "styled-components";

type Message = {
  id: number;
  role: "user" | "assistant";
  content: string;
};

const Page = styled.main`
  min-height: calc(100vh - 70px);
  background: #dfe1e5;
  padding: 24px;
`;

const ChatBox = styled.section`
  max-width: 900px;
  margin: 0 auto;
  background: #ffffff;
  border: 1px solid #d0d4d9;
  border-radius: 10px;
  padding: 18px;
`;

const Title = styled.h2`
  margin: 0 0 14px;
`;

const Messages = styled.div`
  min-height: 420px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 16px;
`;

const Bubble = styled.div<{ $role: "user" | "assistant" }>`
  max-width: 75%;
  align-self: ${(props) => (props.$role === "user" ? "flex-end" : "flex-start")};
  background: ${(props) => (props.$role === "user" ? "#7ea0b7" : "#f1f3f5")};
  border-radius: 12px;
  padding: 12px;
  line-height: 1.5;
`;

const InputArea = styled.div`
  display: flex;
  gap: 10px;
`;

const Input = styled.input`
  flex: 1;
  border: 1px solid #c8cdd2;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
`;

const Button = styled.button`
  border: none;
  background: #7ea0b7;
  color: #111;
  font-weight: 700;
  border-radius: 8px;
  padding: 0 18px;
  cursor: pointer;
`;

function makeMockAnswer(question: string) {
  const q = question.replaceAll(" ", "");

  if (q.includes("저번주") && q.includes("토요일") && q.includes("저녁")) {
    return "저번 주 토요일 저녁 시간대 매출은 약 1,240,000원으로 확인됩니다. 특히 18시~20시 사이 매출 비중이 가장 높았습니다.";
  }

  if (q.includes("양파") && (q.includes("가격") || q.includes("상승률"))) {
    return "최근 양파 가격은 전주 대비 약 8.4% 상승한 것으로 분석됩니다. KAMIS API가 연결되면 실제 도매/소매 가격 데이터를 기준으로 답변하도록 변경할 수 있습니다.";
  }

  if (q.includes("재료") || q.includes("등록")) {
    return "재료 등록 화면에서 재료명, 무게, 원산지를 입력한 뒤 ‘사용하는 재료 추가하기’를 누르고, 마지막에 ‘추가완료’를 누르면 됩니다.";
  }

  return "현재는 임시 학습 데이터 기반으로 답변하고 있습니다. 추후 백엔드와 매출 데이터, KAMIS API를 연결하면 실제 저장 데이터 기반으로 답변할 수 있습니다.";
}

export default function AiChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "안녕하세요. 자영업자 가게 관리를 도와주는 AI 비서입니다. 매출, 재료, 가격 동향에 대해 질문해주세요.",
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
    <Page>
      <ChatBox>
        <Title>AI 챗봇</Title>

        <Messages>
          {messages.map((message) => (
            <Bubble key={message.id} $role={message.role}>
              {message.content}
            </Bubble>
          ))}
        </Messages>

        <InputArea>
          <Input
            placeholder="예: 저번 주 토요일 저녁 시간대 매출이 어떻게 됐었지?"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSend();
            }}
          />
          <Button onClick={handleSend}>전송</Button>
        </InputArea>
      </ChatBox>
    </Page>
  );
}