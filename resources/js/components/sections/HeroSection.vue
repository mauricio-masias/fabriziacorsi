<script setup>
    import { computed } from 'vue'

    defineProps({
        musicStyles: { type: Array, default: () => [] },
    })

    // EQ bars — deterministic, no Math.random() in render
    const eqBars = computed(() =>
        Array.from({ length: 44 }, (_, i) => ({
            h: 14 + Math.abs(Math.sin(i * 0.72) * 52 + Math.cos(i * 1.4) * 18),
            d: ((i * 0.065) % 1.5).toFixed(3),
            dur: (0.45 + (i % 8) * 0.09).toFixed(2),
        })),
    )

    const scrollDown = () => {
        document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })
    }
</script>

<template>
    <section id="hero" class="hero" aria-labelledby="hero-title">
        <!-- Background image -->
        <div class="hero-bg" aria-hidden="true"></div>

        <!-- Gradient fades (top + bottom) -->
        <div class="hero-fades" aria-hidden="true"></div>

        <!-- Aurora background blobs -->
        <div class="aurora" aria-hidden="true">
            <div class="blob b1"></div>
            <div class="blob b2"></div>
            <div class="blob b3"></div>
        </div>

        <!-- Central content -->
        <div class="hero-content">
            <h1 id="hero-title" class="sr-only">Fabrizia Corsi</h1>

            <img
                src="/assets/fabrizia-corsi-logo-transparent-white.gif"
                alt="Fabrizia Corsi"
                class="hero-logo"
            />

            <p class="hero-subtitle">DJ &middot; Producer &middot; Live Drums &middot; London</p>

            <div v-if="musicStyles.length" class="hero-tags" aria-label="Music styles">
                <span v-for="style in musicStyles" :key="style" class="tag-pill">
                    {{ style }}
                </span>
            </div>

            <!-- EQ Visualiser strip -->
            <div class="eq-strip" aria-hidden="true">
                <span
                    v-for="(bar, i) in eqBars"
                    :key="i"
                    class="eq-bar"
                    :style="`--h:${bar.h}px;--d:${bar.d}s;--dur:${bar.dur}s`"
                />
            </div>

        </div>

        <!-- Scroll indicator -->
        <button class="scroll-btn" aria-label="Scroll to about" @click="scrollDown">
            <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(180,79,255,0.55)"
                stroke-width="2"
                aria-hidden="true"
            >
                <polyline points="6 9 12 15 18 9" />
            </svg>
        </button>
    </section>
</template>

