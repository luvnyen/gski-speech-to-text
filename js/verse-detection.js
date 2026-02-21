/**
 * Bible verse detection — regex-based matching for Indonesian Bible references.
 * Handles patterns like "Kejadian 3:5", "pasal ke tiga ayat lima", etc.
 */

const BOOK_CANONICAL = Object.fromEntries(
    BIBLE_BOOKS.map(b => [b.toLowerCase(), b])
);

function buildVerseRegex() {
    const escaped = BIBLE_BOOKS
        .map(book => book.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .sort((a, b) => b.length - a.length);
    const n = NUM_PAT;
    return new RegExp(
        `(${escaped.join('|')})` +
        `(?:\\s+(?:pasal\\s+(?:yang\\s+)?)?(?:${n})(?:\\s+(?:dan\\s+)?ayat\\s+(?:yang\\s+)?(?:${n})|\\s*:\\s*(?:${n})|\\s+(?:${n}))?)?`,
        'gi'
    );
}

function buildCompleteVerseRegex() {
    const escaped = BIBLE_BOOKS
        .map(book => book.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
        .sort((a, b) => b.length - a.length);
    const n = NUM_PAT;
    return new RegExp(
        `(${escaped.join('|')})\\s+(?:pasal\\s+(?:yang\\s+)?)?(${n})(?:\\s+(?:dan\\s+)?ayat\\s+(?:yang\\s+)?|\\s*:\\s*|\\s+)(${n})`,
        'gi'
    );
}

function normalizeNumber(str) {
    const cleaned = str.trim().toLowerCase()
        .replace(/^yang\s+/, '').replace(/^ke[-\s]?/, '').trim()
        .replace(/\s+/g, ' ');
    if (/^\d+$/.test(cleaned)) return cleaned;
    return WORD_NUM_MAP[cleaned] ?? null;
}

function extractCompleteVerses(text) {
    const re = new RegExp(COMPLETE_VERSE_RE.source, 'gi');
    const refs = [];
    let match;
    while ((match = re.exec(text)) !== null) {
        const chapter = normalizeNumber(match[2]);
        const verse   = normalizeNumber(match[3]);
        if (!chapter || !verse) continue;
        refs.push({
            book: BOOK_CANONICAL[match[1].toLowerCase()] ?? match[1],
            chapter,
            verse,
        });
    }
    return refs;
}

function buildVerseKey(ref) {
    return `${ref.book.toLowerCase()} ${ref.chapter}:${ref.verse}`;
}

function sanitizeHtml(text) {
    return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function highlightVerses(text) {
    return sanitizeHtml(text).replace(VERSE_RE, '<span class="verse-ref">$&</span>');
}

const VERSE_RE          = buildVerseRegex();
const COMPLETE_VERSE_RE = buildCompleteVerseRegex();
