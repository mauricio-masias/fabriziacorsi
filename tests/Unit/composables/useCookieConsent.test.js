import { describe, it, expect, beforeEach } from 'vitest'
import { useCookieConsent } from '@/composables/useCookieConsent'

describe('useCookieConsent', () => {
    beforeEach(() => {
        window.localStorage.clear()
    })

    it('needsBanner returns true when no consent stored', () => {
        const { needsBanner } = useCookieConsent()
        expect(needsBanner()).toBe(true)
    })

    it('acceptAll stores "all" in localStorage', () => {
        const { acceptAll, hasConsent } = useCookieConsent()
        acceptAll()
        expect(window.localStorage.getItem('fc_cookie_consent')).toBe('all')
        expect(hasConsent.value).toBe('all')
    })

    it('acceptEssential stores "essential" in localStorage', () => {
        const { acceptEssential, hasConsent } = useCookieConsent()
        acceptEssential()
        expect(window.localStorage.getItem('fc_cookie_consent')).toBe('essential')
        expect(hasConsent.value).toBe('essential')
    })

    it('needsBanner returns false after consent given', () => {
        const { acceptEssential, needsBanner } = useCookieConsent()
        acceptEssential()
        expect(needsBanner()).toBe(false)
    })
})
