import { API_BASE } from '@/config/api'

export function useApi() {
    const fetchEndpoint = async (path, params = {}) => {
        const url = new URL(`${API_BASE}${path}`)
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
        const res = await fetch(url.toString())
        if (!res.ok) throw new Error(`API ${res.status}: ${path}`)
        return res.json()
    }

    return { fetchEndpoint }
}
