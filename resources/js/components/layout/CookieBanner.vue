<script setup>
    import { ref, onMounted } from 'vue'
    import { useCookieConsent } from '@/composables/useCookieConsent'

    const emit = defineEmits(['show-privacy'])

    const { needsBanner, acceptAll, acceptEssential } = useCookieConsent()
    const visible = ref(false)

    onMounted(() => {
        if (needsBanner()) {
            setTimeout(() => {
                visible.value = true
            }, 1200)
        }
    })

    const handleAcceptAll = () => {
        acceptAll()
        visible.value = false
    }

    const handleEssential = () => {
        acceptEssential()
        visible.value = false
    }
</script>

<template>
    <Transition name="banner">
        <div
            v-if="visible"
            class="cookie-banner"
            role="dialog"
            aria-live="polite"
            aria-label="Cookie consent"
            data-testid="cookie-banner"
        >
            <div class="banner-content">
                <div class="banner-text">
                    <p class="banner-heading">We use cookies</p>
                    <p class="banner-body">
                        Analytics cookies help us understand how this site is used.
                        <button class="privacy-link" @click="emit('show-privacy')">
                            Privacy policy
                        </button>
                    </p>
                </div>

                <div class="banner-actions">
                    <button
                        class="btn-essential"
                        data-testid="essential-cookies"
                        @click="handleEssential"
                    >
                        Just essentials
                    </button>
                    <button
                        class="btn-accept"
                        data-testid="accept-cookies"
                        @click="handleAcceptAll"
                    >
                        Accept all
                    </button>
                </div>
            </div>
        </div>
    </Transition>
</template>

<style scoped>
    .cookie-banner {
        position: fixed;
        bottom: 1.25rem;
        left: 50%;
        transform: translateX(-50%);
        width: min(680px, calc(100vw - 2rem));
        background: #1a1a1a;
        border: 1px solid rgba(180, 79, 255, 0.25);
        border-radius: 8px;
        padding: 1.25rem 1.5rem;
        z-index: 200;
        box-shadow:
            0 8px 40px rgba(0, 0, 0, 0.6),
            0 0 0 1px rgba(180, 79, 255, 0.1);
    }

    .banner-content {
        display: flex;
        align-items: center;
        gap: 1.5rem;
        flex-wrap: wrap;
    }

    .banner-text {
        flex: 1;
        min-width: 200px;
    }

    .banner-heading {
        font-family: 'Righteous', sans-serif;
        font-size: 0.95rem;
        color: #f8fafc;
        margin: 0 0 0.25rem;
    }

    .banner-body {
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        color: #888;
        margin: 0;
        line-height: 1.5;
    }

    .privacy-link {
        background: none;
        border: none;
        cursor: pointer;
        color: #b44fff;
        font-family: inherit;
        font-size: inherit;
        padding: 0;
        text-decoration: underline;
        text-underline-offset: 2px;
    }
    .privacy-link:hover {
        color: #d080ff;
    }

    .banner-actions {
        display: flex;
        gap: 0.75rem;
        flex-shrink: 0;
    }

    .btn-essential {
        padding: 0.5rem 1.1rem;
        border: 1px solid rgba(255, 255, 255, 0.15);
        border-radius: 4px;
        background: transparent;
        color: rgba(248, 250, 252, 0.7);
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition:
            border-color 0.2s,
            color 0.2s;
    }
    .btn-essential:hover {
        border-color: rgba(255, 255, 255, 0.4);
        color: #f8fafc;
    }

    .btn-accept {
        padding: 0.5rem 1.25rem;
        border: 1px solid #b44fff;
        border-radius: 4px;
        background: #b44fff;
        color: #080808;
        font-family: 'Poppins', sans-serif;
        font-size: 0.78rem;
        font-weight: 600;
        letter-spacing: 0.05em;
        cursor: pointer;
        transition:
            background 0.2s,
            transform 0.15s;
    }
    .btn-accept:hover {
        background: #c866ff;
        transform: translateY(-1px);
    }
    .btn-accept:active {
        transform: translateY(0);
    }

    .banner-enter-active {
        transition:
            opacity 0.4s ease,
            transform 0.4s ease;
    }
    .banner-leave-active {
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }
    .banner-enter-from {
        opacity: 0;
        transform: translateX(-50%) translateY(16px);
    }
    .banner-leave-to {
        opacity: 0;
        transform: translateX(-50%) translateY(8px);
    }
</style>
