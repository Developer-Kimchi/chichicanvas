import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Login() {

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();
    const [id, setId] = useState("");
    const [pw, setPw] = useState("");
    const [loading, setLoading] = useState(false);

    const handleLogin = async () => {
        // 🔒 입력값 검증
        if (!id.trim()) {
            alert("아이디를 입력하세요");
            return;
        }

        if (!pw.trim()) {
            alert("비밀번호를 입력하세요");
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${BASE_URL}/user/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include", // 쿠키 기반 인증
                body: JSON.stringify({
                    username: id,
                    password: pw,
                }),
            });

            if (!res.ok) {
                throw new Error("login failed");
            }

            navigate("/rooms");
        } catch (e) {
            alert("아이디 또는 비밀번호가 올바르지 않습니다");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.bg}>
            <form
                style={styles.card}
                onSubmit={(e) => {
                    e.preventDefault();   // 새로고침 방지
                    handleLogin();
                }}
            >
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
                    type="submit"   // 중요
                    disabled={loading}
                >
                    {loading ? "로그인 중..." : "로그인"}
                </button>

                <button
                    type="button"   // submit 방지
                    style={styles.subButton}
                    onClick={() => navigate("/signup")}
                >
                    회원가입
                </button>
            </form>
        </div>
    );
}

const styles = {
    bg: {
        position: "fixed",
        inset: 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(135deg, #6c5ce7, #0984e3, #00cec9)",
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
    subButton: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #6c5ce7",
        background: "#fff",
        color: "#6c5ce7",
        fontWeight: "bold" as const,
        cursor: "pointer",
    },
};

export default Login;
