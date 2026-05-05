import { describe, it, expect, vi, beforeEach } from 'vitest'
import { useApi } from '@/composables/useApi'

describe('useApi', () => {
    beforeEach(() => vi.clearAllMocks())

    it('fetches an endpoint and returns JSON', async () => {
        const mockData = [{ music_styles: ['House', 'Techno'] }]
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve(mockData),
        })

        const { fetchEndpoint } = useApi()
        const result = await fetchEndpoint('/homepage')

        expect(result).toEqual(mockData)
        expect(global.fetch).toHaveBeenCalledOnce()
        expect(global.fetch.mock.calls[0][0]).toContain('/homepage')
    })

    it('appends query params when provided', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () => Promise.resolve([]),
        })

        const { fetchEndpoint } = useApi()
        await fetchEndpoint('/mixes', { page: 2 })

        const calledUrl = global.fetch.mock.calls[0][0]
        expect(calledUrl).toContain('page=2')
    })

    it('throws on non-ok response', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 404 })

        const { fetchEndpoint } = useApi()
        await expect(fetchEndpoint('/missing')).rejects.toThrow('404')
    })

    it('throws on network error', async () => {
        global.fetch = vi.fn().mockRejectedValueOnce(new Error('Network error'))

        const { fetchEndpoint } = useApi()
        await expect(fetchEndpoint('/homepage')).rejects.toThrow('Network error')
    })
})
