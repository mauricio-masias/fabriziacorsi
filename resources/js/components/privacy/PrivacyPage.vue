<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'
    import { useApi } from '@/composables/useApi'

    const emit = defineEmits(['close'])

    const { fetchEndpoint } = useApi()
    const content = ref('')
    const loading = ref(true)

    onMounted(async () => {
        try {
            const data = await fetchEndpoint('/privacy-policy')
            content.value = data.content ?? ''
        } catch (e) {
            content.value = '<p>Privacy policy could not be loaded.</p>'
        } finally {
            loading.value = false
        }

        // Close on Escape
        window.addEventListener('keydown', onKeyDown)
        document.body.style.overflow = 'hidden'
    })

    onUnmounted(() => {
        window.removeEventListener('keydown', onKeyDown)
        document.body.style.overflow = ''
    })

    const onKeyDown = (e) => {
        if (e.key === 'Escape') emit('close')
    }
</script>

<template>
    <div
        class="privacy-overlay"
        role="dialog"
        aria-modal="true"
        aria-labelledby="privacy-title"
        @click.self="emit('close')"
    >
        <div class="privacy-panel">
            <div class="privacy-header">
                <h2 id="privacy-title" class="privacy-title">Privacy Policy</h2>
                <button class="close-btn" aria-label="Close privacy policy" @click="emit('close')">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="2"
                        aria-hidden="true"
                    >
                        <line x1="18" y1="6" x2="6" y2="18" />
                        <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                </button>
            </div>

            <div class="privacy-body">
                <div v-if="loading" class="privacy-loading">
                    <div
                        v-for="n in 8"
                        :key="n"
                        class="skel-line"
                        :style="`width:${60 + n * 4}%`"
                    ></div>
                </div>
                <div v-else class="privacy-content" v-html="content" />
            </div>
        </div>
    </div>
</template>

<style scoped>
    .privacy-overlay {
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.85);
        z-index: 500;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1.5rem;
        backdrop-filter: blur(4px);
    }

    .privacy-panel {
        background: #111;
        border: 1px solid rgba(180, 79, 255, 0.2);
        border-radius: 12px;
        width: min(760px, 100%);
        max-height: 85vh;
        display: flex;
        flex-direction: column;
        overflow: hidden;
        box-shadow: 0 24px 80px rgba(0, 0, 0, 0.7);
    }

    .privacy-header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1.5rem 1.75rem;
        border-bottom: 1px solid rgba(255, 255, 255, 0.07);
        flex-shrink: 0;
    }

    .privacy-title {
        font-family: 'Righteous', sans-serif;
        font-size: 1.15rem;
        color: #f8fafc;
        margin: 0;
        letter-spacing: 0.05em;
    }

    .close-btn {
        background: none;
        border: none;
        color: #777;
        cursor: pointer;
        padding: 0.25rem;
        transition: color 0.2s;
        display: flex;
        align-items: center;
    }
    .close-btn:hover {
        color: #f8fafc;
    }

    .privacy-body {
        overflow-y: auto;
        padding: 1.75rem;
        flex: 1;
    }

    .privacy-content {
        font-family: 'Poppins', sans-serif;
        font-size: 0.88rem;
        line-height: 1.75;
        color: rgba(248, 250, 252, 0.75);
    }
    .privacy-content :deep(h2) {
        font-family: 'Righteous', sans-serif;
        font-size: 1rem;
        color: #b44fff;
        margin: 1.75rem 0 0.5rem;
        letter-spacing: 0.05em;
    }
    .privacy-content :deep(h3) {
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        font-weight: 600;
        color: #f8fafc;
        margin: 1.25rem 0 0.4rem;
    }
    .privacy-content :deep(p) {
        margin: 0 0 0.75rem;
    }
    .privacy-content :deep(ul) {
        margin: 0 0 0.75rem;
        padding-left: 1.5rem;
    }
    .privacy-content :deep(li) {
        margin-bottom: 0.35rem;
    }
    .privacy-content :deep(a) {
        color: #b44fff;
        text-decoration: none;
        transition: color 0.2s;
    }
    .privacy-content :deep(a:hover) {
        color: #d080ff;
    }
    .privacy-content :deep(strong) {
        color: #f8fafc;
        font-weight: 600;
    }

    .privacy-loading {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
    }
    .skel-line {
        height: 10px;
        border-radius: 4px;
        background: #1a1a1a;
        animation: pulse-dot 1.4s ease-in-out infinite;
    }
</style>
