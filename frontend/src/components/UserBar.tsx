import { useEffect, useState } from "react";
import { fetchWithCookie } from "./Client.tsx";

type User = {
    userNickname: string;
    username?: string;
};

function UserBar() {

    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    const [user, setUser] = useState<User | null>(null);

    useEffect(() => {
        fetchWithCookie(`${BASE_URL}/user/me`, {
            method: "GET",
            credentials: "include"
        })
            .then(res => setUser(res))
            .catch(() => setUser(null));
    }, []);

    const logout = async () => {
        await fetch(`${BASE_URL}/user/signout`, {
            method: "POST",
            credentials: "include"
        });

        window.location.href = "/login";
    };

    return (
        <div style={styles.bar}>
            <div>
                {user ? (
                    <span>
                        👤 {user.userNickname ?? user.username}
                    </span>
                ) : (
                    <span>로그인 안 됨</span>
                )}
            </div>

            <button style={styles.button} onClick={logout}>
                로그아웃
            </button>
        </div>
    );
}

const styles = {
    bar: {
        height: "60px",
        background: "#fff",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 24px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
        boxSizing: "border-box" as const,
    },
    button: {
        padding: "8px 14px",
        borderRadius: "8px",
        border: "none",
        background: "#d63031",
        color: "#fff",
        fontWeight: "bold" as const,
        cursor: "pointer",
    }
};

export default UserBar;