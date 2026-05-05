<script setup>
    defineProps({
        track: { type: Object, required: true },
    })

    const streamingLinks = (track) =>
        [
            { key: 'spotify', url: track.spoty_url, label: 'Spotify', color: '#b44fff' },
            { key: 'itunes', url: track.itune_url, label: 'Apple Music', color: '#b44fff' },
            { key: 'amazon', url: track.amazon_url, label: 'Amazon', color: '#b44fff' },
            { key: 'trax', url: track.trax_url, label: 'Traxsource', color: '#b44fff' },
        ].filter((l) => l.url && !l.url.startsWith('https://i.scdn') && l.url.includes('://'))
</script>

<template>
    <article class="rel-card grad-border" :aria-label="`${track.title} release`">
        <div class="rel-img-wrap">
            <img
                :src="track.img"
                :alt="`${track.title} artwork`"
                class="rel-img"
                loading="lazy"
                width="160"
                height="160"
            />
            <div class="rel-img-overlay" aria-hidden="true"></div>
        </div>

        <div class="rel-info">
            <h3 class="rel-title">{{ track.title }}</h3>

            <div class="rel-meta">
                <span class="rel-tag">{{ track.music_style?.trim() }}</span>
                <span class="rel-bpm">{{ track.bpm }}</span>
            </div>

            <div class="rel-details">
                <span v-if="track.record_label?.trim()" class="rel-label-text">
                    {{ track.record_label.trim() }}
                </span>
                <span class="rel-year">{{ track.year?.trim() }}</span>
                <span class="rel-time">{{ track.time }}</span>
            </div>

            <div v-if="streamingLinks(track).length" class="rel-links">
                <a
                    v-for="link in streamingLinks(track)"
                    :key="link.key"
                    :href="link.url"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="stream-link"
                    :style="`--accent: ${link.color}`"
                    :aria-label="`${link.label} — ${track.title}`"
                    @click.stop
                >
                    {{ link.label }}
                </a>
            </div>
        </div>
    </article>
</template>

<style scoped>
    .rel-card {
        background: #101010;
        border-radius: 10px;
        overflow: hidden;
        display: flex;
        flex-direction: column;
        border: 1px solid rgba(255, 255, 255, 0.05);
        transition:
            transform 0.25s ease,
            box-shadow 0.25s ease;
    }
    .rel-card:hover {
        transform: translateY(-4px);
        box-shadow: 0 16px 40px rgba(245, 192, 64, 0.1);
    }

    .rel-img-wrap {
        position: relative;
        aspect-ratio: 1;
        overflow: hidden;
    }
    .rel-img-wrap::after {
        content: '';
        position: absolute;
        inset: 0;
        background-image: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 3px,
            rgba(0, 0, 0, 0.42) 3px,
            rgba(0, 0, 0, 0.42) 5px
        );
        background-size: 100% 5px;
        pointer-events: none;
        z-index: 1;
        animation: scanline-scroll 6s linear infinite;
    }
    .rel-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        filter: grayscale(1);
        transition: transform 0.4s ease, filter 0.4s ease;
    }
    .rel-card:hover .rel-img {
        transform: scale(1.04);
        filter: grayscale(0);
    }
    .rel-img-overlay {
        position: absolute;
        inset: 0;
        z-index: 2;
        background: linear-gradient(to top, rgba(8, 8, 8, 0.6) 0%, transparent 50%);
    }

    .rel-info {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
        flex: 1;
    }

    .rel-title {
        font-family: 'Righteous', sans-serif;
        font-size: 0.9rem;
        color: #f8fafc;
        margin: 0;
        line-height: 1.3;
    }

    .rel-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
    }

    .rel-tag {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        color: #f5c040;
        letter-spacing: 0.05em;
    }

    .rel-bpm {
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        color: #f5c040;
        letter-spacing: 0.1em;
        font-weight: 600;
    }

    .rel-details {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        flex-wrap: wrap;
        font-family: 'Poppins', sans-serif;
        font-size: 0.68rem;
        color: #CCC;
    }
    .rel-label-text::after {
        content: '·';
        margin-left: 0.5rem;
    }

    .rel-links {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
        margin-top: auto;
    }

    .stream-link {
        padding: 0.25rem 0.6rem;
        border-radius: 3px;
        font-family: 'Poppins', sans-serif;
        font-size: 0.62rem;
        letter-spacing: 0.05em;
        text-decoration: none;
        border: 1px solid rgba(var(--accent), 0.3);
        color: var(--accent);
        background: rgba(0, 0, 0, 0.2);
        transition:
            background 0.2s,
            transform 0.15s;
    }
    .stream-link:hover {
        background: color-mix(in srgb, var(--accent) 15%, transparent);
        transform: translateY(-1px);
    }
</style>
