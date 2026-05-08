<script setup>
    import { ref, onMounted, onUnmounted } from 'vue'

    const scrolled = ref(false)
    const showLogo = ref(false)
    const menuOpen = ref(false)

    const links = [
        { label: 'About', href: '#about' },
        { label: 'Gigs', href: '#gigs' },
        { label: 'Mixes', href: '#mixes' },
        { label: 'Releases', href: '#releases' },
        { label: 'Contact', href: '#contact' },
    ]

    const onScroll = () => {
        scrolled.value = window.scrollY > 60
    }

    let heroObserver
    onMounted(() => {
        window.addEventListener('scroll', onScroll, { passive: true })
        const hero = document.getElementById('hero')
        if (hero) {
            heroObserver = new IntersectionObserver(
                ([e]) => {
                    showLogo.value = !e.isIntersecting
                },
                { threshold: 0.15 },
            )
            heroObserver.observe(hero)
        }
    })
    onUnmounted(() => {
        window.removeEventListener('scroll', onScroll)
        heroObserver?.disconnect()
    })

    const nav = (href) => {
        menuOpen.value = false
        document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
    }
</script>

<template>
    <header :class="['navbar', scrolled && 'scrolled']" role="banner">
        <div class="nav-inner">
            <!-- Logo — hidden on hero, slides in when scrolled past -->
            <Transition name="logo-in">
                <a
                    v-if="showLogo"
                    href="#hero"
                    class="nav-logo"
                    aria-label="Fabrizia Corsi — back to top"
                    @click.prevent="nav('#hero')"
                >
                    <img
                        src="/assets/fabrizia-corsi-logo-transparent-white.gif"
                        alt="Fabrizia Corsi"
                    />
                </a>
            </Transition>

            <!-- Desktop nav -->
            <nav class="nav-links" aria-label="Site navigation">
                <a
                    v-for="link in links"
                    :key="link.href"
                    :href="link.href"
                    class="nav-link"
                    @click.prevent="nav(link.href)"
                >
                    {{ link.label }}
                </a>
                <a href="#contact" class="nav-cta" @click.prevent="nav('#contact')">Book me</a>
            </nav>

            <!-- Mobile hamburger -->
            <button
                class="hamburger"
                :aria-expanded="menuOpen"
                aria-controls="mobile-nav"
                aria-label="Toggle menu"
                @click="menuOpen = !menuOpen"
            >
                <span :class="['bar', menuOpen && 'open']"></span>
                <span :class="['bar', menuOpen && 'open']"></span>
                <span :class="['bar', menuOpen && 'open']"></span>
            </button>
        </div>

        <!-- Mobile menu -->
        <Transition name="menu">
            <nav v-if="menuOpen" id="mobile-nav" class="mobile-nav" aria-label="Mobile navigation">
                <a
                    v-for="link in links"
                    :key="link.href"
                    :href="link.href"
                    class="mobile-link"
                    @click.prevent="nav(link.href)"
                >
                    {{ link.label }}
                </a>
                <a href="#contact" class="mobile-cta" @click.prevent="nav('#contact')">Book me</a>
            </nav>
        </Transition>
    </header>
</template>

<style scoped>
    .navbar {
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        transition:
            background 0.3s ease,
            backdrop-filter 0.3s ease,
            border-bottom 0.3s ease;
    }
    .navbar.scrolled {
        background: rgba(8, 8, 8, 0.88);
        backdrop-filter: blur(12px);
    }

    .nav-inner {
        max-width: 1280px;
        margin: 0 auto;
        padding: 0 1.5rem;
        height: 64px;
        display: flex;
        align-items: center;
        justify-content: flex-end;
    }

    /* Logo at 70% of full size (full = ~36px height → 70% = ~25px) */
    .nav-logo {
        margin-right: auto;
    }
    .nav-logo img {
        height: 25px;
        width: auto;
    }

    .logo-in-enter-active {
        transition:
            opacity 0.3s ease,
            transform 0.3s ease;
    }
    .logo-in-leave-active {
        transition:
            opacity 0.2s ease,
            transform 0.2s ease;
    }
    .logo-in-enter-from {
        opacity: 0;
        transform: translateY(-6px);
    }
    .logo-in-leave-to {
        opacity: 0;
        transform: translateY(-4px);
    }

    .nav-links {
        display: flex;
        align-items: center;
        gap: 2rem;
    }

    .nav-link {
        font-family: 'Poppins', sans-serif;
        font-size: 0.8rem;
        letter-spacing: 0.12em;
        text-transform: uppercase;
        color: rgba(248, 250, 252, 0.7);
        text-decoration: none;
        transition: color 0.2s ease;
    }
    .nav-link:hover {
        color: #b44fff;
    }

    .nav-cta {
        font-family: 'Poppins', sans-serif;
        font-size: 0.75rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        text-decoration: none;
        padding: 0.45rem 1.25rem;
        border: 1px solid #b44fff;
        color: #b44fff;
        border-radius: 2px;
        transition:
            background 0.2s ease,
            color 0.2s ease;
    }
    .nav-cta:hover {
        background: #b44fff;
        color: #080808;
    }

    .hamburger {
        display: none;
        flex-direction: column;
        gap: 5px;
        background: none;
        border: none;
        cursor: pointer;
        padding: 0.25rem;
    }
    .bar {
        display: block;
        width: 24px;
        height: 2px;
        background: #f8fafc;
        border-radius: 2px;
        transition:
            transform 0.3s ease,
            opacity 0.3s ease;
        transform-origin: center;
    }
    .bar.open:nth-child(1) {
        transform: translateY(7px) rotate(45deg);
    }
    .bar.open:nth-child(2) {
        opacity: 0;
    }
    .bar.open:nth-child(3) {
        transform: translateY(-7px) rotate(-45deg);
    }

    .mobile-nav {
        display: flex;
        flex-direction: column;
        padding: 1rem 1.5rem 1.5rem;
        background: rgba(8, 8, 8, 0.96);
        border-top: 1px solid rgba(255, 255, 255, 0.06);
        backdrop-filter: blur(12px);
    }
    .mobile-link {
        font-family: 'Poppins', sans-serif;
        font-size: 0.95rem;
        letter-spacing: 0.1em;
        text-transform: uppercase;
        color: rgba(248, 250, 252, 0.8);
        text-decoration: none;
        padding: 0.75rem 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        transition: color 0.2s;
    }
    .mobile-link:hover {
        color: #b44fff;
    }
    .mobile-cta {
        margin-top: 1rem;
        text-align: center;
        font-family: 'Poppins', sans-serif;
        font-size: 0.85rem;
        letter-spacing: 0.15em;
        text-transform: uppercase;
        text-decoration: none;
        padding: 0.65rem 1.5rem;
        border: 1px solid #b44fff;
        color: #b44fff;
        transition:
            background 0.2s,
            color 0.2s;
    }
    .mobile-cta:hover {
        background: #b44fff;
        color: #080808;
    }

    .menu-enter-active,
    .menu-leave-active {
        transition:
            opacity 0.25s ease,
            transform 0.25s ease;
    }
    .menu-enter-from,
    .menu-leave-to {
        opacity: 0;
        transform: translateY(-8px);
    }

    @media (max-width: 768px) {
        .nav-links {
            display: none;
        }
        .hamburger {
            display: flex;
        }
    }
</style>
