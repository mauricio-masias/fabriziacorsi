<script setup>
    import { ref } from 'vue'
    import { useApi } from '@/composables/useApi'
    import { useLazyLoad } from '@/composables/useReveal'
    import ReleaseCard from '@/components/releases/ReleaseCard.vue'

    const { fetchEndpoint } = useApi()

    const sectionRef = ref(null)
    const tracks = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const hasMore = ref(false)

    const loadReleases = async (page = 1) => {
        loading.value = true
        try {
            const data = await fetchEndpoint('/releases', page > 1 ? { page } : {})
            const content = data[0]?.content ?? {}
            if (page === 1) {
                tracks.value = content.tracks ?? []
            } else {
                tracks.value.push(...(content.tracks ?? []))
            }
            const mb = content.more_button ?? {}
            currentPage.value = mb.current_page ?? page
            totalPages.value = mb.total_pages ?? 1
            hasMore.value = mb.active ?? false
        } catch (e) {
            console.error('Releases load failed', e)
        } finally {
            loading.value = false
        }
    }

    useLazyLoad(sectionRef, () => loadReleases(1))

    const loadMore = () => loadReleases(currentPage.value + 1)
</script>

<template>
    <section
        id="releases"
        ref="sectionRef"
        class="releases-section"
        aria-labelledby="releases-title"
    >
        <div class="releases-inner">
            <div class="section-head">
                <p class="section-label">Productions</p>
                <h2 id="releases-title" class="section-title">Releases</h2>
            </div>

            <div v-if="loading && !tracks.length" class="rel-grid">
                <div v-for="n in 6" :key="n" class="rel-skeleton">
                    <div class="skel-img"></div>
                    <div class="skel-lines">
                        <div class="skel-line wide"></div>
                        <div class="skel-line short"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="tracks.length" class="rel-grid">
                <ReleaseCard v-for="track in tracks" :key="track.title" :track="track" />
            </div>

            <div v-if="hasMore" class="load-more-wrap">
                <button class="load-more-btn" :disabled="loading" @click="loadMore">
                    <span v-if="loading">Loading…</span>
                    <span v-else>Load more releases</span>
                </button>
                <p class="page-count">{{ currentPage }} / {{ totalPages }}</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .releases-section {
        background: #0c0c0c;
        padding: 5rem 1.5rem;
    }
    .releases-inner {
        max-width: 1100px;
        margin: 0 auto;
    }
    .section-head {
        text-align: center;
        margin-bottom: 3rem;
    }

    .rel-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
    }

    .rel-skeleton {
        background: #101010;
        border-radius: 10px;
        overflow: hidden;
    }
    .skel-img {
        width: 100%;
        aspect-ratio: 1;
        background: #1a1a1a;
    }
    .skel-lines {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .skel-line {
        height: 10px;
        border-radius: 4px;
        background: #1a1a1a;
        animation: pulse-dot 1.4s ease-in-out infinite;
    }
    .skel-line.wide {
        width: 70%;
    }
    .skel-line.short {
        width: 40%;
        animation-delay: 0.2s;
    }

    .load-more-wrap {
        margin-top: 2.5rem;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.75rem;
    }
    .load-more-btn {
        padding: 0.7rem 2.5rem;
        border: 1px solid rgba(245, 192, 64, 0.4);
        border-radius: 4px;
        background: transparent;
        color: #f5c040;
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        transition:
            background 0.2s,
            transform 0.15s;
    }
    .load-more-btn:hover:not(:disabled) {
        background: rgba(245, 192, 64, 0.08);
        transform: translateY(-2px);
    }
    .load-more-btn:disabled {
        opacity: 0.4;
        cursor: not-allowed;
    }
    .page-count {
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        color: #555;
        letter-spacing: 0.1em;
    }

    @media (max-width: 900px) {
        .rel-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 500px) {
        .rel-grid {
            grid-template-columns: 1fr;
            padding: 0 2.5%;
        }
    }
</style>
