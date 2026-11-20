const TITLE_STYLE = 'font: 700 28px Raleway, sans-serif; color: #c51b08;'
const BODY_STYLE = 'font: 13px monospace; color: #888;'

/**
 * The text and `%c` styles printed to the browser console, kept separate so it can be tested.
 *
 * @returns {[string, string, string]}
 */
export function signatureMessage() {
    return [
        '%cDJ Fabrizia Corsi%c\nDJ / Producer, London.\nDesigned & built by Mauricio Masias.\nhttps://masias.co.uk',
        TITLE_STYLE,
        BODY_STYLE,
    ]
}

/** Prints the site signature once to the browser console (for anyone opening DevTools). */
export function printSignature() {
    console.log(...signatureMessage())
}
