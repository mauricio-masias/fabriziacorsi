<script setup>
    import { computed } from 'vue'

    const props = defineProps({
        venues: { type: Array, default: () => [] },
    })

    // Split into 3 rows, each looped for seamless scroll
    const rows = computed(() => {
        const sorted = [...props.venues].sort()
        const third = Math.ceil(sorted.length / 3)
        return [sorted.slice(0, third), sorted.slice(third, third * 2), sorted.slice(third * 2)]
    })

    const rowText = (arr) => arr.join(' · ') + ' · '
</script>

<template>
    <div class="marquee-wrap" aria-label="UK gig venues" role="region">
        <div v-for="(row, i) in rows" :key="i" class="marquee-row">
            <div
                :class="['marquee-track', i % 2 === 0 ? 'fwd' : 'rev']"
                :style="`--dur: ${24 + i * 5}s`"
                aria-hidden="true"
            >
                <!-- Double the content for seamless loop -->
                <span class="marquee-item">{{ rowText(row) }}</span>
                <span class="marquee-item" aria-hidden="true">{{ rowText(row) }}</span>
            </div>
        </div>

        <!-- Screen-reader accessible list -->
        <ul class="sr-only" aria-label="Full list of UK venues">
            <li v-for="v in venues" :key="v">{{ v }}</li>
        </ul>

        <div class="marquee-count">
            <span class="count-number">{{ venues.length }}</span>
            <span class="count-label">UK Venues</span>
        </div>
    </div>
</template>

<style scoped>
    .marquee-wrap {
        padding: 1rem 0 2rem;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        position: relative;
    }

    /* Fade edges */
    .marquee-wrap::before,
    .marquee-wrap::after {
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        width: 8rem;
        z-index: 2;
        pointer-events: none;
    }
    .marquee-wrap::before {
        left: 0;
        background: linear-gradient(to right, #0c0c0c, transparent);
    }
    .marquee-wrap::after {
        right: 0;
        background: linear-gradient(to left, #0c0c0c, transparent);
    }

    .marquee-row {
        overflow: hidden;
    }

    .marquee-track {
        display: flex;
        white-space: nowrap;
        will-change: transform;
    }
    .marquee-track.fwd {
        animation: marquee-fwd var(--dur, 28s) linear infinite;
    }
    .marquee-track.rev {
        animation: marquee-rev var(--dur, 32s) linear infinite;
    }

    .marquee-item {
        font-family: 'Righteous', sans-serif;
        font-size: clamp(0.85rem, 2.5vw, 1.15rem);
        letter-spacing: 0.06em;
        text-transform: uppercase;
        padding-right: 0;
        flex-shrink: 0;
    }

    /* Alternate row colors */
    .marquee-row:nth-child(1) .marquee-item {
        color: rgba(248, 250, 252, 0.5);
    }
    .marquee-row:nth-child(2) .marquee-item {
        color: rgba(180, 79, 255, 0.65);
    }
    .marquee-row:nth-child(3) .marquee-item {
        color: rgba(248, 250, 252, 0.35);
    }

    .marquee-count {
        max-width: 1100px;
        margin: 1.5rem auto 0;
        padding: 0 1.5rem;
        display: flex;
        align-items: baseline;
        gap: 0.5rem;
    }
    .count-number {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 3.5rem;
        background: linear-gradient(135deg, #b44fff, #f72585);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
    }
    .count-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.75rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #555;
    }

    .sr-only {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0, 0, 0, 0);
        white-space: nowrap;
        border: 0;
    }
</style>
