<script setup>
    import { ref, computed } from 'vue'
    import { useReveal } from '@/composables/useReveal'

    const props = defineProps({
        about: { type: Object, default: null },
        bio: { type: Object, default: null },
    })

    // Strip the "UK gigs / International" navigation paragraphs from the API HTML
    const cleanHtml = (html) => {
        if (!html) return ''
        return html.replace(/<p[^>]*class="about_text[^"]*"[^>]*>[\s\S]*?<\/p>/gi, '').trim()
    }

    const aboutLeft = computed(() => cleanHtml(props.about?.content_left))
    const aboutRight = computed(() => cleanHtml(props.about?.content_right))

    const sectionRef = ref(null)
    useReveal(sectionRef)

    const specialties = [
        {
            icon: 'vinyl',
            label: 'Vinyls & USB',
            desc: 'Tradition meets modern — spinning wax and digital sets with equal passion.',
        },
        {
            icon: 'drums',
            label: 'Electronic Drums Live',
            desc: 'Live electronic percussion adding raw energy to sets.',
        },
        {
            icon: 'globe',
            label: 'Worldwide',
            desc: 'From London to Ibiza, Italy, Maldives, Peru and beyond.',
        },
        {
            icon: 'studio',
            label: 'Producer',
            desc: 'Tribal vibes, percussions and world music at the heart of her productions.',
        },
    ]

    // Intercept internal HTML links and scroll to section
    const handleContentClick = (e) => {
        const link = e.target.closest('a')
        if (!link) return
        const href = link.getAttribute('href')
        if (!href || href.startsWith('http') || href.startsWith('mailto')) return
        e.preventDefault()
        const map = {
            '/uk-gigs': '#gigs',
            '/international': '#gigs',
            '/releases': '#releases',
            '/mixes': '#mixes',
        }
        const target = Object.entries(map).find(([k]) => href.startsWith(k))?.[1]
        if (target) document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
    }
</script>

