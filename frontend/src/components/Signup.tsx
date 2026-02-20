import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Signup() {

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const navigate = useNavigate();

    const [id, setId] = useState("");
    const [nickname, setNickname] = useState("");
    const [pw, setPw] = useState("");
    const [pwConfirm, setPwConfirm] = useState("");

    const [isIdChecked, setIsIdChecked] = useState(false);
    const [isNicknameChecked, setIsNicknameChecked] = useState(false);

    const [idMessage, setIdMessage] = useState("");
    const [isIdValid, setIsIdValid] = useState(false);

    const [nicknameMessage, setNicknameMessage] = useState("");
    const [isNicknameValid, setIsNicknameValid] = useState(false);

    const [pwMessage, setPwMessage] = useState("");
    const [isPwValid, setIsPwValid] = useState(false);

    const isPasswordMismatch = pwConfirm.length > 0 && pw !== pwConfirm;

    /* ---------- validation ---------- */

    const validateId = (value: string) => {
        const regex = /^(?=[a-z][a-z0-9]{3,19}$)(?=.*[0-9])/;

        if (!value) {
            setIdMessage("");
            setIsIdValid(false);
            return;
        }

        if (!regex.test(value)) {
            setIdMessage(
                "아이디는 4~20자, 소문자로 시작하며 영문+숫자 조합 + 숫자 최소 1개 포함"
            );
            setIsIdValid(false);
            return;
        }

        setIdMessage("사용 가능한 아이디 형식입니다.");
        setIsIdValid(true);
    };

    const validateNickname = (value: string) => {
        const regex = /^[a-zA-Z0-9가-힣]{2,10}$/;

        if (!value) {
            setNicknameMessage("");
            setIsNicknameValid(false);
            return;
        }

        if (!regex.test(value)) {
            setNicknameMessage("닉네임은 2~10자의 한글/영문/숫자만 가능");
            setIsNicknameValid(false);
            return;
        }

        setNicknameMessage("사용 가능한 닉네임 형식입니다.");
        setIsNicknameValid(true);
    };

    const validatePassword = (value: string) => {
        const regex =
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,20}$/;

        if (!value) {
            setPwMessage("");
            setIsPwValid(false);
            return;
        }

        if (!regex.test(value)) {
            setPwMessage("비밀번호는 8~20자, 영문/숫자/특수문자 포함");
            setIsPwValid(false);
            return;
        }

        setPwMessage("안전한 비밀번호입니다.");
        setIsPwValid(true);
    };

    /* ---------- submit 가능 여부 ---------- */

    const canSubmit =
        isIdValid &&
        isIdChecked &&
        isNicknameValid &&
        isNicknameChecked &&
        isPwValid &&
        !isPasswordMismatch;

    /* ---------- API ---------- */

    const handleIdCheck = async () => {
        if (!isIdValid) return;

        try {
            const res = await fetch(`${BASE_URL}/user/checkUserId`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ username: id }),
            });

            const available: boolean = await res.json();

            if (!available) {
                setIsIdChecked(true);
                setIdMessage("사용 가능한 아이디입니다.");
            } else {
                setIsIdChecked(false);
                setIdMessage("이미 사용 중인 아이디입니다.");
                setIsIdValid(false);
            }
        } catch {
            alert("아이디 확인 중 오류");
        }
    };

    const handleNicknameCheck = async () => {
        if (!isNicknameValid) return;

        try {
            const res = await fetch(`${BASE_URL}/user/checkNickname`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ nickname }),
            });

            const available: boolean = await res.json();

            if (!available) {
                setIsNicknameChecked(true);
                setNicknameMessage("사용 가능한 닉네임입니다.");
            } else {
                setIsNicknameChecked(false);
                setNicknameMessage("이미 사용 중인 닉네임입니다.");
                setIsNicknameValid(false);
            }
        } catch {
            alert("닉네임 확인 중 오류");
        }
    };

    const handleSignup = async () => {
        if (!canSubmit) {
            alert("입력값 또는 중복 확인 필요");
            return;
        }

        try {
            const res = await fetch(`${BASE_URL}/user/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: id,
                    password: pw,
                    nickname: nickname,
                }),
            });

            if (!res.ok) {
                alert("회원가입 실패");
                return;
            }

            alert("회원가입 완료");
            navigate("/");
        } catch {
            alert("서버 오류");
        }
    };

    /* ---------- render ---------- */

    return (
        <div style={styles.bg}>
            <form
                style={styles.card}
                onSubmit={(e) => {
                    e.preventDefault();
                    handleSignup();
                }}
            >
                <h1 style={styles.logo}>🎨 Chichi Canvas</h1>
                <p style={styles.subtitle}>회원가입</p>

                <div style={styles.row}>
                    <input
                        style={styles.input}
                        placeholder="아이디"
                        value={id}
                        onChange={(e) => {
                            const v = e.target.value;
                            setId(v);
                            validateId(v);
                            setIsIdChecked(false);
                        }}
                    />
                    <button
                        type="button"
                        style={styles.checkButton}
                        disabled={!isIdValid}
                        onClick={handleIdCheck}
                    >
                        중복확인
                    </button>
                </div>

                {idMessage && (
                    <p
                        style={{
                            ...styles.message,
                            color: isIdValid ? "green" : "red",
                        }}
                    >
                        {idMessage}
                    </p>
                )}


                <div style={styles.row}>
                    <input
                        style={styles.input}
                        placeholder="닉네임"
                        value={nickname}
                        onChange={(e) => {
                            const v = e.target.value;
                            setNickname(v);
                            validateNickname(v);
                            setIsNicknameChecked(false);
                        }}
                    />
                    <button
                        type="button"
                        style={styles.checkButton}
                        disabled={!isNicknameValid}
                        onClick={handleNicknameCheck}
                    >
                        중복확인
                    </button>
                </div>

                {nicknameMessage && (
                    <p
                        style={{
                            ...styles.message,
                            color: isNicknameValid ? "green" : "red",
                        }}
                    >
                        {nicknameMessage}
                    </p>
                )}


                <input
                    style={styles.input}
                    type="password"
                    placeholder="비밀번호"
                    value={pw}
                    onChange={(e) => {
                        const v = e.target.value;
                        setPw(v);
                        validatePassword(v);
                    }}
                />

                {pwMessage && (
                    <p
                        style={{
                            ...styles.message,
                            color: isPwValid ? "green" : "red",
                        }}
                    >
                        {pwMessage}
                    </p>
                )}


                <input
                    style={styles.input}
                    type="password"
                    placeholder="비밀번호 확인"
                    value={pwConfirm}
                    onChange={(e) => setPwConfirm(e.target.value)}
                />

                {isPasswordMismatch && (
                    <p style={{ ...styles.message, color: "red" }}>
                        비밀번호가 일치하지 않습니다.
                    </p>
                )}


                <button
                    type="submit"
                    style={styles.button}
                >
                    회원가입
                </button>


                <button
                    type="button"
                    style={styles.subButton}
                    onClick={() => navigate("/")}
                >
                    로그인으로 돌아가기
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
        display: "flex",
        flexDirection: "column" as const,
        gap: "14px",
    },
    row: {
        display: "flex",
        gap: "8px",
    },
    logo: { textAlign: "center" as const },
    subtitle: { textAlign: "center" as const },
    input: {
        flex: 1,
        padding: "12px",
        borderRadius: "8px",
        border: "1px solid #dfe6e9",
    },
    checkButton: {
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#0984e3",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",          // 기본 상태
        whiteSpace: "nowrap",
    },
    button: {
        marginTop: "10px",
        padding: "12px",
        borderRadius: "8px",
        border: "none",
        background: "#6c5ce7",
        color: "#fff",
        fontWeight: "bold",
        cursor: "pointer",     // ← 이거 추가
    },
    subButton: {
        padding: "10px",
        borderRadius: "8px",
        border: "1px solid #6c5ce7",
        background: "#fff",
        color: "#6c5ce7",
        fontWeight: "bold",
        cursor: "pointer",     // ← 이것도 추가
    },

    message: {
        fontSize: "12px",
        margin: "2px 0 4px 0",   // ← 핵심
    },
};

export default Signup;
