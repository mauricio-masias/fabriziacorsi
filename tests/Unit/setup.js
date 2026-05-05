import { vi, beforeEach } from 'vitest'

// ─── fetch mock ──────────────────────────────────────────────────
global.fetch = vi.fn()

// ─── IntersectionObserver mock ───────────────────────────────────
global.IntersectionObserver = vi.fn((callback) => ({
    observe:    vi.fn((el) => callback([{ isIntersecting: true, target: el }])),
    unobserve:  vi.fn(),
    disconnect: vi.fn(),
}))

// ─── localStorage mock ───────────────────────────────────────────
const makeStorage = () => {
    let store = {}
    return {
        getItem:    (k)    => store[k] ?? null,
        setItem:    (k, v) => { store[k] = String(v) },
        removeItem: (k)    => { delete store[k] },
        clear:      ()     => { store = {} },
    }
}

Object.defineProperty(window, 'localStorage', {
    value: makeStorage(),
    writable: true,
})

// Clear localStorage before each test
beforeEach(() => {
    window.localStorage.clear()
    vi.clearAllMocks()
})
