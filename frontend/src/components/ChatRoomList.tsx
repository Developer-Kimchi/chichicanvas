import { useNavigate } from "react-router-dom";
import {useEffect, useState} from "react";
import {fetchWithCookie} from "./Client.tsx";

const rooms = [
    { id: 1, title: "🎨 그림 수다방" },
    { id: 2, title: "🖌 아이디어 스케치" },
    { id: 3, title: "💬 잡담 + 낙서" },
];

function ChatRoomList() {

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [data, setData] = useState(null);

    useEffect(() => {
        fetchWithCookie(`${BASE_URL}/user/check`).then(res => setData(res));
    }, []); // [] = 컴포넌트 처음 렌더될 때 한 번만 실행

    const navigate = useNavigate();

    return (
        <div style={styles.bg}>
            <div style={styles.page}>
                <h2 style={styles.title}>채팅방 목록</h2>

                <div style={styles.grid}>
                    {rooms.map((room) => (
                        <div
                            key={room.id}
                            style={styles.card}
                            onClick={() => navigate(`/rooms/${room.id}`)}
                        >
                            <h3>{room.title}</h3>
                            <button style={styles.button}>입장하기</button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

const styles = {
    bg: {
        position: "fixed",
        inset: 0,
        display: "flex",
        flexDirection: "column" as const,
        background: "#f1f2f6", // 전체 화면 배경
    },
    page: {
        flex: 1,
        width: "100%",
        maxWidth: "1200px",   // 원하면 최대폭 제한 가능
        margin: "0 auto",
        padding: "40px",
        boxSizing: "border-box",
    },
    title: {
        marginBottom: "24px",
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))",
        gap: "20px",
    },
    card: {
        background: "#fff",
        borderRadius: "12px",
        padding: "20px",
        boxShadow: "0 10px 20px rgba(0,0,0,0.08)",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column" as const,
        justifyContent: "space-between",
        transition: "transform 0.2s",
    },
    button: {
        marginTop: "16px",
        padding: "10px",
        borderRadius: "8px",
        border: "none",
        background: "#0984e3",
        color: "#fff",
        fontWeight: "bold" as const,
        cursor: "pointer",
    },
};

export default ChatRoomList;
