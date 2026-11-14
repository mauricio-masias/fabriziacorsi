import { describe, it, expect } from 'vitest'
import {
    findBlock,
    mapMix,
    mapRelease,
    mapCollection,
    mapHomePage,
    mapBioPage,
    mapPrivacyPage,
} from '@/api/v2Adapters'

// ─── Fixtures (hand-written, v2 contract shapes) ─────────────────

const v2Mix = {
    id: 202,
    title: 'Melodic Techno Demo Mix Fabrizia Corsi',
    short_name: 'Melodic Techno Demo',
    key: '/djfabrizia/melodic-techno-demo-mix-fabrizia-corsi/',
    url: 'https://www.mixcloud.com/djfabrizia/melodic-techno-demo-mix-fabrizia-corsi/',
    image: 'https://img.test/320.jpg',
    image_small: 'https://img.test/50.jpg',
    released_at: '2026-02-04T18:27:23+00:00',
    duration: '60:10',
    genres: [
        { name: 'Melodic techno', slug: 'melodic-techno' },
        { name: 'Progressive house', slug: 'progressive-house' },
    ],
}

const v2Release = {
    id: 55,
    title: 'Dancer',
    cover: { url: 'https://img.test/dancer.jpg', srcset: null, alt: 'Dancer' },
    track: { url: 'https://cdn.test/dancer.mp3', mime: 'audio/mpeg' },
    duration: '7:14',
    bpm: '124bpm',
    year: 2019,
    record_label: { name: 'Lump records', slug: 'lump-records' },
    genres: [{ name: 'Afro house', slug: 'afro-house' }],
    links: [
        { platform: 'spotify', label: 'Listen on Spotify', url: 'https://open.spotify.com/a' },
        { platform: 'itunes', label: 'Listen on iTunes', url: 'https://music.apple.com/b' },
        { platform: 'amazon_music', label: 'Download on Amazon', url: 'https://amazon.test/c' },
        { platform: 'traxsource', label: 'Download on Traxsource', url: 'https://trax.test/d' },
    ],
}

const feed = (collection, items, meta) => ({
    type: 'collection_feed',
    data: {
        collection,
        title: collection,
        per_page: 6,
        display: true,
        first_page: { data: items, meta, links: {} },
    },
})

const homePage = {
    slug: 'home',
    blocks: [
        { type: 'hero_rotator', data: { styles: ['House', 'Techno'] } },
        {
            type: 'rich_two_column',
            data: { title: 'About me', left: '<p>L</p>', right: '<p>R</p>', left_link: null },
        },
        feed('mixes', [v2Mix], { current_page: 1, last_page: 6, per_page: 6, total: 31 }),
        feed('releases', [v2Release], { current_page: 1, last_page: 1, per_page: 6, total: 1 }),
        { type: 'collection_feed', data: { collection: 'playlists', display: false } },
        {
            type: 'booking',
            data: { title: 'Contact<br>me', left: '<p>Hi</p>', right: null, success: '<p>Thx</p>' },
        },
    ],
}

const bioPage = {
    slug: 'bio',
    blocks: [
        { type: 'rich_two_column', data: { title: 'Bio', left: '<p>BL</p>', right: '<p>BR</p>' } },
        { type: 'venues_uk', data: { title: 'UK Gigs', venues: ['Cargo', 'Egg'] } },
        {
            type: 'venues_international',
            data: {
                title: 'Inter<br>national',
                countries: [
                    {
                        country: 'Italy',
                        is_default: true,
                        cities: [{ name: 'Rome', clubs: ['Goa', 'Qube'] }],
                    },
                    { country: 'Egypt', is_default: false, cities: [{ name: 'Alexandria' }] },
                ],
            },
        },
    ],
}

// ─── findBlock ───────────────────────────────────────────────────

describe('findBlock', () => {
    it('returns the data of the first block of the given type', () => {
        expect(findBlock(homePage, 'hero_rotator')).toEqual({ styles: ['House', 'Techno'] })
    })

    it('matches collection feeds by collection', () => {
        expect(findBlock(homePage, 'collection_feed', 'releases').collection).toBe('releases')
        expect(findBlock(homePage, 'collection_feed', 'mixes').collection).toBe('mixes')
    })

    it('returns null when the block is missing', () => {
        expect(findBlock(homePage, 'nope')).toBeNull()
        expect(findBlock(homePage, 'collection_feed', 'videos')).toBeNull()
    })

    it('returns null for a null/undefined page or missing blocks', () => {
        expect(findBlock(null, 'booking')).toBeNull()
        expect(findBlock(undefined, 'booking')).toBeNull()
        expect(findBlock({}, 'booking')).toBeNull()
        expect(findBlock({ blocks: [null, { type: 'booking' }] }, 'booking')).toBeNull()
    })
})

