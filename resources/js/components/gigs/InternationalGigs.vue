<script setup>
    import { ref, computed } from 'vue'

    const props = defineProps({
        countries: { type: Array, default: () => [] },
    })

    // Pre-expand active countries; sort active first
    const sorted = computed(() => [...props.countries].sort((a, b) => b.active - a.active))

    const open = ref(
        props.countries.reduce((acc, c) => {
            acc[c.title] = !!c.active
            return acc
        }, {}),
    )

    const toggle = (title) => {
        open.value[title] = !open.value[title]
    }

    const totalCountries = computed(() => props.countries.length)
    const totalClubs = computed(() =>
        props.countries.reduce(
            (sum, c) => sum + c.cities.reduce((s2, city) => s2 + city.clubs.length, 0),
            0,
        ),
    )
</script>

<template>
    <div class="intl-wrap">
        <!-- Stats bar -->
        <div class="intl-stats">
            <div class="stat">
                <span class="stat-num">{{ totalCountries }}</span>
                <span class="stat-label">Countries</span>
            </div>
            <div class="stat-divider" aria-hidden="true"></div>
            <div class="stat">
                <span class="stat-num">{{ totalClubs }}</span>
                <span class="stat-label">International Venues</span>
            </div>
        </div>

        <!-- Country accordion grid -->
        <div class="country-grid" role="list">
            <div
                v-for="country in sorted"
                :key="country.title"
                class="country-card"
                :class="{ 'is-open': open[country.title] }"
                role="listitem"
            >
                <button
                    class="country-header"
                    :aria-expanded="open[country.title]"
                    :aria-controls="`country-${country.title}`"
                    @click="toggle(country.title)"
                >
                    <span class="country-name">{{ country.title }}</span>

                    <span class="country-meta">
                        <span class="city-count">
                            {{ country.cities.length }}
                            {{ country.cities.length === 1 ? 'city' : 'cities' }}
                        </span>
                        <svg
                            class="chevron"
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <polyline points="6 9 12 15 18 9" />
                        </svg>
                    </span>
                </button>

                <div
                    :id="`country-${country.title}`"
                    class="country-body"
                    :class="{ 'is-open': open[country.title] }"
                >
                    <div class="city-list">
                        <div v-for="city in country.cities" :key="city.name" class="city-item">
                            <span class="city-name">{{ city.name }}</span>
                            <span class="club-list">{{ city.clubs.join(', ') }}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>
    .intl-wrap {
        max-width: 1100px;
        margin: 0 auto;
        padding: 0.5rem 1.5rem 2rem;
    }

    .intl-stats {
        display: flex;
        align-items: center;
        gap: 2rem;
        margin-bottom: 2rem;
        padding: 1.5rem 2rem;
        background: #101010;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
    }
    .stat {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }
    .stat-num {
        font-family: 'Bebas Neue', sans-serif;
        font-size: 2.5rem;
        line-height: 1;
        background: linear-gradient(135deg, #b44fff, #f72585);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }
    .stat-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        letter-spacing: 0.2em;
        text-transform: uppercase;
        color: #555;
    }
    .stat-divider {
        width: 1px;
        height: 40px;
        background: rgba(255, 255, 255, 0.08);
    }

    .country-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;
        align-items: start; /* prevents expanded card from stretching its row-partner */
    }

    .country-card {
        background: #101010;
        border: 1px solid rgba(255, 255, 255, 0.06);
        border-radius: 8px;
        overflow: hidden;
        transition: border-color 0.25s ease;
    }
    .country-card.is-open {
        border-color: rgba(180, 79, 255, 0.3);
    }

    .country-header {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 1rem 1.25rem;
        background: none;
        border: none;
        cursor: pointer;
        text-align: left;
        transition: background 0.2s;
    }
    .country-header:hover {
        background: rgba(255, 255, 255, 0.03);
    }

    .country-name {
        font-family: 'Righteous', sans-serif;
        font-size: 0.95rem;
        letter-spacing: 0.06em;
        color: #f8fafc;
        text-transform: uppercase;
    }

    .country-meta {
        display: flex;
        align-items: center;
        gap: 0.75rem;
        flex-shrink: 0;
    }
    .city-count {
        font-family: 'Poppins', sans-serif;
        font-size: 0.7rem;
        color: #555;
        letter-spacing: 0.08em;
    }
    .chevron {
        color: #555;
        transition:
            transform 0.3s ease,
            color 0.2s;
        flex-shrink: 0;
    }
    .country-card.is-open .chevron {
        transform: rotate(180deg);
        color: #b44fff;
    }

    .country-body {
        max-height: 0;
        overflow: hidden;
        transition: max-height 0.4s ease;
    }
    .country-body.is-open {
        max-height: 500px;
    }

    .city-list {
        padding: 0 1.25rem 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.75rem;
        border-top: 1px solid rgba(255, 255, 255, 0.05);
        padding-top: 0.75rem;
    }

    .city-item {
        display: flex;
        flex-direction: column;
        gap: 0.15rem;
    }

    .city-name {
        font-family: 'Poppins', sans-serif;
        font-size: 0.8rem;
        font-weight: 600;
        color: #b44fff;
        letter-spacing: 0.05em;
    }

    .club-list {
        font-family: 'Poppins', sans-serif;
        font-size: 0.75rem;
        color: rgba(248, 250, 252, 0.5);
        line-height: 1.5;
    }

    @media (max-width: 640px) {
        .country-grid {
            grid-template-columns: 1fr;
        }
        .intl-stats {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
        }
        .stat-divider {
            display: none;
        }
    }
</style>
