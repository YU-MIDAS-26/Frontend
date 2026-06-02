import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import styled from "styled-components";
import { chatApi } from "../api/chat_api";

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
  min-width: 280px;
  min-height: 360px;
  max-width: 900px;
  max-height: 920px;

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

const ResizeHandle = styled.div`
  position: absolute;
  top: 4px;
  left: 4px;
  z-index: 10;
  width: 16px;
  height: 16px;
  border-radius: 4px;
  cursor: nwse-resize;
  background: linear-gradient(315deg, #d0d4d9, #ffffff);
  box-shadow: 0 0 0 1px rgba(0, 0, 0, 0.05);
`;

const MIN_CHAT_WIDTH = 280;
const MIN_CHAT_HEIGHT = 360;
const MAX_CHAT_WIDTH = 900;
const MAX_CHAT_HEIGHT = 920;

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
  max-width: 85%;
  align-self: ${(props) =>
    props.$role === "user" ? "flex-end" : "flex-start"};

  background: ${(props) =>
    props.$role === "user" ? "#7ea0b7" : "#e9ecef"};

  color: ${(props) => (props.$role === "user" ? "white" : "#111")};

  border-radius: 14px;
  padding: 12px;
  line-height: 1.5;
  font-size: 14px;

  p {
    margin: 0 0 0.5em;
  }

  p:last-child {
    margin-bottom: 0;
  }

  ul,
  ol {
    margin: 0.25em 0;
    padding-left: 1.25em;
  }

  table {
    border-collapse: collapse;
    font-size: 13px;
    margin: 0.5em 0;
  }

  th,
  td {
    border: 1px solid #c8cdd2;
    padding: 4px 8px;
  }

  strong {
    font-weight: 700;
  }
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

  &:disabled {
    background: #f3f4f6;
    cursor: not-allowed;
  }
`;

const Button = styled.button`
  border: none;
  background: #7ea0b7;
  color: white;

  border-radius: 8px;
  padding: 0 16px;

  cursor: pointer;

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
`;

export default function FloatingChatBot() {
  const [open, setOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatBoxRef = useRef<HTMLElement>(null);
  const resizeStateRef = useRef<{
    startX: number;
    startY: number;
    startWidth: number;
    startHeight: number;
  } | null>(null);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      role: "assistant",
      content:
        "안녕하세요. 자영업자 가게 관리를 도와주는 AI 비서입니다. 매출·시간대·채널에 대해 질문해 주세요.",
    },
  ]);

  const [input, setInput] = useState("");
  const [isSending, setIsSending] = useState(false);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isSending]);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!resizeStateRef.current || !chatBoxRef.current) return;
      const { startX, startY, startWidth, startHeight } = resizeStateRef.current;
      const deltaX = event.clientX - startX;
      const deltaY = event.clientY - startY;

      const nextWidth = Math.min(
        Math.max(startWidth - deltaX, MIN_CHAT_WIDTH),
        MAX_CHAT_WIDTH,
      );
      const nextHeight = Math.min(
        Math.max(startHeight - deltaY, MIN_CHAT_HEIGHT),
        MAX_CHAT_HEIGHT,
      );

      chatBoxRef.current.style.width = `${nextWidth}px`;
      chatBoxRef.current.style.height = `${nextHeight}px`;
    };

    const handleMouseUp = () => {
      resizeStateRef.current = null;
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const startResize = (event: ReactMouseEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    if (!chatBoxRef.current) return;
    resizeStateRef.current = {
      startX: event.clientX,
      startY: event.clientY,
      startWidth: chatBoxRef.current.offsetWidth,
      startHeight: chatBoxRef.current.offsetHeight,
    };
  };

  const handleSend = async () => {
    const trimmed = input.trim();
    if (!trimmed || isSending) return;

    const userMessage: Message = {
      id: Date.now(),
      role: "user",
      content: trimmed,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsSending(true);

    try {
      const { answer, usedContext } = await chatApi.sendMessage(trimmed);

      let content = answer;
      if (usedContext.length > 0) {
        content += `\n\n---\n_참고 데이터: ${usedContext.join(", ")}_`;
      }

      const assistantMessage: Message = {
        id: Date.now() + 1,
        role: "assistant",
        content,
      };

      setMessages((prev) => [...prev, assistantMessage]);
    } catch (error) {
      const errorText =
        error instanceof Error
          ? error.message
          : "답변을 가져오지 못했습니다. 잠시 후 다시 시도해 주세요.";

      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          role: "assistant",
          content: errorText,
        },
      ]);
    } finally {
      setIsSending(false);
    }
  };

  return (
    <Wrapper>
      <ChatBox ref={chatBoxRef} $open={open}>
        <ResizeHandle onMouseDown={startResize} aria-label="챗봇 크기 조절" />
        <Header>
          AI 챗봇
          <CloseButton onClick={() => setOpen(false)}>✕</CloseButton>
        </Header>

        <Messages>
          {messages.map((message) => (
            <Bubble key={message.id} $role={message.role}>
              {message.role === "assistant" ? (
                <ReactMarkdown remarkPlugins={[remarkGfm]}>
                  {message.content}
                </ReactMarkdown>
              ) : (
                message.content
              )}
            </Bubble>
          ))}
          {isSending && (
            <Bubble $role="assistant">답변 생성 중...</Bubble>
          )}
          <div ref={messagesEndRef} />
        </Messages>

        <InputArea>
          <Input
            placeholder="질문을 입력하세요 (예: 이번 달 매출 어땠어?)"
            value={input}
            disabled={isSending}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void handleSend();
              }
            }}
          />

          <Button type="button" disabled={isSending} onClick={() => void handleSend()}>
            {isSending ? "..." : "전송"}
          </Button>
        </InputArea>
      </ChatBox>

      <FloatingButton type="button" onClick={() => setOpen((prev) => !prev)}>
        챗봇
      </FloatingButton>
    </Wrapper>
  );
}
