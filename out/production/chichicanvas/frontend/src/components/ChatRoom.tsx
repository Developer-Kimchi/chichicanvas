// React에서 상태(state)를 관리하기 위한 useState 훅
import { useState } from "react";

// 캔버스 컴포넌트 (오른쪽에 그림 그리는 영역)
import Canvas from "./Canvas";

/**
 * 메시지 하나의 형태를 정의한 타입
 * - id: 고유값 (key 용도)
 * - text: 메시지 내용
 * - sender: 누가 보냈는지 ("me" | "other")
 */
interface Message {
    id: number;
    text: string;
    sender: "me" | "other";
}

function ChatRoom() {
    /**
     * input
     * - 채팅 입력창에 타이핑 중인 문자열
     */
    const [input, setInput] = useState("");

    /**
     * messages
     * - 지금까지 쌓인 채팅 메시지 목록
     * - Message 타입 배열
     */
    const [messages, setMessages] = useState<Message[]>([]);

    /**
     * 메시지 전송 함수
     * - 버튼 클릭 or Enter 키로 호출됨
     */
    const sendMessage = () => {
        // 공백만 입력한 경우 전송 안 함
        if (!input.trim()) return;

        /**
         * 기존 메시지(prev)에
         * 새로운 메시지를 하나 추가
         */
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(), // 현재 시간을 id로 사용
                text: input,    // 입력한 텍스트
                sender: "me",   // 내가 보낸 메시지
            },
        ]);

        // 입력창 비우기
        setInput("");

        /**
         * (테스트용)
         * 상대방이 답장한 것처럼 보이게
         * 0.7초 뒤에 메시지 하나 추가
         */
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "상대방 말풍선입니다 🙂",
                    sender: "other",
                },
            ]);
        }, 700);
    };

    return (
        /**
         * 전체 컨테이너
         * - 왼쪽: 채팅
         * - 오른쪽: 캔버스
         */
        <div style={styles.container}>
            {/* ================= 채팅 영역 ================= */}
            <div style={styles.chatArea}>
                {/* 메시지 목록 영역 */}
                <div style={styles.messages}>
                    {messages.map((msg) => (
                        /**
                         * 말풍선 하나
                         * sender 값에 따라 스타일이 달라짐
                         */
                        <div
                            key={msg.id}
                            style={{
                                ...styles.bubble, // 공통 말풍선 스타일
                                ...(msg.sender === "me"
                                    ? styles.myBubble   // 내 말풍선
                                    : styles.otherBubble), // 상대 말풍선
                            }}
                        >
                            {msg.text}
                        </div>
                    ))}
                </div>

                {/* 입력창 + 전송 버튼 */}
                <div style={styles.inputArea}>
                    <input
                        value={input} // 입력값을 state와 연결
                        onChange={(e) => setInput(e.target.value)} // 타이핑 시 state 변경
                        onKeyDown={(e) =>
                            e.key === "Enter" && sendMessage()
                        } // Enter 키 전송
                        placeholder="메시지를 입력하세요"
                        style={styles.input}
                    />

                    <button
                        onClick={sendMessage}
                        style={styles.button}
                    >
                        전송
                    </button>
                </div>
            </div>

            {/* ================= 캔버스 영역 ================= */}
            <Canvas />
        </div>
    );
}

/**
 * 스타일 객체
 * (CSS 대신 JS 객체로 스타일링)
 */
const styles = {
    /**
     * 전체 화면 레이아웃
     */
    container: {
        display: "flex",
        gap: "16px",
        padding: "16px",
        height: "100vh",
        boxSizing: "border-box" as const,
        background: "#eef2ff",
    },

    /**
     * 채팅 박스
     */
    chatArea: {
        width: "340px",
        display: "flex",
        flexDirection: "column" as const,
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    },

    /**
     * 메시지들이 쌓이는 영역
     */
    messages: {
        flex: 1,
        padding: "12px",
        overflowY: "auto" as const,
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
        background: "#f1f5f9",
    },

    /**
     * 말풍선 공통 스타일
     */
    bubble: {
        maxWidth: "70%",
        padding: "10px 14px",
        fontSize: "14px",
        lineHeight: "1.4",
        wordBreak: "break-word" as const,
        borderRadius: "16px",
    },

    /**
     * 내 말풍선 (오른쪽, 노란색)
     */
    myBubble: {
        alignSelf: "flex-end",
        background: "#fde047",
        color: "#111",
        borderBottomRightRadius: "4px",
    },

    /**
     * 상대 말풍선 (왼쪽, 회색)
     */
    otherBubble: {
        alignSelf: "flex-start",
        background: "#e5e7eb",
        color: "#111",
        borderBottomLeftRadius: "4px",
    },

    /**
     * 입력 영역
     */
    inputArea: {
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #e5e7eb",
        background: "#ffffff",
        borderBottomLeftRadius: "16px",
        borderBottomRightRadius: "16px",
    },

    /**
     * 채팅 입력창
     */
    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #cbd5f5",
        marginRight: "8px",
        outline: "none",
    },

    /**
     * 전송 버튼
     */
    button: {
        padding: "10px 14px",
        borderRadius: "10px",
        border: "none",
        background: "#4f46e5",
        color: "white",
        fontWeight: 600,
        cursor: "pointer",
    },
};

export default ChatRoom;
