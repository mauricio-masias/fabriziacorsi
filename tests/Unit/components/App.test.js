import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import App from '@/App.vue'

const v2Mix = (n) => ({
    title: `Mix ${n} full`,
    short_name: `Mix ${n}`,
    key: `/djfabrizia/mix-${n}/`,
    image: `https://img.test/${n}.jpg`,
    released_at: '2026-02-04T18:27:23+00:00',
    duration: '60:10',
    genres: [],
})

const v2Release = (n) => ({
    title: `Release ${n}`,
    cover: { url: `https://img.test/r${n}.jpg` },
    year: 2022,
    links: [],
})

const feed = (collection, items) => ({
    type: 'collection_feed',
    data: {
        collection,
        first_page: { data: items, meta: { current_page: 1, last_page: 2 } },
    },
})

const homeBlocks = [
    { type: 'hero_rotator', data: { styles: ['House', 'Techno'] } },
    { type: 'rich_two_column', data: { title: 'About me', left: '<p>L</p>', right: '<p>R</p>' } },
    feed('mixes', [v2Mix(1), v2Mix(2)]),
    feed('releases', [v2Release(1)]),
    { type: 'booking', data: { title: 'Contact', left: '', right: null, success: '' } },
]

const bioBody = {
    data: {
        blocks: [
            { type: 'rich_two_column', data: { title: 'Bio', left: '<p>B</p>', right: '' } },
            { type: 'venues_uk', data: { venues: ['Cargo'] } },
            { type: 'venues_international', data: { countries: [] } },
        ],
    },
}

const collectionBody = (items) => ({ data: items, meta: { current_page: 1, last_page: 1 } })

// Route fetch by path so the test does not depend on call order.
const routeFetch = (routes) =>
    vi.fn((url) => {
        const { pathname } = new URL(url)
        const key = Object.keys(routes).find((p) => pathname.endsWith(p))
        if (!key) return Promise.resolve({ ok: false, status: 404 })
        return Promise.resolve({ ok: true, json: () => Promise.resolve(routes[key]) })
    })

const requestedPaths = () => global.fetch.mock.calls.map(([url]) => new URL(url).pathname)

describe('App', () => {
    it('makes exactly two requests and renders the embedded first pages', async () => {
        // Arrange
        global.fetch = routeFetch({
            '/pages/home': { data: { slug: 'home', blocks: homeBlocks } },
            '/pages/bio': bioBody,
        })

        // Act
        const wrapper = mount(App)
        await flushPromises()

        // Assert
        expect(requestedPaths()).toEqual(['/api/v2/pages/home', '/api/v2/pages/bio'])
        expect(wrapper.findAll('#mixes .mix-card')).toHaveLength(2)
        expect(wrapper.findAll('#releases .rel-card')).toHaveLength(1)
        expect(wrapper.find('#mixes .page-count').text()).toBe('1 / 2')
        wrapper.unmount()
    })

    it('falls back to fetching page 1 of each collection when home has no feed blocks', async () => {
        // Arrange
        const withoutFeeds = homeBlocks.filter((b) => b.type !== 'collection_feed')
        global.fetch = routeFetch({
            '/pages/home': { data: { slug: 'home', blocks: withoutFeeds } },
            '/pages/bio': bioBody,
            '/collections/mixes': collectionBody([v2Mix(7)]),
            '/collections/releases': collectionBody([v2Release(7), v2Release(8)]),
        })

        // Act
        const wrapper = mount(App)
        await flushPromises()

        // Assert
        expect(requestedPaths()).toEqual(
            expect.arrayContaining(['/api/v2/collections/mixes', '/api/v2/collections/releases']),
        )
        expect(global.fetch).toHaveBeenCalledTimes(4)
        expect(wrapper.findAll('#mixes .mix-card')).toHaveLength(1)
        expect(wrapper.findAll('#releases .rel-card')).toHaveLength(2)
        wrapper.unmount()
    })

    it('still renders the page and loads collections when /pages/home fails', async () => {
        // Arrange
        const errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
        global.fetch = routeFetch({
            '/pages/bio': bioBody,
            '/collections/mixes': collectionBody([v2Mix(1)]),
            '/collections/releases': collectionBody([]),
        })

        // Act
        const wrapper = mount(App)
        await flushPromises()

        // Assert
        expect(wrapper.find('#hero').exists()).toBe(true)
        expect(wrapper.findAll('#mixes .mix-card')).toHaveLength(1)
        expect(errorSpy).toHaveBeenCalledWith('Homepage load failed', expect.any(Error))
        errorSpy.mockRestore()
        wrapper.unmount()
    })
})
