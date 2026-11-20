import { afterEach, describe, expect, it, vi } from 'vitest'
import { printSignature, signatureMessage } from '@/lib/signature'

describe('signature', () => {
    afterEach(() => vi.restoreAllMocks())

    it('uses one style per %c marker', () => {
        const [text, ...styles] = signatureMessage()

        expect(text.match(/%c/g)).toHaveLength(styles.length)
        expect(text).toContain('DJ Fabrizia Corsi')
        expect(text).toContain('https://masias.co.uk')
    })

    it('prints the signature to the console once', () => {
        const log = vi.spyOn(console, 'log').mockImplementation(() => {})

        printSignature()

        expect(log).toHaveBeenCalledOnce()
        expect(log).toHaveBeenCalledWith(...signatureMessage())
    })
})
