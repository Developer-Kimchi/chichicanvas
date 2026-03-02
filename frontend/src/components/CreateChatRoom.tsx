import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fetchWithCookie } from "./Client.tsx";
import UserBar from "./UserBar.tsx";

const CATEGORIES = ["잡담", "게임", "공부", "그림", "음악", "기타"];

function CreateChatRoom() {
    const navigate = useNavigate();
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [name, setName] = useState("");
    const [category, setCategory] = useState(CATEGORIES[0]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        if (!name.trim()) {
            setError("채팅방 이름을 입력해주세요.");
            return;
        }

        setLoading(true);
        setError(null);

        try {
            await fetchWithCookie(`${BASE_URL}/chatroom`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ chatroomName: name, chatroomCategory: category }),
            });
            navigate("/rooms");
        } catch {
            setError("채팅방 생성에 실패했어요. 다시 시도해주세요.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.bg}>
            <UserBar />
            <div style={styles.page}>
                <div style={styles.card}>
                    <h2 style={styles.title}>채팅방 만들기</h2>

                    <label style={styles.label}>채팅방 이름</label>
                    <input
                        style={styles.input}
                        placeholder="채팅방 이름을 입력하세요"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        maxLength={50}
                    />

                    <label style={styles.label}>카테고리</label>
                    <select
                        style={styles.input}
                        value={category}
                        onChange={e => setCategory(e.target.value)}
                    >
                        {CATEGORIES.map(c => (
                            <option key={c} value={c}>{c}</option>
                        ))}
                    </select>

                    {error && <p style={styles.error}>{error}</p>}

                    <div style={styles.buttons}>
                        <button style={styles.cancelButton} onClick={() => navigate("/rooms")}>
                            취소
                        </button>
                        <button style={styles.submitButton} onClick={handleSubmit} disabled={loading}>
                            {loading ? "생성 중..." : "만들기"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

const styles = {
    bg: {
        position: "fixed" as const,
        inset: 0,
        display: "flex",
        flexDirection: "column" as const,
        background: "#f1f2f6",
    },
    page: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
    },
    card: {
        background: "#fff",
        borderRadius: "16px",
        padding: "40px",
        width: "100%",
        maxWidth: "480px",
        boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
    },
    title: {
        marginTop: 0,
        marginBottom: "28px",
    },
    label: {
        display: "block" as const,
        marginBottom: "8px",
        fontWeight: "bold" as const,
        fontSize: "14px",
        color: "#2d3436",
    },
    input: {
        width: "100%",
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #dfe6e9",
        marginBottom: "20px",
        fontSize: "14px",
        boxSizing: "border-box" as const,
        outline: "none",
    },
    error: {
        color: "#d63031",
        fontSize: "13px",
        marginBottom: "12px",
    },
    buttons: {
        display: "flex",
        gap: "12px",
        justifyContent: "flex-end",
    },
    cancelButton: {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "1px solid #dfe6e9",
        background: "#fff",
        cursor: "pointer",
        fontWeight: "bold" as const,
    },
    submitButton: {
        padding: "10px 20px",
        borderRadius: "8px",
        border: "none",
        background: "#0984e3",
        color: "#fff",
        cursor: "pointer",
        fontWeight: "bold" as const,
    },
};

export default CreateChatRoom;