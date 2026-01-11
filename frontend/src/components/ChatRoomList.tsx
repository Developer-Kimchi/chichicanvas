import { useNavigate } from "react-router-dom";

const rooms = [
    { id: 1, title: "🎨 그림 수다방" },
    { id: 2, title: "🖌 아이디어 스케치" },
    { id: 3, title: "💬 잡담 + 낙서" },
];

function ChatRoomList() {
    const navigate = useNavigate();

    return (
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
    );
}

const styles = {
    page: {
        minHeight: "100vh",
        padding: "40px",
        background: "#f1f2f6",
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
