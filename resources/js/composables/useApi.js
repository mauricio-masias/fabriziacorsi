import { API_BASE } from '@/config/api'

/**
 * Read the RFC 9457 `detail` from an error response. Never throws: a body that
 * is missing or not JSON simply yields an empty string.
 * @param {Response} res
 * @returns {Promise<string>}
 */
const readProblemDetail = async (res) => {
    try {
        const body = await res.json()
        return typeof body?.detail === 'string' ? body.detail : ''
    } catch {
        return ''
    }
}

/**
 * Thin client for the external DJ API.
 * @returns {{ fetchEndpoint: (path: string, params?: Record<string, string | number>) => Promise<any> }}
 */
export function useApi() {
    const fetchEndpoint = async (path, params = {}) => {
        const url = new URL(`${API_BASE}${path}`)
        Object.entries(params).forEach(([k, v]) => url.searchParams.set(k, v))
        const res = await fetch(url.toString())
        if (!res.ok) {
            const detail = await readProblemDetail(res)
            throw new Error(`API ${res.status}: ${path}${detail ? ` - ${detail}` : ''}`)
        }
        return res.json()
    }

    return { fetchEndpoint }
}
