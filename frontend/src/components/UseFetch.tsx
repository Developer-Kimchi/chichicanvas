import {useEffect, useState} from "react";
import {fetchWithCookie} from "./Client.tsx";

export function useFetch<T>(url: string) {
    const [data, setData] = useState<T | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        let mounted = true;
        setLoading(true);

        fetchWithCookie(url)
            .then((res) => mounted && setData(res))
            .catch((err) => mounted && setError(err))
            .finally(() => mounted && setLoading(false));

        return () => {mounted = false;};
    }, [url]);

    return {data, loading, error};

}