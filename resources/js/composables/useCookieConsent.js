import { ref, readonly } from 'vue'
import { GTM_ID } from '@/config/api'

const STORAGE_KEY = 'fc_cookie_consent'

const consent = ref(localStorage.getItem(STORAGE_KEY))

function injectGTM() {
    if (!GTM_ID || GTM_ID === 'GTM-XXXXXXX') return
    if (document.getElementById('gtm-script')) return

    const script = document.createElement('script')
    script.id = 'gtm-script'
    script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${GTM_ID}');`
    document.head.appendChild(script)

    const ns = document.createElement('noscript')
    ns.id = 'gtm-noscript'
    const iframe = document.createElement('iframe')
    iframe.src = `https://www.googletagmanager.com/ns.html?id=${GTM_ID}`
    iframe.height = '0'
    iframe.width = '0'
    iframe.style.cssText = 'display:none;visibility:hidden'
    ns.appendChild(iframe)
    document.body.insertBefore(ns, document.body.firstChild)
}

export function useCookieConsent() {
    const acceptAll = () => {
        consent.value = 'all'
        localStorage.setItem(STORAGE_KEY, 'all')
        injectGTM()
    }

    const acceptEssential = () => {
        consent.value = 'essential'
        localStorage.setItem(STORAGE_KEY, 'essential')
    }

    const hasConsent = readonly(consent)
    const needsBanner = () => !consent.value

    // Re-inject GTM on page refresh if already accepted
    if (consent.value === 'all') injectGTM()

    return { hasConsent, needsBanner, acceptAll, acceptEssential }
}
