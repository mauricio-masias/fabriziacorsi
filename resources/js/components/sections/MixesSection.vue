<script setup>
    import { ref } from 'vue'
    import { useApi } from '@/composables/useApi'
    import { useLazyLoad } from '@/composables/useReveal'
    import MixCard from '@/components/mixes/MixCard.vue'

    const { fetchEndpoint } = useApi()

    const sectionRef = ref(null)
    const tracks = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const hasMore = ref(false)

    const loadMixes = async (page = 1) => {
        loading.value = true
        try {
            const data = await fetchEndpoint('/mixes', page > 1 ? { page } : {})
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
            console.error('Mixes load failed', e)
        } finally {
            loading.value = false
        }
    }

    useLazyLoad(sectionRef, () => loadMixes(1))

    const loadMore = () => loadMixes(currentPage.value + 1)
</script>

<template>
    <section id="mixes" ref="sectionRef" class="mixes-section" aria-labelledby="mixes-title">
        <div class="mixes-inner">
            <div class="section-head">
                <p class="section-label">Mixes</p>
                <h2 id="mixes-title" class="section-title">Listen</h2>
            </div>

            <!-- Loading skeleton -->
            <div v-if="loading && !tracks.length" class="mix-grid" aria-label="Loading mixes">
                <div v-for="n in 6" :key="n" class="mix-skeleton" aria-hidden="true">
                    <div class="skel-img"></div>
                    <div class="skel-lines">
                        <div class="skel-line wide"></div>
                        <div class="skel-line short"></div>
                    </div>
                </div>
            </div>

            <div v-else-if="tracks.length" class="mix-grid">
                <MixCard v-for="mix in tracks" :key="mix.url" :mix="mix" />
            </div>

            <div v-if="hasMore" class="load-more-wrap">
                <button class="load-more-btn" :disabled="loading" @click="loadMore">
                    <span v-if="loading">Loading…</span>
                    <span v-else>Load more mixes</span>
                </button>
                <p class="page-count">{{ currentPage }} / {{ totalPages }}</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .mixes-section {
        background: #080808;
        padding: 5rem 1.5rem;
    }
    .mixes-inner {
        max-width: 1100px;
        margin: 0 auto;
    }
    .section-head {
        text-align: center;
        margin-bottom: 3rem;
    }

    .mix-grid {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 1.25rem;
    }

    /* Skeleton */
    .mix-skeleton {
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
        width: 75%;
    }
    .skel-line.short {
        width: 45%;
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
        border: 1px solid rgba(180, 79, 255, 0.5);
        border-radius: 4px;
        background: transparent;
        color: #b44fff;
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        cursor: pointer;
        transition:
            background 0.2s,
            color 0.2s,
            transform 0.15s;
    }
    .load-more-btn:hover:not(:disabled) {
        background: rgba(180, 79, 255, 0.12);
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
        .mix-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 500px) {
        .mix-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
