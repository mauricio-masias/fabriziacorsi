import { describe, it, expect, vi } from 'vitest'
import { mount, flushPromises } from '@vue/test-utils'
import PrivacyPage from '@/components/privacy/PrivacyPage.vue'

describe('PrivacyPage', () => {
    it('renders the legal_content html from /pages/privacy-policy', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({
            ok: true,
            json: () =>
                Promise.resolve({
                    data: {
                        blocks: [{ type: 'legal_content', data: { html: '<h2>Cookies</h2>' } }],
                    },
                }),
        })

        const wrapper = mount(PrivacyPage)
        await flushPromises()

        expect(global.fetch.mock.calls[0][0]).toContain('/api/v2/pages/privacy-policy')
        expect(wrapper.find('.privacy-content').html()).toContain('<h2>Cookies</h2>')
        wrapper.unmount()
    })

    it('closes on Escape while the policy is still loading', async () => {
        // Arrange: a request that never settles
        global.fetch = vi.fn(() => new Promise(() => {}))
        const wrapper = mount(PrivacyPage)

        // Act
        window.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }))

        // Assert
        expect(wrapper.emitted('close')).toHaveLength(1)
        wrapper.unmount()
    })

    it('shows the fallback message when the request fails', async () => {
        global.fetch = vi.fn().mockResolvedValueOnce({ ok: false, status: 500 })

        const wrapper = mount(PrivacyPage)
        await flushPromises()

        expect(wrapper.find('.privacy-content').text()).toBe('Privacy policy could not be loaded.')
        wrapper.unmount()
    })
})
