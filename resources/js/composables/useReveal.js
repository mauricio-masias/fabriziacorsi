import { onMounted, onUnmounted } from 'vue'

export function useReveal(elRef, options = {}) {
    let observer

    onMounted(() => {
        const el = elRef.value
        if (!el) return

        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    el.classList.add('visible')
                    observer.disconnect()
                }
            },
            { threshold: options.threshold ?? 0.08, ...options },
        )
        observer.observe(el)
    })

    onUnmounted(() => observer?.disconnect())
}

export function useLazyLoad(elRef, callback, options = {}) {
    let observer
    let triggered = false

    onMounted(() => {
        const el = elRef.value
        if (!el) return

        observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !triggered) {
                    triggered = true
                    callback()
                    observer.disconnect()
                }
            },
            {
                threshold: options.threshold ?? 0.05,
                rootMargin: options.rootMargin ?? '200px',
                ...options,
            },
        )
        observer.observe(el)
    })

    onUnmounted(() => observer?.disconnect())
}
