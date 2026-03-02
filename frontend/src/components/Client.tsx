export async function fetchWithCookie(url: string, options: RequestInit = {}) {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;

    let res = await fetch(url, { ...options, credentials: "include" });

    if (res.status === 401) {
        const refresh = await fetch(`${BASE_URL}/user/refresh`, {
            method: "POST",
            credentials: "include"
        });

        if (!refresh.ok) {
            window.location.href = "/login";
            return null;
        }

        res = await fetch(url, { ...options, credentials: "include" });
    }

    if (!res.ok) return null;  // 이 줄 추가

    return res.json();
}