// ─── mapMix ──────────────────────────────────────────────────────

describe('mapMix', () => {
    it('maps a v2 mix item to the v1 MixCard shape', () => {
        expect(mapMix(v2Mix)).toEqual({
            name: 'Melodic Techno Demo',
            url: '/djfabrizia/melodic-techno-demo-mix-fabrizia-corsi/',
            img: 'https://img.test/320.jpg',
            img_small: 'https://img.test/50.jpg',
            date: '2026 02 04',
            audio_length: '60:10',
            tags: ['Melodic techno', 'Progressive house'],
        })
    })

    it('takes the date from the ISO string without timezone shifting', () => {
        expect(mapMix({ ...v2Mix, released_at: '2026-01-01T00:30:00+02:00' }).date).toBe(
            '2026 01 01',
        )
    })

    it('formats date-only, null and non-string released_at values', () => {
        expect(mapMix({ ...v2Mix, released_at: '2023-10-31' }).date).toBe('2023 10 31')
        expect(mapMix({ ...v2Mix, released_at: null }).date).toBe('')
        expect(mapMix({ ...v2Mix, released_at: 1700000000 }).date).toBe('')
    })

    it('falls back to title when short_name is empty', () => {
        expect(mapMix({ ...v2Mix, short_name: '' }).name).toBe(v2Mix.title)
    })

    it('falls back to title when short_name is missing', () => {
        expect(mapMix({ ...v2Mix, short_name: null }).name).toBe(v2Mix.title)
    })

    it('returns safe empty values for missing fields', () => {
        expect(mapMix({})).toEqual({
            name: '',
            url: '',
            img: '',
            img_small: '',
            date: '',
            audio_length: '',
            tags: [],
        })
        expect(mapMix(null).tags).toEqual([])
        expect(mapMix({ released_at: 'garbage', genres: [null, { slug: 'x' }] })).toMatchObject({
            date: '',
            tags: [],
        })
    })
})

// ─── mapRelease ──────────────────────────────────────────────────

describe('mapRelease', () => {
    it('maps a v2 release item to the v1 ReleaseCard shape', () => {
        expect(mapRelease(v2Release)).toEqual({
            img: 'https://img.test/dancer.jpg',
            title: 'Dancer',
            bpm: '124bpm',
            music_style: 'Afro house',
            record_label: 'Lump records',
            year: '2019',
            time: '7:14',
            spoty_url: 'https://open.spotify.com/a',
            itune_url: 'https://music.apple.com/b',
            amazon_url: 'https://amazon.test/c',
            trax_url: 'https://trax.test/d',
            track: 'https://cdn.test/dancer.mp3',
        })
    })

    it('joins multiple genres into one style string', () => {
        const genres = [{ name: 'House' }, { name: 'Tech house' }]
        expect(mapRelease({ ...v2Release, genres }).music_style).toBe('House, Tech house')
    })

    it('handles null cover, record_label, track and partial links', () => {
        const mapped = mapRelease({
            ...v2Release,
            cover: null,
            record_label: null,
            track: null,
            links: [{ platform: 'itunes', url: 'https://music.apple.com/x' }],
        })
        expect(mapped).toMatchObject({
            img: '',
            record_label: '',
            track: '',
            spoty_url: '',
            itune_url: 'https://music.apple.com/x',
            amazon_url: '',
            trax_url: '',
        })
    })

    it('keeps the first link per platform and ignores unknown platforms', () => {
        const links = [
            { platform: 'soundcloud', url: 'https://soundcloud.test/x' },
            { platform: 'spotify', url: 'https://open.spotify.com/first' },
            { platform: 'spotify', url: 'https://open.spotify.com/second' },
            null,
        ]
        const mapped = mapRelease({ ...v2Release, links })
        expect(mapped.spoty_url).toBe('https://open.spotify.com/first')
        expect(Object.values(mapped)).not.toContain('https://soundcloud.test/x')
    })

    it('stringifies the year so ReleaseCard can trim it', () => {
        expect(mapRelease({ ...v2Release, year: '2021' }).year).toBe('2021')
        expect(mapRelease({ ...v2Release, year: null }).year).toBe('')
        expect(typeof mapRelease(v2Release).year).toBe('string')
    })

    it('returns safe empty values for an empty or null item', () => {
        const empty = {
            img: '',
            title: '',
            bpm: '',
            music_style: '',
            record_label: '',
            year: '',
            time: '',
            spoty_url: '',
            itune_url: '',
            amazon_url: '',
            trax_url: '',
            track: '',
        }
        expect(mapRelease({})).toEqual(empty)
        expect(mapRelease(null)).toEqual(empty)
    })
})

// ─── mapCollection ───────────────────────────────────────────────

