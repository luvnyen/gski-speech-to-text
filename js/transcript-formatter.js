/**
 * Smart text formatting for ProPresenter display.
 * Truncates long text to the last MAX_DISPLAY_WORDS words
 * so ProPresenter shows a single readable line.
 */

const MAX_DISPLAY_WORDS = 12;

/**
 * Truncate transcript text for ProPresenter display.
 * When the speaker talks nonstop, only the most recent words are kept.
 *
 * @param {string} text — raw transcript sentence
 * @returns {string} — truncated text (last MAX_DISPLAY_WORDS words)
 */
function formatForDisplay(text) {
    if (!text) return '';
    const words = text.split(/\s+/);
    if (words.length <= MAX_DISPLAY_WORDS) return text;
    return words.slice(-MAX_DISPLAY_WORDS).join(' ');
}
