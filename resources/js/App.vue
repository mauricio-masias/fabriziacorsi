<script setup>
    import { ref, onMounted, nextTick, provide } from 'vue'
    import { useApi } from '@/composables/useApi'
    import { mapHomePage, mapBioPage } from '@/api/v2Adapters'
    import PreLoader from '@/components/layout/PreLoader.vue'
    import NavBar from '@/components/layout/NavBar.vue'
    import CookieBanner from '@/components/layout/CookieBanner.vue'
    import Footer from '@/components/layout/Footer.vue'
    import HeroSection from '@/components/sections/HeroSection.vue'
    import AboutSection from '@/components/sections/AboutSection.vue'
    import GigsSection from '@/components/sections/GigsSection.vue'
    import MixesSection from '@/components/sections/MixesSection.vue'
    import ReleasesSection from '@/components/sections/ReleasesSection.vue'
    import ContactSection from '@/components/sections/ContactSection.vue'
    import PrivacyPage from '@/components/privacy/PrivacyPage.vue'

    const { fetchEndpoint } = useApi()

    const loading = ref(true)
    const showPrivacy = ref(false)

    // Phase 1 — above fold
    const musicStyles = ref([])
    const aboutData = ref(null)
    const contactData = ref(null)
    const mixesFirstPage = ref(null)
    const releasesFirstPage = ref(null)

    // Phase 2 — below fold
    const bioData = ref(null)
    const ukGigs = ref([])
    const intlGigs = ref([])

    provide('showPrivacy', showPrivacy)

    onMounted(async () => {
        try {
            const home = mapHomePage((await fetchEndpoint('/pages/home'))?.data)
            musicStyles.value = home.musicStyles
            aboutData.value = home.about
            contactData.value = home.contact
            mixesFirstPage.value = home.mixesFirstPage
            releasesFirstPage.value = home.releasesFirstPage
        } catch (e) {
            console.error('Homepage load failed', e)
        } finally {
            loading.value = false
        }

        nextTick(async () => {
            try {
                const bio = mapBioPage((await fetchEndpoint('/pages/bio'))?.data)
                bioData.value = bio.bio
                ukGigs.value = bio.ukGigs
                intlGigs.value = bio.intlGigs
            } catch (e) {
                console.error('Bio load failed', e)
            }
        })
    })
</script>

<template>
    <Transition name="loader">
        <PreLoader v-if="loading" />
    </Transition>

    <template v-if="!loading">
        <NavBar />

        <main>
            <HeroSection :music-styles="musicStyles" />
            <GigsSection :uk-gigs="ukGigs" :intl-gigs="intlGigs" />
            <AboutSection :about="aboutData" :bio="bioData" />
            <MixesSection :initial-page="mixesFirstPage" />
            <ReleasesSection :initial-page="releasesFirstPage" />
            <ContactSection :contact="contactData" />
        </main>

        <Footer @show-privacy="showPrivacy = true" />
        <CookieBanner @show-privacy="showPrivacy = true" />
    </template>

    <Transition name="overlay">
        <PrivacyPage v-if="showPrivacy" @close="showPrivacy = false" />
    </Transition>
</template>

<style>
    .loader-leave-active {
        transition: opacity 0.6s ease;
    }
    .loader-leave-to {
        opacity: 0;
    }
    .overlay-enter-active {
        transition: opacity 0.3s ease;
    }
    .overlay-leave-active {
        transition: opacity 0.3s ease;
    }
    .overlay-enter-from,
    .overlay-leave-to {
        opacity: 0;
    }
</style>
