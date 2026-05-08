<script setup>
    defineEmits(['show-privacy'])
</script>

<template>
    <footer class="site-footer">
        <div class="footer-inner">
            <img
                src="/assets/fabrizia-corsi-logo-transparent-white.gif"
                alt="Fabrizia Corsi"
                class="footer-logo"
            />

            <p class="footer-copy">
                &copy; {{ new Date().getFullYear() }} Fabrizia Corsi. All rights reserved.
            </p>

            <div class="footer-links">
                <a
                    href="https://www.mixcloud.com/djfabrizia/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link"
                    aria-label="Mixcloud"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                        aria-hidden="true"
                    >
                        <path
                            d="M19.75 10.68c-.08-3.12-2.64-5.64-5.77-5.64-1.95 0-3.66.97-4.73 2.45-.47-.19-.99-.3-1.53-.3-2.1 0-3.82 1.62-3.97 3.68C2.12 11.5 1 12.8 1 14.38 1 16.1 2.4 17.5 4.12 17.5h14.26C20.35 17.5 22 15.85 22 13.88c0-1.62-1.07-3-2.25-3.2zm0 5.32H4.12C3.22 16 2.5 15.28 2.5 14.38c0-1 .82-1.72 1.82-1.62l.68.07.07-.68c.12-1.45 1.34-2.57 2.81-2.57.42 0 .83.09 1.2.27l.8.37.46-.77c.82-1.37 2.3-2.28 3.97-2.28 2.56 0 4.64 2.04 4.65 4.6v.3l.3.05c.9.15 1.64 1.04 1.64 2.02.01 1.14-.97 2.06-2.21 2.06z"
                        />
                    </svg>
                </a>
                <a
                    href="https://www.instagram.com/fabriziacorsimusic/"
                    target="_blank"
                    rel="noopener noreferrer"
                    class="footer-link"
                    aria-label="Instagram"
                >
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        aria-hidden="true"
                    >
                        <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
                        <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                        <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
                    </svg>
                </a>
                <a href="mailto:hello@djfabrizia.com" class="footer-link" aria-label="Email">
                    <svg
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        stroke-width="1.8"
                        aria-hidden="true"
                    >
                        <path
                            d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                        />
                        <polyline points="22,6 12,13 2,6" />
                    </svg>
                </a>
                <button
                    class="footer-link privacy-btn"
                    aria-label="View privacy policy"
                    @click="$emit('show-privacy')"
                >
                    Privacy
                </button>
            </div>
        </div>
    </footer>
</template>

<style scoped>
    .site-footer {
        background: #080808;
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        padding: 2.5rem 1.5rem;
    }
    .footer-inner {
        max-width: 1280px;
        margin: 0 auto;
        display: flex;
        align-items: center;
        justify-content: space-between;
        flex-wrap: wrap;
        gap: 1rem;
    }
    /* 60% of full size (28px × 0.6 = ~17px) */
    .footer-logo {
        height: 17px;
        width: auto;
        opacity: 0.55;
    }
    .footer-copy {
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        color: #555;
        letter-spacing: 0.05em;
        margin: 0;
    }
    .footer-links {
        display: flex;
        align-items: center;
        gap: 1rem;
    }
    .footer-link {
        color: #555;
        text-decoration: none;
        transition: color 0.2s;
        display: flex;
        align-items: center;
        cursor: pointer;
    }
    .footer-link:hover {
        color: #b44fff;
    }
    .privacy-btn {
        background: none;
        border: none;
        font-family: 'Poppins', sans-serif;
        font-size: 0.72rem;
        letter-spacing: 0.05em;
        color: #555;
        cursor: pointer;
        transition: color 0.2s;
        padding: 0;
    }
    .privacy-btn:hover {
        color: #b44fff;
    }

    @media (max-width: 640px) {
        .footer-inner {
            flex-direction: column;
            align-items: center;
            text-align: center;
            gap: 1.25rem;
        }
        .footer-links {
            justify-content: center;
        }
    }
</style>
