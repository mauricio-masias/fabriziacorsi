<script setup>
    import { ref } from 'vue'
    import { useReveal } from '@/composables/useReveal'
    import UkGigsMarquee from '@/components/gigs/UkGigsMarquee.vue'
    import InternationalGigs from '@/components/gigs/InternationalGigs.vue'

    defineProps({
        ukGigs: { type: Array, default: () => [] },
        intlGigs: { type: Array, default: () => [] },
    })

    const sectionRef = ref(null)
    useReveal(sectionRef)

    const activeTab = ref('uk')
</script>

<template>
    <section id="gigs" ref="sectionRef" class="gigs-section reveal" aria-labelledby="gigs-title">
        <div class="gigs-header">
            <p class="section-label">Live Performances</p>
            <h2 id="gigs-title" class="section-title">Gigs</h2>

            <!-- Tab toggle -->
            <div class="gigs-tabs" role="tablist" aria-label="Gig categories">
                <button
                    role="tab"
                    :aria-selected="activeTab === 'uk'"
                    :class="['tab-btn', activeTab === 'uk' && 'active']"
                    @click="activeTab = 'uk'"
                >
                    UK
                </button>
                <button
                    role="tab"
                    :aria-selected="activeTab === 'intl'"
                    :class="['tab-btn', activeTab === 'intl' && 'active']"
                    @click="activeTab = 'intl'"
                >
                    International
                </button>
            </div>
        </div>

        <Transition name="tab-fade" mode="out-in">
            <div v-if="activeTab === 'uk'" key="uk" role="tabpanel" aria-label="UK gigs">
                <UkGigsMarquee :venues="ukGigs" />
            </div>
            <div v-else key="intl" role="tabpanel" aria-label="International gigs">
                <InternationalGigs :countries="intlGigs" />
            </div>
        </Transition>
    </section>
</template>

<style scoped>
    .gigs-section {
        background: #080808;
        padding: 5rem 0 4rem;
        overflow: hidden;
    }
    .gigs-header {
        max-width: 1100px;
        margin: 0 auto 2.5rem;
        padding: 0 1.5rem;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
    }
    .gigs-tabs {
        display: flex;
        gap: 0;
        margin-top: 1.5rem;
        border: 1px solid rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        overflow: hidden;
    }
    .tab-btn {
        padding: 0.6rem 2.5rem;
        background: transparent;
        border: none;
        color: rgba(248, 250, 252, 0.5);
        font-family: 'Poppins', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        cursor: pointer;
        transition:
            background 0.2s,
            color 0.2s;
    }
    .tab-btn.active {
        background: #b44fff;
        color: #080808;
        font-weight: 600;
    }
    .tab-btn:not(.active):hover {
        background: rgba(180, 79, 255, 0.1);
        color: #b44fff;
    }
    .tab-fade-enter-active,
    .tab-fade-leave-active {
        transition: opacity 0.25s ease;
    }
    .tab-fade-enter-from,
    .tab-fade-leave-to {
        opacity: 0;
    }
</style>
