import {useState} from "react";
import Canvas from "./Canvas";
import UserBar from "./UserBar.tsx";

/**
 * 메시지 타입
 */
interface Message {
    id: number;
    text: string;
    sender: "me" | "other";
    nickname?: string;
    profileImage?: string;
}

function ChatRoom() {

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [input, setInput] = useState("");
    const [messages, setMessages] = useState<Message[]>([]);

    const sendMessage = () => {
        if (!input.trim()) return;

        // 내 메시지
        setMessages((prev) => [
            ...prev,
            {
                id: Date.now(),
                text: input,
                sender: "me",
            },
        ]);

        setInput("");

        // 테스트용 상대 메시지
        setTimeout(() => {
            setMessages((prev) => [
                ...prev,
                {
                    id: Date.now() + 1,
                    text: "상대방 말풍선입니다 🐰",
                    sender: "other",
                    nickname: "토끼친구",
                    profileImage:
                        "https://i.imgur.com/2yaf2wb.png", // 귀여운 토끼
                },
            ]);
        }, 700);
    };

    return (
        <div style={styles.container}>
            <UserBar />
            {/* ================= 채팅 영역 ================= */}
            <div style={styles.chatArea}>
                <div style={styles.messages}>
                    {messages.map((msg) => (
                        <div key={msg.id}>
                            {msg.sender === "other" ? (
                                <div style={styles.otherMessageRow}>
                                    {/* 프로필 이미지 */}
                                    <img
                                        src={msg.profileImage ?? "https://i.imgur.com/2yaf2wb.png"}
                                        alt="profile"
                                        style={styles.profileImage}
                                    />

                                    <div>
                                        {/* 닉네임 */}
                                        <div style={styles.nickname}>
                                            {msg.nickname}
                                        </div>

                                        {/* 상대 말풍선 */}
                                        <div
                                            style={{
                                                ...styles.bubble,
                                                ...styles.otherBubble,
                                            }}
                                        >
                                            {msg.text}
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div
                                    style={{
                                        ...styles.bubble,
                                        ...styles.myBubble,
                                    }}
                                >
                                    {msg.text}
                                </div>
                            )}
                        </div>
                    ))}
                </div>

                {/* 입력 영역 */}
                <div style={styles.inputArea}>
                    <input
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyDown={(e) =>
                            e.key === "Enter" && sendMessage()
                        }
                        placeholder="메시지를 입력하세요"
                        style={styles.input}
                    />
                    <button onClick={sendMessage} style={styles.button}>
                        전송
                    </button>
                </div>
            </div>

            {/* ================= 캔버스 ================= */}
            <Canvas />
        </div>
    );
}

const styles = {
    container: {
        display: "flex",
        gap: "16px",
        padding: "16px",
        height: "100vh",
        boxSizing: "border-box" as const,
        background: "#eef2ff",
    },

    chatArea: {
        width: "340px",
        display: "flex",
        flexDirection: "column" as const,
        borderRadius: "16px",
        background: "#ffffff",
        boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
    },

    messages: {
        flex: 1,
        padding: "12px",
        overflowY: "auto" as const,
        display: "flex",
        flexDirection: "column" as const,
        gap: "10px",
        background: "#f1f5f9",
    },

    bubble: {
        padding: "10px 14px",
        fontSize: "14px",
        lineHeight: "1.4",
        wordBreak: "break-word" as const,
        borderRadius: "16px",
    },

    /* ✅ 내 말풍선: 더 오른쪽 + 너비 줄임 */
    myBubble: {
        alignSelf: "flex-end",
        marginLeft: "auto",
        maxWidth: "55%",
        background: "#fde047",
        color: "#111",
        borderBottomRightRadius: "4px",
    },

    otherBubble: {
        maxWidth: "70%",
        background: "#e5e7eb",
        color: "#111",
        borderBottomLeftRadius: "4px",
    },

    otherMessageRow: {
        display: "flex",
        alignItems: "flex-start",
        gap: "8px",
    },

    profileImage: {
        width: "36px",
        height: "36px",
        borderRadius: "50%",
        objectFit: "cover" as const,
    },

    nickname: {
        fontSize: "12px",
        color: "#6b7280",
        marginBottom: "4px",
        marginLeft: "4px",
    },

    inputArea: {
        display: "flex",
        padding: "10px",
        borderTop: "1px solid #e5e7eb",
        background: "#ffffff",
        borderBottomLeftRadius: "16px",
        borderBottomRightRadius: "16px",
    },

    input: {
        flex: 1,
        padding: "10px",
        borderRadius: "10px",
        border: "1px solid #cbd5f5",
        marginRight: "8px",
        outline: "none",
    },

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
