/**
 * Pure adapters translating API v2 responses into the shapes the components
 * already consume (the v1 shapes). Every function is defensive: missing blocks,
 * nulls and malformed input yield safe empty values instead of throwing.
 */

const RELEASE_LINK_FIELDS = {
    spotify: 'spoty_url',
    itunes: 'itune_url',
    amazon_music: 'amazon_url',
    traxsource: 'trax_url',
}

const asArray = (value) => (Array.isArray(value) ? value : [])
const asString = (value) => (typeof value === 'string' ? value : '')
const genreNames = (genres) =>
    asArray(genres)
        .map((g) => g?.name)
        .filter((name) => typeof name === 'string' && name)

/**
 * Find a block on a v2 page and return its `data`.
 * @param {{ blocks?: Array<{ type: string, data: object }> } | null | undefined} page
 * @param {string} type Block type, e.g. 'booking'.
 * @param {string} [collection] For `collection_feed` blocks, the collection to match.
 * @returns {object | null}
 */
export function findBlock(page, type, collection) {
    const block = asArray(page?.blocks).find(
        (b) =>
            b?.type === type &&
            b.data &&
            (collection === undefined || b.data.collection === collection),
    )
    return block?.data ?? null
}

/**
 * Convert an ISO timestamp to MixCard's 'YYYY MM DD' format, using the date part
 * as written so the day never shifts with the viewer's timezone.
 * @param {string} iso
 * @returns {string}
 */
const toMixDate = (iso) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})/.exec(asString(iso))
    return match ? `${match[1]} ${match[2]} ${match[3]}` : ''
}

/**
 * Map a v2 mix item to the MixCard `mix` prop shape.
 * @param {object | null | undefined} item
 * @returns {{ name: string, url: string, img: string, img_small: string, date: string, audio_length: string, tags: string[] }}
 */
export function mapMix(item) {
    return {
        name: asString(item?.short_name) || asString(item?.title),
        url: asString(item?.key),
        img: asString(item?.image),
        img_small: asString(item?.image_small),
        date: toMixDate(item?.released_at),
        audio_length: asString(item?.duration),
        tags: genreNames(item?.genres),
    }
}

/**
 * Map a v2 release item to the ReleaseCard `track` prop shape.
 * @param {object | null | undefined} item
 * @returns {object} v1 release shape (all string fields, '' when missing).
 */
export function mapRelease(item) {
    const links = asArray(item?.links).reduce((acc, link) => {
        const field = RELEASE_LINK_FIELDS[link?.platform]
        return field && !acc[field] ? { ...acc, [field]: asString(link.url) } : acc
    }, {})
    const year = item?.year

    return {
        img: asString(item?.cover?.url),
        title: asString(item?.title),
        bpm: asString(item?.bpm),
        music_style: genreNames(item?.genres).join(', '),
        record_label: asString(item?.record_label?.name),
        year: year === null || year === undefined ? '' : String(year),
        time: asString(item?.duration),
        spoty_url: links.spoty_url ?? '',
        itune_url: links.itune_url ?? '',
        amazon_url: links.amazon_url ?? '',
        trax_url: links.trax_url ?? '',
        track: asString(item?.track?.url),
    }
}

/**
 * Map a v2 paginated collection (`{ data, meta }`) to the section state shape.
 * @param {{ data?: object[], meta?: { current_page?: number, last_page?: number } } | null | undefined} response
 * @param {(item: object) => object} mapItem Item mapper, e.g. mapMix.
 * @returns {{ tracks: object[], currentPage: number, totalPages: number, hasMore: boolean }}
 */
export function mapCollection(response, mapItem) {
    const currentPage = Number(response?.meta?.current_page) || 1
    const totalPages = Number(response?.meta?.last_page) || 1
    return {
        tracks: asArray(response?.data).map(mapItem),
        currentPage,
        totalPages,
        hasMore: currentPage < totalPages,
    }
}

const mapTwoColumn = (data) =>
    data
        ? {
              title: asString(data.title),
              content_left: asString(data.left),
              content_right: asString(data.right),
          }
        : null

const mapFirstPage = (page, collection, mapItem) => {
    const feed = findBlock(page, 'collection_feed', collection)
    return feed?.first_page ? mapCollection(feed.first_page, mapItem) : null
}

/**
 * Map the v2 `home` page to the data App.vue hands to its sections.
 * @param {object | null | undefined} page The `data` of GET /pages/home.
 * @returns {{ musicStyles: string[], about: object | null, contact: object | null, mixesFirstPage: object | null, releasesFirstPage: object | null }}
 */
export function mapHomePage(page) {
    const booking = findBlock(page, 'booking')
    return {
        musicStyles: asArray(findBlock(page, 'hero_rotator')?.styles),
        about: mapTwoColumn(findBlock(page, 'rich_two_column')),
        contact: booking
            ? {
                  title: asString(booking.title),
                  content_left: asString(booking.left),
                  content_right: asString(booking.right),
                  content_success: asString(booking.success),
              }
            : null,
        mixesFirstPage: mapFirstPage(page, 'mixes', mapMix),
        releasesFirstPage: mapFirstPage(page, 'releases', mapRelease),
    }
}

/**
 * Map the v2 `bio` page to bio text, UK venues and international gigs.
 * @param {object | null | undefined} page The `data` of GET /pages/bio.
 * @returns {{ bio: object | null, ukGigs: string[], intlGigs: Array<{ title: string, active: boolean, cities: Array<{ name: string, clubs: string[] }> }> }}
 */
export function mapBioPage(page) {
    const countries = asArray(findBlock(page, 'venues_international')?.countries)
    return {
        bio: mapTwoColumn(findBlock(page, 'rich_two_column')),
        ukGigs: asArray(findBlock(page, 'venues_uk')?.venues),
        intlGigs: countries.map((c) => ({
            title: asString(c?.country),
            active: c?.is_default === true,
            cities: asArray(c?.cities).map((city) => ({
                name: asString(city?.name),
                clubs: asArray(city?.clubs),
            })),
        })),
    }
}

/**
 * Extract the legal HTML from the v2 `privacy-policy` page.
 * @param {object | null | undefined} page The `data` of GET /pages/privacy-policy.
 * @returns {string}
 */
export function mapPrivacyPage(page) {
    return asString(findBlock(page, 'legal_content')?.html)
}
