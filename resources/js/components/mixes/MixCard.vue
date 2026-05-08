<script setup>
    const props = defineProps({
        mix: { type: Object, required: true },
    })

    const formatDate = (dateStr) => {
        if (!dateStr) return ''
        const parts = dateStr.trim().split(/\s+/)
        if (parts.length < 2) return dateStr
        const months = [
            'Jan',
            'Feb',
            'Mar',
            'Apr',
            'May',
            'Jun',
            'Jul',
            'Aug',
            'Sep',
            'Oct',
            'Nov',
            'Dec',
        ]
        const month = months[parseInt(parts[1], 10) - 1] ?? parts[1]
        return `${month} ${parts[0]}`
    }

    const formatDuration = (dur) => {
        if (!dur) return ''
        const [m, s] = dur.split(':')
        const mins = parseInt(m, 10)
        const secs = parseInt(s, 10)
        if (mins >= 60) {
            const h = Math.floor(mins / 60)
            const rem = mins % 60
            return `${h}h ${rem}m`
        }
        return `${mins}m ${secs.toString().padStart(2, '0')}s`
    }

    const openMix = () => {
        const url = props.mix.url
        const webUrl = `https://www.mixcloud.com${url}`
        const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)

        if (isMobile) {
            const appScheme = `mixcloud://${url.replace(/^\//, '')}`
            const start = Date.now()
            const iframe = document.createElement('iframe')
            iframe.style.display = 'none'
            iframe.src = appScheme
            document.body.appendChild(iframe)
            setTimeout(() => {
                document.body.removeChild(iframe)
                if (Date.now() - start < 2500) {
                    window.open(webUrl, '_blank', 'noopener,noreferrer')
                }
            }, 1500)
        } else {
            window.open(webUrl, '_blank', 'noopener,noreferrer')
        }
    }
</script>

<template>
    <article
        class="mix-card card-hover"
        :aria-label="`Listen to ${mix.name} on Mixcloud`"
        @click="openMix"
    >
        <div class="mix-img-wrap">
            <img
                :src="mix.img"
                :alt="`${mix.name} mix cover`"
                class="mix-img"
                loading="lazy"
                width="320"
                height="320"
            />
            <div class="mix-overlay" aria-hidden="true">
                <div class="play-icon">
                    <svg
                        width="36"
                        height="36"
                        viewBox="0 0 24 24"
                        fill="#080808"
                        aria-hidden="true"
                    >
                        <polygon points="5 3 19 12 5 21 5 3" />
                    </svg>
                </div>
                <span class="mixcloud-label">Open on Mixcloud</span>
            </div>
        </div>

        <div class="mix-info">
            <h3 class="mix-title">{{ mix.name }}</h3>
            <div class="mix-meta">
                <span class="mix-date">{{ formatDate(mix.date) }}</span>
                <span class="mix-dur">{{ formatDuration(mix.audio_length) }}</span>
            </div>
            <div v-if="mix.tags?.length" class="mix-tags">
                <span v-for="tag in mix.tags.slice(0, 3)" :key="tag" class="tag-pill">
                    {{ tag.replace('.', ' ') }}
                </span>
            </div>
        </div>
    </article>
</template>

<style scoped>
    .mix-card {
        background: #101010;
        border-radius: 10px;
        overflow: hidden;
        border: 1px solid rgba(255, 255, 255, 0.1);
    }

    .mix-img-wrap {
        position: relative;
        overflow: hidden;
        aspect-ratio: 1;
    }

    .mix-img-wrap::after {
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
        transition: opacity 0.3s ease;
        animation: scanline-scroll 6s linear infinite;
    }
    .mix-card:hover .mix-img-wrap::after {
        opacity: 0;
    }

    .mix-img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        display: block;
        filter: grayscale(1);
        transition: transform 0.4s ease, filter 0.4s ease;
    }
    .mix-card:hover .mix-img {
        transform: scale(1.04);
        filter: grayscale(0);
    }

    .mix-overlay {
        position: absolute;
        inset: 0;
        z-index: 2;
        background: rgba(8, 8, 8, 0.65);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 0.5rem;
        opacity: 0;
        transition: opacity 0.3s ease;
    }
    .mix-card:hover .mix-overlay {
        opacity: 1;
    }

    .play-icon {
        width: 60px;
        height: 60px;
        border-radius: 50%;
        background: #b44fff;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.2s ease;
    }
    .mix-card:hover .play-icon {
        transform: scale(1.1);
    }

    .mixcloud-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(248, 250, 252, 0.8);
    }

    .mix-info {
        padding: 1rem;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }

    .mix-title {
        font-family: 'Righteous', sans-serif;
        font-size: 0.95rem;
        color: #f8fafc;
        margin: 0;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

    .mix-meta {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        color: #CCC;
        letter-spacing: 0.05em;
    }

    .mix-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.3rem;
    }
</style>
