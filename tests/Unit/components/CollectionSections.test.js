import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import MixesSection from '@/components/sections/MixesSection.vue'
import ReleasesSection from '@/components/sections/ReleasesSection.vue'

const v2Mix = (n) => ({
    id: n,
    title: `Mix ${n} full`,
    short_name: `Mix ${n}`,
    key: `/djfabrizia/mix-${n}/`,
    image: `https://img.test/${n}.jpg`,
    image_small: `https://img.test/${n}s.jpg`,
    released_at: '2026-02-04T18:27:23+00:00',
    duration: '60:10',
    genres: [{ name: 'House', slug: 'house' }],
})

const v2Release = (n) => ({
    id: n,
    title: `Release ${n}`,
    cover: { url: `https://img.test/r${n}.jpg` },
    track: null,
    duration: '3:27',
    bpm: '122bpm',
    year: 2022,
    record_label: null,
    genres: [],
    links: [{ platform: 'spotify', url: `https://open.spotify.com/${n}` }],
})

const okJson = (body) => ({ ok: true, json: () => Promise.resolve(body) })

const firstMixPage = {
    tracks: [{ name: 'Mix 1', url: '/djfabrizia/mix-1/', img: '', date: '2026 02 04', tags: [] }],
    currentPage: 1,
    totalPages: 3,
    hasMore: true,
}

describe.each([
    {
        name: 'MixesSection',
        component: MixesSection,
        path: '/collections/mixes',
        item: v2Mix,
        card: '.mix-card',
        title: '.mix-title',
        firstPage: firstMixPage,
        expectedTitle: (n) => `Mix ${n}`,
    },
    {
        name: 'ReleasesSection',
        component: ReleasesSection,
        path: '/collections/releases',
        item: v2Release,
        card: '.rel-card',
        title: '.rel-title',
        firstPage: {
            tracks: [{ title: 'Release 1', img: '', year: '2022' }],
            currentPage: 1,
            totalPages: 3,
            hasMore: true,
        },
        expectedTitle: (n) => `Release ${n}`,
    },
])('$name', ({ component, path, item, card, title, firstPage, expectedTitle }) => {
    it('renders the first page from the prop without any request', async () => {
        global.fetch = vi.fn()

        const wrapper = mount(component, { props: { initialPage: firstPage } })
        await flushPromises()

        expect(global.fetch).not.toHaveBeenCalled()
        expect(wrapper.findAll(card)).toHaveLength(1)
        expect(wrapper.find(title).text()).toBe(expectedTitle(1))
        expect(wrapper.find('.page-count').text()).toBe('1 / 3')
    })

    it('falls back to fetching page 1 when no first page is passed', async () => {
        global.fetch = vi
            .fn()
            .mockResolvedValueOnce(
                okJson({ data: [item(1), item(2)], meta: { current_page: 1, last_page: 1 } }),
            )

        const wrapper = mount(component)
        await flushPromises()

        expect(global.fetch).toHaveBeenCalledOnce()
        const url = new URL(global.fetch.mock.calls[0][0])
        expect(url.pathname).toMatch(new RegExp(`/api/v2${path}$`))
        expect(url.searchParams.has('page')).toBe(false)
        expect(url.searchParams.has('per_page')).toBe(false)
        expect(wrapper.findAll(card)).toHaveLength(2)
        expect(wrapper.find('.load-more-btn').exists()).toBe(false)
    })

    it('appends the next page on load more', async () => {
        global.fetch = vi
            .fn()
            .mockResolvedValueOnce(
                okJson({ data: [item(2)], meta: { current_page: 2, last_page: 2 } }),
            )

        const wrapper = mount(component, { props: { initialPage: firstPage } })
        await wrapper.find('.load-more-btn').trigger('click')
        await flushPromises()

        expect(global.fetch).toHaveBeenCalledOnce()
        const url = new URL(global.fetch.mock.calls[0][0])
        expect(url.pathname).toMatch(new RegExp(`${path}$`))
        expect(url.searchParams.get('page')).toBe('2')
        const titles = wrapper.findAll(title).map((t) => t.text())
        expect(titles).toEqual([expectedTitle(1), expectedTitle(2)])
        expect(wrapper.find('.load-more-btn').exists()).toBe(false)
    })

    it('keeps the current items when load more fails', async () => {
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 500 })

        const wrapper = mount(component, { props: { initialPage: firstPage } })
        await wrapper.find('.load-more-btn').trigger('click')
        await flushPromises()

        expect(wrapper.findAll(card)).toHaveLength(1)
        expect(wrapper.find('.load-more-btn').exists()).toBe(true)
        expect(errorSpy).toHaveBeenCalled()
        errorSpy.mockRestore()
    })

    it('retries the same page after a failed load more', async () => {
        // Arrange
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        global.fetch = vi
            .fn()
            .mockResolvedValueOnce({ ok: false, status: 500 })
            .mockResolvedValueOnce(
                okJson({ data: [item(2)], meta: { current_page: 2, last_page: 3 } }),
            )
        const wrapper = mount(component, { props: { initialPage: firstPage } })

        // Act
        await wrapper.find('.load-more-btn').trigger('click')
        await flushPromises()
        await wrapper.find('.load-more-btn').trigger('click')
        await flushPromises()

        // Assert
        const pages = global.fetch.mock.calls.map(([u]) => new URL(u).searchParams.get('page'))
        expect(pages).toEqual(['2', '2'])
        expect(wrapper.findAll(title).map((t) => t.text())).toEqual([
            expectedTitle(1),
            expectedTitle(2),
        ])
        expect(wrapper.find('.page-count').text()).toBe('2 / 3')
        errorSpy.mockRestore()
    })

    it('requests page 2 on load more after the page-1 fallback', async () => {
        // Arrange
        global.fetch = vi
            .fn()
            .mockResolvedValueOnce(
                okJson({ data: [item(1)], meta: { current_page: 1, last_page: 2 } }),
            )
            .mockResolvedValueOnce(
                okJson({ data: [item(2)], meta: { current_page: 2, last_page: 2 } }),
            )
        const wrapper = mount(component)
        await flushPromises()

        // Act
        await wrapper.find('.load-more-btn').trigger('click')
        await flushPromises()

        // Assert
        expect(global.fetch).toHaveBeenCalledTimes(2)
        expect(new URL(global.fetch.mock.calls[1][0]).searchParams.get('page')).toBe('2')
        expect(wrapper.findAll(card)).toHaveLength(2)
    })

    it('disables the button while a load more is in flight', async () => {
        // Arrange
        let resolve
        global.fetch = vi.fn(() => new Promise((r) => (resolve = r)))
        const wrapper = mount(component, { props: { initialPage: firstPage } })

        // Act
        await wrapper.find('.load-more-btn').trigger('click')

        // Assert
        expect(wrapper.find('.load-more-btn').attributes('disabled')).toBeDefined()
        await wrapper.find('.load-more-btn').trigger('click')
        expect(global.fetch).toHaveBeenCalledOnce()
        resolve(okJson({ data: [], meta: { current_page: 2, last_page: 3 } }))
        await flushPromises()
    })
})