<template>
    <section id="about" ref="sectionRef" class="about-section reveal" aria-labelledby="about-title">
        <div class="about-inner">
            <!-- Header -->
            <div class="about-header">
                <p class="section-label">About</p>
                <h2 id="about-title" class="section-title text-gradient">
                    {{ about?.title ?? 'About me' }}
                </h2>
            </div>

            <!-- Bio columns -->
            <div class="about-cols">
                <div class="about-left-col">
                    <div
                        class="about-prose"
                        @click="handleContentClick"
                    >
                        <p>I’ve played from the trendiest<br><a class="outbound_link" href="/uk-gigs"><strong>Shoreditch</strong></a> venues <br>to the glamorous <a href="/uk-gigs"><strong>West End</strong></a></p>
                    </div>

                    <!-- Instagram follow -->
                    <a
                        href="https://www.instagram.com/fabriziacorsimusic/"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="ig-follow"
                    >
                        <svg
                            class="ig-icon"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke-width="1.5"
                            aria-hidden="true"
                        >
                            <defs>
                                <linearGradient
                                    id="ig-grad"
                                    x1="2"
                                    y1="2"
                                    x2="22"
                                    y2="22"
                                    gradientUnits="userSpaceOnUse"
                                >
                                    <stop offset="0%" stop-color="#b44fff" />
                                    <stop offset="100%" stop-color="#f72585" />
                                </linearGradient>
                            </defs>
                            <rect
                                x="2"
                                y="2"
                                width="20"
                                height="20"
                                rx="5"
                                ry="5"
                                stroke="url(#ig-grad)"
                            />
                            <path
                                d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"
                                stroke="url(#ig-grad)"
                            />
                            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" stroke="url(#ig-grad)" />
                        </svg>
                        <span class="ig-text">
                            <span>Follow</span>
                            <span>Me</span>
                        </span>
                    </a>
                </div>

                <div class="about-right">
                    <div v-if="bio?.content_left" class="bio-quote">
                        <blockquote @click="handleContentClick" v-html="bio.content_left" />
                    </div>
                </div>
            </div>

            <!-- Years badge -->
            <div class="years-badge" aria-label="20 plus years career">
                <span class="years-number">20+</span>
                <span class="years-label">Years Career</span>
            </div>

            <!-- Specialty cards -->
            <div class="specialty-grid">
                <div
                    v-for="item in specialties"
                    :key="item.label"
                    class="specialty-card grad-border"
                >
                    <div class="spec-icon" aria-hidden="true">
                        <!-- Vinyl icon -->
                        <template v-if="item.icon === 'vinyl'">
                            <svg
                                width="38"
                                height="38"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#f72585"
                                stroke-width="1.5"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <circle cx="12" cy="12" r="3" />
                                <circle cx="12" cy="12" r="1" fill="#b44fff" stroke="none" />
                            </svg>
                        </template>
                        <!-- Drums icon -->
                        <template v-else-if="item.icon === 'drums'">
                            <svg
                                width="38"
                                height="38"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#f72585"
                                stroke-width="1.5"
                            >
                                <ellipse cx="12" cy="9" rx="9" ry="4" />
                                <path d="M3 9v6c0 2.2 4 4 9 4s9-1.8 9-4V9" />
                                <line x1="7" y1="4" x2="5" y2="2" />
                                <line x1="17" y1="4" x2="19" y2="2" />
                            </svg>
                        </template>
                        <!-- Globe icon -->
                        <template v-else-if="item.icon === 'globe'">
                            <svg
                                width="38"
                                height="38"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#f72585"
                                stroke-width="1.5"
                            >
                                <circle cx="12" cy="12" r="10" />
                                <line x1="2" y1="12" x2="22" y2="12" />
                                <path
                                    d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"
                                />
                            </svg>
                        </template>
                        <!-- Studio icon -->
                        <template v-else>
                            <svg
                                width="38"
                                height="38"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="#f72585"
                                stroke-width="1.5"
                            >
                                <path d="M9 18V5l12-2v13" />
                                <circle cx="6" cy="18" r="3" />
                                <circle cx="18" cy="16" r="3" />
                            </svg>
                        </template>
                    </div>
                    <h3 class="spec-label">{{ item.label }}</h3>
                    <p class="spec-desc">{{ item.desc }}</p>
                </div>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .about-section {
        background: #080808;
        padding: 6rem 1.5rem;
    }

    .about-inner {
        max-width: 1100px;
        margin: 0 auto;
        display: flex;
        flex-direction: column;
        gap: 3rem;
    }
    .about-header {
        text-align: center;
    }

    .about-cols {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 3rem;
    }
    .about-left-col {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    .ig-follow {
        display: inline-flex;
        align-items: center;
        gap: 0.75rem;
        text-decoration: none;
        align-self: flex-start;
        transition: opacity 0.2s;
    }
    .ig-follow:hover {
        opacity: 0.75;
    }

    .ig-icon {
        /* icon size is fully independent from text font-size */
        width: clamp(3rem, 8vw, 5rem);
        height: clamp(3rem, 8vw, 5rem);
        flex-shrink: 0;
    }

    .ig-text {
        display: flex;
        flex-direction: column;
        gap: 2px;
        font-size: clamp(3rem, 3vw, 5rem);
        font-family: 'Bebas Neue', sans-serif;
        letter-spacing: 0.06em;
        background: linear-gradient(135deg, #b44fff, #f72585);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
    }

    .ig-text span {
        line-height: 0.82;
        display: block;
    }

    .about-prose {
        font-family: 'Poppins', sans-serif;
        font-size: 1.05rem;
        line-height: 1.8;
        color: rgba(248, 250, 252, 0.8);
    }
    .about-prose :deep(p) {
        margin: 0 0 0.9rem;
    }
    .about-prose :deep(a) {
        color: #b44fff;
        text-decoration: none;
        font-weight: 600;
        transition: color 0.2s;
    }
    .about-prose :deep(a:hover) {
        color: #d080ff;
    }
    .about-prose :deep(strong) {
        color: #f8fafc;
    }
    .about-prose :deep(.about_text) {
        margin-top: 1.5rem;
    }

    .about-right {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .residents :deep(p) {
        margin: 0 0 0.5rem;
    }

    .bio-quote blockquote {
        font-family: 'Righteous', sans-serif;
        font-size: 1.1rem;
        color: rgba(248, 250, 252, 0.6);
        border-left: 3px solid #b44fff;
        padding-left: 1rem;
        margin: 0;
        line-height: 1.7;
    }
    .bio-quote blockquote :deep(a) {
        color: #b44fff;
        text-decoration: none;
    }
    .bio-quote blockquote :deep(p) {
        margin: 0 0 0.5rem;
    }

    .years-badge {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.25rem;
        padding: 2rem;
        background: linear-gradient(135deg, rgba(180, 79, 255, 0.08), rgba(247, 37, 133, 0.05));
        border: 1px solid rgba(180, 79, 255, 0.2);
        border-radius: 12px;
        text-align: center;
    }
    .years-number {
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(3rem, 8vw, 5rem);
        background: linear-gradient(135deg, #b44fff, #f72585);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        line-height: 1;
    }
    .years-label {
        font-family: 'Poppins', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 0.25em;
        text-transform: uppercase;
        color: #777;
    }

    .specialty-grid {
        display: grid;
        grid-template-columns: repeat(4, 1fr);
        gap: 1rem;
    }
    .specialty-card {
        background: #101010;
        border-radius: 10px;
        padding: 1.5rem 1.25rem;
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        transition: background 0.25s ease;
    }
    .specialty-card:hover {
        background: #1a1a1a;
    }
    .spec-icon {
        width: 38px;
        height: 38px;
    }
    .spec-label {
        font-family: 'Righteous', sans-serif;
        font-size: 0.9rem;
        color: #f8fafc;
        margin: 0;
    }
    .spec-desc {
        font-family: 'Poppins', sans-serif;
        font-size: 0.75rem;
        color: #CCC;
        margin: 0;
        line-height: 1.5;
    }

    @media (max-width: 900px) {
        .specialty-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
    @media (max-width: 640px) {
        .about-cols {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        .specialty-grid {
            grid-template-columns: repeat(2, 1fr);
        }
    }
</style>
