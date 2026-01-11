import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {
    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");

    return (
        <div style={styles.bg}>
            <div style={styles.card}>
                <h1 style={styles.logo}>🎨 Chichi Canvas</h1>
                <p style={styles.subtitle}>그림으로 대화하세요</p>

                <input
                    style={styles.input}
                    placeholder="아이디"
                    value={id}
                    onChange={(e) => setId(e.target.value)}
                />

                <input
                    style={styles.input}
                    type="password"
                    placeholder="비밀번호"
                    value={pw}
                    onChange={(e) => setPw(e.target.value)}
                />

                <button
                    style={styles.button}
                    onClick={() => navigate("/rooms")}
                >
                    로그인
                </button>
            </div>
        </div>
    );
}

const styles = {
    bg: {
        height: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background:
            "linear-gradient(135deg, #6c5ce7, #0984e3, #00cec9)",
    },
    card: {
        width: "360px",
        padding: "40px",
        borderRadius: "16px",
        background: "#ffffffee",
        boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
        display: "flex",
        flexDirection: "column" as const,
        gap: "14px",
    },
    logo: {
        margin: 0,
        textAlign: "center" as const,
    },
    subtitle: {
        textAlign: "center" as const,
        color: "#636e72",
        marginBottom: "12px",
    },
    input: {
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #dfe6e9",
        fontSize: "14px",
    },
    button: {
        marginTop: "10px",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#6c5ce7",
        color: "#fff",
        fontWeight: "bold" as const,
        cursor: "pointer",
    },
};


export default Login;
