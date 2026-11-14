import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '@/composables/useApi'

describe('useApi', () => {
    beforeEach(() => vi.clearAllMocks())

    it('fetches an endpoint and returns JSON', async () => {
        const mockData = { data: { slug: 'home', blocks: [] } }
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        })

        const { fetchEndpoint } = useApi()
        const result = await fetchEndpoint('/pages/home')

        expect(result).toEqual(mockData)
        expect(global.fetch).toHaveBeenCalledOnce()
        expect(global.fetch.mock.calls[0][0]).toContain('/pages/home')
    })

    it('appends query params when provided', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([]),
        })

        const { fetchEndpoint } = useApi()
        await fetchEndpoint('/collections/mixes', { page: 2 })

        const calledUrl = global.fetch.mock.calls[0][0]
        expect(calledUrl).toContain('page=2')
    })

    it('throws on non-ok response', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 404 })

        const { fetchEndpoint } = useApi()
        await expect(fetchEndpoint('/missing')).rejects.toThrow('404')
    })

    it('includes the problem-details detail and status in the error', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            status: 422,
            json: () =>
                Promise.resolve({
                    type: 'about:blank',
                    title: 'Unprocessable',
                    status: 422,
                    detail: 'The page must be between 1 and 1000.',
                }),
        })

        const { fetchEndpoint } = useApi()
        const err = await fetchEndpoint('/collections/mixes', { page: 0 }).catch((e) => e)

        expect(err).toBeInstanceOf(Error)
        expect(err.message).toContain('422')
        expect(err.message).toContain('The page must be between 1 and 1000.')
    })

    it('keeps the HTTP error when the error body is not JSON', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            status: 500,
            json: () => Promise.reject(new SyntaxError('Unexpected token <')),
        })

        const { fetchEndpoint } = useApi()
        const err = await fetchEndpoint('/pages/home').catch((e) => e)

        expect(err.message).toContain('500')
        expect(err.message).toContain('/pages/home')
        expect(err.message).not.toContain('Unexpected token')
    })

    it('ignores a non-string detail', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: false,
            status: 503,
            json: () => Promise.resolve({ detail: { nested: true } }),
        })

        const { fetchEndpoint } = useApi()
        await expect(fetchEndpoint('/pages/bio')).rejects.toThrow('API 503: /pages/bio')
    })

    it('targets the v2 API by default', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: true, json: () => Promise.resolve({}) })

        const { fetchEndpoint } = useApi()
        await fetchEndpoint('/pages/home')

        expect(global.fetch.mock.calls[0][0]).toContain('/api/v2/pages/home')
    })

    it('throws on network error', async () => {
        global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

        const { fetchEndpoint } = useApi()
        await expect(fetchEndpoint('/pages/home')).rejects.toThrow('Network error')
    })
})
