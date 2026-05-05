import { describe, it, expect, vi } from 'vitest'
import { mount } from '@vue/test-utils'
import MixCard from '@/components/mixes/MixCard.vue'

const mockMix = {
    name:         'Melodic Techno Demo',
    url:          '/djfabrizia/melodic-techno-demo-mix-fabrizia-corsi/',
    img:          'https://thumbnailer.mixcloud.com/unsafe/320x320/extaudio/test',
    img_small:    'https://thumbnailer.mixcloud.com/unsafe/50x50/extaudio/test',
    date:         '2026 02 04',
    audio_length: '60:10',
    tags:         ['Melodic techno', 'Progressive house'],
}

describe('MixCard', () => {
    it('renders mix title', () => {
        const wrapper = mount(MixCard, { props: { mix: mockMix } })
        expect(wrapper.find('.mix-title').text()).toBe('Melodic Techno Demo')
    })

    it('renders mix tags', () => {
        const wrapper = mount(MixCard, { props: { mix: mockMix } })
        const tags = wrapper.findAll('.tag-pill')
        expect(tags.length).toBeGreaterThan(0)
        expect(tags[0].text()).toContain('Melodic techno')
    })

    it('formats date correctly', () => {
        const wrapper = mount(MixCard, { props: { mix: mockMix } })
        expect(wrapper.find('.mix-date').text()).toBe('Feb 2026')
    })

    it('formats duration correctly — 60min becomes 1h', () => {
        const wrapper = mount(MixCard, { props: { mix: mockMix } })
        // 60:10 = 1h 0m (component converts 60+ minutes to hours)
        expect(wrapper.find('.mix-dur').text()).toBe('1h 0m')
    })

    it('has correct aria-label', () => {
        const wrapper = mount(MixCard, { props: { mix: mockMix } })
        expect(wrapper.find('article').attributes('aria-label')).toContain('Melodic Techno Demo')
    })

    it('opens Mixcloud on click (desktop)', async () => {
        const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null)
        vi.stubGlobal('navigator', { userAgent: 'Mozilla/5.0 (Macintosh)' })

        const wrapper = mount(MixCard, { props: { mix: mockMix } })
        await wrapper.find('article').trigger('click')

        expect(openSpy).toHaveBeenCalledWith(
            'https://www.mixcloud.com/djfabrizia/melodic-techno-demo-mix-fabrizia-corsi/',
            '_blank',
            'noopener,noreferrer'
        )
        openSpy.mockRestore()
    })
})
