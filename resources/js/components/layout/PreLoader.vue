<template>
    <div class="preloader" role="status" aria-label="Loading">
        <div class="vinyl-spin" aria-hidden="true">
            <svg viewBox="0 0 200 200" width="120" height="120" xmlns="http://www.w3.org/2000/svg">
                <circle cx="100" cy="100" r="96" fill="#0a0a0a" stroke="#1e1e1e" stroke-width="2" />
                <circle cx="100" cy="100" r="85" fill="none" stroke="#1a1a1a" stroke-width="1" />
                <circle cx="100" cy="100" r="75" fill="none" stroke="#1a1a1a" stroke-width="1" />
                <circle cx="100" cy="100" r="65" fill="none" stroke="#1a1a1a" stroke-width="1" />
                <circle cx="100" cy="100" r="55" fill="none" stroke="#1a1a1a" stroke-width="1" />
                <circle cx="100" cy="100" r="45" fill="none" stroke="#222" stroke-width="1" />
                <circle cx="100" cy="100" r="34" fill="#14002a" />
                <circle cx="100" cy="100" r="24" fill="#1e0040" />
                <circle cx="100" cy="100" r="5" fill="#080808" />
                <text
                    x="100"
                    y="97"
                    text-anchor="middle"
                    fill="#b44fff"
                    font-size="5.5"
                    font-family="Poppins,sans-serif"
                    font-weight="500"
                >
                    FABRIZIA
                </text>
                <text
                    x="100"
                    y="106"
                    text-anchor="middle"
                    fill="#b44fff"
                    font-size="4.5"
                    font-family="Poppins,sans-serif"
                >
                    CORSI
                </text>
            </svg>
        </div>

        <div class="loader-dots" aria-hidden="true"><span></span><span></span><span></span></div>
    </div>
</template>

<style scoped>
    .preloader {
        position: fixed;
        inset: 0;
        background: #080808;
        z-index: 9999;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        gap: 2rem;
    }

    .vinyl-spin {
        animation: spin-vinyl 2s linear infinite;
        filter: drop-shadow(0 0 20px rgba(180, 79, 255, 0.35));
    }

    .loader-dots {
        display: flex;
        gap: 0.5rem;
    }
    .loader-dots span {
        width: 6px;
        height: 6px;
        border-radius: 50%;
        background: #b44fff;
        animation: pulse-dot 1.2s ease-in-out infinite;
    }
    .loader-dots span:nth-child(2) {
        animation-delay: 0.2s;
    }
    .loader-dots span:nth-child(3) {
        animation-delay: 0.4s;
    }
</style>
