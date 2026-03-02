import { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { fetchWithCookie } from "./Client.tsx";

function RequireAuth() {
    const BASE_URL = import.meta.env.VITE_API_BASE_URL;
    const navigate = useNavigate();
    const [ok, setOk] = useState<boolean | null>(null);

    useEffect(() => {
        fetchWithCookie(`${BASE_URL}/user/me`)
            .then(() => setOk(true))
            .catch(() => setOk(false));
    }, []);

    if (ok === null) return <div>로딩중...</div>;

    if (ok === false) {
        navigate("/login");
        return null;
    }

    return <Outlet />;
}

export default RequireAuth;