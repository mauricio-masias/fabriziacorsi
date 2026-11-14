import { ref } from 'vue'
import { useApi } from '@/composables/useApi'
import { useLazyLoad } from '@/composables/useReveal'
import { mapCollection } from '@/api/v2Adapters'

/**
 * Paginated v2 collection feed for a section. Renders `initialPage` (embedded in
 * GET /pages/home) without a request; only falls back to lazily fetching page 1
 * when it is absent. "Load more" fetches `<path>?page=N` and appends.
 * @param {object} options
 * @param {import('vue').Ref<HTMLElement | null>} options.sectionRef Element observed for the lazy fallback.
 * @param {string} options.path Collection endpoint, e.g. '/collections/mixes'.
 * @param {(item: object) => object} options.mapItem v2 item → component shape.
 * @param {{ tracks: object[], currentPage: number, totalPages: number, hasMore: boolean } | null} [options.initialPage]
 * @param {string} options.label Used in the error log, e.g. 'Mixes'.
 */
export function useCollectionFeed({ sectionRef, path, mapItem, initialPage = null, label }) {
    const { fetchEndpoint } = useApi()

    const tracks = ref([])
    const loading = ref(false)
    const currentPage = ref(1)
    const totalPages = ref(1)
    const hasMore = ref(false)

    const applyPage = (page, append) => {
        tracks.value = append ? [...tracks.value, ...page.tracks] : page.tracks
        currentPage.value = page.currentPage
        totalPages.value = page.totalPages
        hasMore.value = page.hasMore
    }

    const loadPage = async (page) => {
        loading.value = true
        try {
            const body = await fetchEndpoint(path, page > 1 ? { page } : {})
            applyPage(mapCollection(body, mapItem), page > 1)
        } catch (e) {
            console.error(`${label} load failed`, e)
        } finally {
            loading.value = false
        }
    }

    if (initialPage) applyPage(initialPage, false)

    useLazyLoad(sectionRef, () => {
        if (!initialPage) loadPage(1)
    })

    const loadMore = () => loadPage(currentPage.value + 1)

    return { tracks, loading, currentPage, totalPages, hasMore, loadMore }
}
