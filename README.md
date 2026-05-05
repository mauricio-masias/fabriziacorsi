# Fabrizia Corsi — DJ & Producer Website

Single-page promotional website for London-based DJ and producer Fabrizia Corsi. Underground electronic music aesthetic with a dark, club-inspired visual identity.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Backend | Laravel 13 / PHP 8.3 |
| Frontend | Vue 3 (Composition API, `<script setup>`) |
| Styling | Tailwind CSS v4 + scoped CSS |
| Build | Vite 8 + `@vitejs/plugin-vue` |
| Testing | Vitest + `@vue/test-utils` (unit), Playwright (e2e) |
| Linting | ESLint (flat config) + Prettier |

## Sections

- **Hero** — Full-screen with B&W background photo, scan-line overlay, aurora blobs, EQ visualiser, logo and music style tags
- **About** — Bio columns, Instagram follow button, specialties grid (Vinyls & USB, Electronic Drums Live, Worldwide, Producer), 20+ years career badge
- **Gigs** — UK venues marquee ticker / International countries accordion, toggled by tab
- **Mixes** — Mixcloud-connected grid with B&W + scan-line card images, colour on hover
- **Releases** — Track grid with streaming links (Spotify, Apple Music, Amazon, Traxsource)
- **Contact** — Contact section

## Project Structure

```
resources/
  js/
    components/
      layout/       # NavBar, Footer, PreLoader, CookieBanner
      sections/     # One Vue component per page section
      gigs/         # UkGigsMarquee, InternationalGigs
      mixes/        # MixCard
      releases/     # ReleaseCard
      privacy/      # PrivacyPage
    composables/    # useApi, useReveal, useCookieConsent
    config/         # api.js (base URL + GTM ID)
  css/
    app.css         # Tailwind v4 theme, global utilities, keyframes
public_html/
  assets/           # Static images and logo
```

## Environment Variables

```env
VITE_DJ_API_URL=https://your-api-host/api/v1   # External DJ data API
VITE_GTM_ID=GTM-XXXXXXX                         # Google Tag Manager
```

The app fetches all content (music styles, about text, gigs, mixes, releases) from an external API at `/api/v1`. Endpoints used: `/homepage`, `/bio`, `/mixes`, `/releases`.

## Local Development

```bash
# Install dependencies
composer install
npm install

# Start dev server (Vite + Laravel)
npm run dev
php artisan serve

# Or run both together
npx concurrently "php artisan serve" "npm run dev"
```

## Build

```bash
npm run build
```

Output goes to `public_html/build/` via the Laravel Vite plugin.

## Testing

```bash
# Unit tests (Vitest)
npm run test:run

# Unit tests with coverage
npm run test:coverage

# E2E tests (Playwright)
npm run test:e2e
```

## Code Quality

```bash
# Format (Prettier)
npm run format

# Lint + autofix (ESLint)
npm run lint
```

## Design System

- **Colors** — `#080808` background, `#b44fff` purple, `#f72585` pink, `#f5c040` gold
- **Fonts** — Bebas Neue (display), Righteous (headings), Poppins (body)
- **Effects** — Animated scan lines on card images, aurora gradient blobs, dot grid, CSS glitch text, scroll-reveal on sections
- **Cards** — B&W + scan lines at rest, full colour on hover