<style scoped>
    /* ─── Layout ─────────────────────────────────── */
    .hero {
        position: relative;
        min-height: 100svh;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        overflow: hidden;
        background: #000000;
    }

    /* ─── Background image ───────────────────────── */
    .hero-bg {
        position: absolute;
        top: 0;
        bottom: 0;
        left: 50%;
        transform: translateX(-50%);
        width: min(100%, 1000px);
        z-index: 0;
        background: url('/assets/fabrizia-corsi.jpg') 60% 10% / cover no-repeat;
        filter: grayscale(1) contrast(1.4) brightness(0.45);
    }

    /* Scan lines overlay on background */
    .hero-bg::after {
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
        animation: scanline-scroll 6s linear infinite;
    }

    /* ─── Gradient fades ─────────────────────────── */
    .hero-fades {
        position: absolute;
        inset: 0;
        z-index: 1;
        background: linear-gradient(
            to bottom,
            #080808 0%,
            transparent 22%,
            transparent 78%,
            #080808 100%
        );
        pointer-events: none;
    }

    /* ─── Aurora blobs ────────────────────────────── */
    .aurora {
        position: absolute;
        inset: 0;
        overflow: hidden;
        z-index: 2;
    }
    .blob {
        position: absolute;
        border-radius: 50%;
        pointer-events: none;
        filter: blur(80px);
    }
    .b1 {
        width: 55vw;
        height: 55vw;
        background: #8b2be2;
        top: -15%;
        left: -10%;
        opacity: 0.18;
        animation: blob-a 20s ease-in-out infinite;
    }
    .b2 {
        width: 45vw;
        height: 45vw;
        background: #d946ef;
        top: 10%;
        right: -12%;
        opacity: 0.14;
        animation: blob-b 26s ease-in-out infinite;
    }
    .b3 {
        width: 38vw;
        height: 38vw;
        background: #f72585;
        bottom: 5%;
        left: 32%;
        opacity: 0.1;
        animation: blob-a 22s ease-in-out infinite reverse;
        animation-delay: -9s;
    }

    @keyframes blob-a {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
        }
        33% {
            transform: translate(40px, -50px) scale(1.05);
        }
        66% {
            transform: translate(-30px, 30px) scale(0.96);
        }
    }
    @keyframes blob-b {
        0%,
        100% {
            transform: translate(0, 0) scale(1);
        }
        40% {
            transform: translate(-50px, 40px) scale(1.08);
        }
        70% {
            transform: translate(35px, -35px) scale(0.94);
        }
    }

    /* ─── Dot grid ────────────────────────────────── */
    .dot-grid {
        position: absolute;
        inset: 0;
        background-image: radial-gradient(rgba(180, 79, 255, 0.28) 1px, transparent 1px);
        background-size: 36px 36px;
        pointer-events: none;
        z-index: 3;
        opacity: 0.45;
        -webkit-mask-image: radial-gradient(ellipse at center, black 30%, transparent 78%);
        mask-image: radial-gradient(ellipse at center, black 30%, transparent 78%);
    }

    /* ─── Content ─────────────────────────────────── */
    .hero-content {
        position: relative;
        z-index: 4;
        text-align: center;
        padding: 4rem 1.5rem 4rem;
        width: 100%;
        max-width: 900px;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 1.4rem;
        animation: fade-in-up 0.9s ease both;
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

    /* ─── Logo ────────────────────────────────────── */
    .hero-logo {
        width: min(80%, 480px);
        height: auto;
        display: block;
        animation: fade-in-up 0.9s ease both;
    }

    .hero-subtitle {
        font-family: 'Poppins', sans-serif;
        font-size: clamp(0.7rem, 2vw, 0.9rem);
        letter-spacing: 0.38em;
        text-transform: uppercase;
        color: #f72585;
        margin: 0;
        animation: fade-in-up 0.9s 0.3s ease both;
    }

    .hero-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 0.4rem;
        justify-content: center;
        max-width: 640px;
        animation: fade-in-up 0.9s 0.55s ease both;
    }

    /* ─── EQ visualiser ────────────────────────────── */
    .eq-strip {
        width: 100%;
        height: 80px;
        display: flex;
        align-items: flex-end;
        justify-content: center;
        gap: 3px;
        pointer-events: none;
        mask-image: linear-gradient(to right, transparent, black 12%, black 88%, transparent);
    }

    .eq-bar {
        flex-shrink: 0;
        width: 4px;
        height: var(--h);
        background: linear-gradient(
            to top,
            rgba(180, 79, 255, 0.7) 0%,
            rgba(247, 37, 133, 0.45) 60%,
            rgba(180, 79, 255, 0.1) 100%
        );
        border-radius: 2px 2px 0 0;
        transform-origin: bottom;
        animation: eq-pulse var(--dur) ease-in-out var(--d) infinite alternate;
    }

    @keyframes eq-pulse {
        from {
            transform: scaleY(0.15);
            opacity: 0.4;
        }
        to {
            transform: scaleY(1);
            opacity: 1;
        }
    }

    /* ─── Scroll button ───────────────────────────── */
    .scroll-btn {
        position: absolute;
        bottom: 1.5rem;
        left: 50%;
        transform: translateX(-50%);
        background: none;
        border: none;
        cursor: pointer;
        z-index: 4;
        padding: 0.5rem;
        animation: scroll-bounce 2.2s ease-in-out infinite;
    }

    /* ─── Responsive ──────────────────────────────── */
    @media (max-width: 640px) {
        .hero-content {
            padding-bottom: 3rem;
        }
        .eq-strip {
            height: 52px;
            gap: 2px;
        }
        .eq-bar {
            width: 3px;
        }
        .hero-logo {
            width: min(90%, 320px);
        }
    }

    @media (prefers-reduced-motion: reduce) {
        .blob,
        .eq-bar {
            animation: none;
        }
        .blob {
            opacity: 0.04;
        }
        .eq-bar {
            transform: scaleY(0.5);
            opacity: 0.5;
        }
        .hero-bg::after {
            animation: none;
        }
    }
</style>