describe('mapCollection', () => {
    it('maps items and pagination meta', () => {
        const res = { data: [v2Mix], meta: { current_page: 2, last_page: 6 } }
        const out = mapCollection(res, mapMix)
        expect(out.tracks).toHaveLength(1)
        expect(out.tracks[0].name).toBe('Melodic Techno Demo')
        expect(out).toMatchObject({ currentPage: 2, totalPages: 6, hasMore: true })
    })

    it('has no more pages on the last page', () => {
        const res = { data: [], meta: { current_page: 4, last_page: 4 } }
        expect(mapCollection(res, mapRelease)).toEqual({
            tracks: [],
            currentPage: 4,
            totalPages: 4,
            hasMore: false,
        })
    })

    it('returns a safe empty page for null or malformed responses', () => {
        const empty = { tracks: [], currentPage: 1, totalPages: 1, hasMore: false }
        expect(mapCollection(null, mapMix)).toEqual(empty)
        expect(mapCollection(undefined, mapMix)).toEqual(empty)
        expect(mapCollection({ data: 'x', meta: null }, mapMix)).toEqual(empty)
    })
})

// ─── mapHomePage ─────────────────────────────────────────────────

describe('mapHomePage', () => {
    it('maps every block the site uses', () => {
        const out = mapHomePage(homePage)
        expect(out.musicStyles).toEqual(['House', 'Techno'])
        expect(out.about).toEqual({
            title: 'About me',
            content_left: '<p>L</p>',
            content_right: '<p>R</p>',
        })
        expect(out.contact).toEqual({
            title: 'Contact<br>me',
            content_left: '<p>Hi</p>',
            content_right: '',
            content_success: '<p>Thx</p>',
        })
        expect(out.mixesFirstPage).toMatchObject({ currentPage: 1, totalPages: 6, hasMore: true })
        expect(out.mixesFirstPage.tracks[0].url).toBe(v2Mix.key)
        expect(out.releasesFirstPage).toMatchObject({ totalPages: 1, hasMore: false })
        expect(out.releasesFirstPage.tracks[0].title).toBe('Dancer')
    })

    it('returns safe empty values when blocks are missing', () => {
        const empty = {
            musicStyles: [],
            about: null,
            contact: null,
            mixesFirstPage: null,
            releasesFirstPage: null,
        }
        expect(mapHomePage({ blocks: [] })).toEqual(empty)
        expect(mapHomePage(null)).toEqual(empty)
        expect(mapHomePage(undefined)).toEqual(empty)
    })

    it('does not take the mixes feed from another collection_feed block', () => {
        const page = { blocks: homePage.blocks.filter((b) => b.data?.collection !== 'mixes') }
        const out = mapHomePage(page)
        expect(out.mixesFirstPage).toBeNull()
        expect(out.releasesFirstPage.tracks[0].title).toBe('Dancer')
    })

    it('returns null first pages when a feed has no first_page', () => {
        const page = { blocks: [{ type: 'collection_feed', data: { collection: 'mixes' } }] }
        expect(mapHomePage(page).mixesFirstPage).toBeNull()
    })
})

// ─── mapBioPage ──────────────────────────────────────────────────

describe('mapBioPage', () => {
    it('maps bio, UK venues and international countries', () => {
        const out = mapBioPage(bioPage)
        expect(out.bio).toEqual({
            title: 'Bio',
            content_left: '<p>BL</p>',
            content_right: '<p>BR</p>',
        })
        expect(out.ukGigs).toEqual(['Cargo', 'Egg'])
        expect(out.intlGigs).toEqual([
            { title: 'Italy', active: true, cities: [{ name: 'Rome', clubs: ['Goa', 'Qube'] }] },
            { title: 'Egypt', active: false, cities: [{ name: 'Alexandria', clubs: [] }] },
        ])
    })

    it('returns safe empty values when blocks are missing', () => {
        const empty = { bio: null, ukGigs: [], intlGigs: [] }
        expect(mapBioPage({ blocks: [] })).toEqual(empty)
        expect(mapBioPage(null)).toEqual(empty)
    })

    it('tolerates countries without cities', () => {
        const page = {
            blocks: [{ type: 'venues_international', data: { countries: [{ country: 'X' }] } }],
        }
        expect(mapBioPage(page).intlGigs).toEqual([{ title: 'X', active: false, cities: [] }])
    })
})

// ─── mapPrivacyPage ──────────────────────────────────────────────

describe('mapPrivacyPage', () => {
    it('returns the legal html', () => {
        const page = { blocks: [{ type: 'legal_content', data: { html: '<h2>Policy</h2>' } }] }
        expect(mapPrivacyPage(page)).toBe('<h2>Policy</h2>')
    })

    it('returns an empty string when missing', () => {
        expect(mapPrivacyPage({ blocks: [] })).toBe('')
        expect(mapPrivacyPage(null)).toBe('')
    })
})
