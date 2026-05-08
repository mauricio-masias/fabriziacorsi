<script setup>
    import { ref } from 'vue'
    import { useReveal } from '@/composables/useReveal'

    defineProps({
        contact: { type: Object, default: null },
    })

    const sectionRef = ref(null)
    useReveal(sectionRef)
</script>

<template>
    <section
        id="contact"
        ref="sectionRef"
        class="contact-section reveal"
        aria-labelledby="contact-title"
    >
        <div class="contact-inner">
            <!-- Decorative vinyl -->
            <div class="contact-vinyl" aria-hidden="true">
                <svg viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg" class="vinyl-bg">
                    <defs>
                        <clipPath id="center-logo-clip">
                            <circle cx="100" cy="100" r="33" />
                        </clipPath>
                        <filter id="hole-glow" x="-600%" y="-600%" width="1300%" height="1300%">
                            <feGaussianBlur stdDeviation="5" />
                        </filter>
                    </defs>
                    <circle
                        cx="100"
                        cy="100"
                        r="96"
                        fill="#0e0e0e"
                        stroke="#2e2e2e"
                        stroke-width="1"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="80"
                        fill="none"
                        stroke="#252525"
                        stroke-width="1"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="64"
                        fill="none"
                        stroke="#252525"
                        stroke-width="1"
                    />
                    <circle
                        cx="100"
                        cy="100"
                        r="48"
                        fill="none"
                        stroke="#252525"
                        stroke-width="1"
                    />
                    <circle cx="100" cy="100" r="34" fill="#16003a" />
                    <image
                        href="/assets/dj-fabrizia-n-logo.png"
                        x="78"
                        y="73"
                        width="44"
                        height="44"
                        clip-path="url(#center-logo-clip)"
                        preserveAspectRatio="xMidYMid meet"
                    />
                    <circle cx="100" cy="100" r="5" fill="#16003a" />
                </svg>
            </div>

            <div class="contact-content">
                <p class="section-label">Get in touch</p>
                <h2 id="contact-title" class="section-title contact-title-text">
                    <span v-html="contact?.title ?? 'Contact me'" />
                </h2>

                <p class="contact-tagline">
                    Tell me what you need — I'll find a solution that fits your budget &amp;
                    schedule.
                </p>

                <p class="contact-includes">I can include:</p>
                <ul class="contact-list">
                    <li>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#b44fff"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Pro Audio (PA)
                    </li>
                    <li>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#b44fff"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Beat-reactive Laser/Lights
                    </li>
                    <li>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#f72585"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Live Electronic Drums
                    </li>
                    <li>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#f72585"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Dj Booth
                    </li>
                    <li>
                        <svg
                            width="16"
                            height="16"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="#f72585"
                            stroke-width="2"
                            aria-hidden="true"
                        >
                            <polyline points="20 6 9 17 4 12" />
                        </svg>
                        Pioneer DJ XDJ-RX3 Controller
                    </li>
                </ul>

                <a href="mailto:hello@djfabrizia.com" class="contact-email">
                    hello@djfabrizia.com
                </a>

                <p class="contact-sub">Click to send an email — I'll get back with a quote ASAP.</p>
            </div>
        </div>
    </section>
</template>

<style scoped>
    .contact-section {
        background: #080808;
        padding: 6rem 1.5rem;
        position: relative;
        overflow: hidden;
    }

    .contact-inner {
        max-width: 1100px;
        margin: 0 auto;
        display: grid;
        grid-template-columns: 1fr 1.4fr;
        gap: 4rem;
        align-items: center;
    }

    .contact-vinyl {
        display: flex;
        align-items: center;
        justify-content: center;
        opacity: 0.65;
    }
    .vinyl-bg {
        width: 100%;
        max-width: 360px;
        animation: spin-vinyl 30s linear infinite;
        filter: drop-shadow(0 0 40px rgba(180, 79, 255, 0.4));
    }

    .contact-content {
        display: flex;
        flex-direction: column;
        gap: 1.25rem;
    }

    .contact-title-text {
        line-height: 1.05;
    }

    .contact-tagline {
        font-family: 'Poppins', sans-serif;
        font-size: 1.05rem;
        color: rgba(248, 250, 252, 0.65);
        line-height: 1.7;
        margin: 0;
    }

    .contact-includes {
        font-family: 'Poppins', sans-serif;
        font-size: 0.82rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        color: #555;
        margin: 0;
    }

    .contact-list {
        list-style: none;
        margin: 0;
        padding: 0;
        display: flex;
        flex-direction: column;
        gap: 0.5rem;
    }
    .contact-list li {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        font-family: 'Poppins', sans-serif;
        font-size: 0.9rem;
        color: rgba(248, 250, 252, 0.8);
    }

    .contact-email {
        display: inline-block;
        font-family: 'Bebas Neue', sans-serif;
        font-size: clamp(1.5rem, 4vw, 2.5rem);
        letter-spacing: 0.08em;
        background: linear-gradient(135deg, #b44fff, #f72585);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        text-decoration: none;
        transition:
            opacity 0.2s,
            transform 0.2s;
    }
    .contact-email:hover {
        opacity: 0.8;
        transform: translateY(-2px);
    }

    .contact-sub {
        font-family: 'Poppins', sans-serif;
        font-size: 0.75rem;
        color: #555;
        margin: 0;
        letter-spacing: 0.05em;
    }

    @media (max-width: 768px) {
        .contact-inner {
            grid-template-columns: 1fr;
            gap: 2rem;
        }
        .contact-vinyl {
            display: none;
        }
        .contact-content {
            align-items: center;
            text-align: center;
        }
    }
</style>
