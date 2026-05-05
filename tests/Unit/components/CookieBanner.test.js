import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import CookieBanner from '@/components/layout/CookieBanner.vue'

vi.mock('@/composables/useCookieConsent', () => ({
    useCookieConsent: () => ({
        needsBanner:     () => true,
        acceptAll:       vi.fn(),
        acceptEssential: vi.fn(),
    }),
}))

describe('CookieBanner', () => {
    it('renders after mount delay', async () => {
        vi.useFakeTimers()
        const wrapper = mount(CookieBanner)

        // Banner not shown immediately
        expect(wrapper.find('[data-testid="cookie-banner"]').exists()).toBe(false)

        vi.advanceTimersByTime(1200)
        await flushPromises()
        await wrapper.vm.$nextTick()

        expect(wrapper.find('[data-testid="cookie-banner"]').exists()).toBe(true)
        vi.useRealTimers()
    })

    it('hides after clicking Accept all', async () => {
        vi.useFakeTimers()
        const wrapper = mount(CookieBanner)
        vi.advanceTimersByTime(1200)
        await flushPromises()
        await wrapper.vm.$nextTick()

        await wrapper.find('[data-testid="accept-cookies"]').trigger('click')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('[data-testid="cookie-banner"]').exists()).toBe(false)
        vi.useRealTimers()
    })

    it('hides after clicking Just essentials', async () => {
        vi.useFakeTimers()
        const wrapper = mount(CookieBanner)
        vi.advanceTimersByTime(1200)
        await flushPromises()
        await wrapper.vm.$nextTick()

        await wrapper.find('[data-testid="essential-cookies"]').trigger('click')
        await wrapper.vm.$nextTick()

        expect(wrapper.find('[data-testid="cookie-banner"]').exists()).toBe(false)
        vi.useRealTimers()
    })

    it('emits show-privacy when privacy link is clicked', async () => {
        vi.useFakeTimers()
        const wrapper = mount(CookieBanner)
        vi.advanceTimersByTime(1200)
        await flushPromises()
        await wrapper.vm.$nextTick()

        await wrapper.find('.privacy-link').trigger('click')
        expect(wrapper.emitted('show-privacy')).toBeTruthy()
        vi.useRealTimers()
    })
})
