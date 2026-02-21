/**
 * DOM rendering, theme, and UI state management.
 */

const committed     = [];
const sessionVerses = [];
let interim         = '';

const transcriptHistory = document.getElementById('transcriptHistory');
const transcriptActive  = document.getElementById('transcriptActive');
const verseLogList      = document.getElementById('verseLogList');
const verseCountEl      = document.getElementById('verseCount');
const placeholder       = document.getElementById('placeholder');
const dot               = document.getElementById('dot');
const statusText        = document.getElementById('statusText');
const ppBadge           = document.getElementById('ppBadge');
const btnStart          = document.getElementById('btnStart');
const btnStop           = document.getElementById('btnStop');
const btnClear          = document.getElementById('btnClear');
const btnTheme          = document.getElementById('btnTheme');
const scrollNav         = document.getElementById('scrollNav');
const btnScrollTop      = document.getElementById('btnScrollTop');
const btnScrollBottom   = document.getElementById('btnScrollBottom');

function createTranscriptLine(text, isInterim) {
    const div = document.createElement('div');
    div.className = isInterim ? 'line interim' : 'line';
    if (isInterim) {
        div.textContent = text;
    } else {
        div.innerHTML = highlightVerses(text);
    }
    return div;
}

function applyHistoryFade() {
    const opacities = document.documentElement.dataset.theme === 'light'
        ? HISTORY_FADE_LIGHT : HISTORY_FADE_DARK;
    const lines = transcriptHistory.querySelectorAll('.line:not(.placeholder)');
    const total = lines.length;
    const start = Math.max(0, total - opacities.length);
    for (let i = start; i < total; i++) {
        lines[i].style.opacity = opacities[total - 1 - i];
    }
    if (start > 0 && lines[start - 1].style.opacity !== String(opacities[opacities.length - 1])) {
        for (let i = 0; i < start; i++) lines[i].style.opacity = opacities[opacities.length - 1];
    }
}

function scrollHistoryToBottom() {
    transcriptHistory.scrollTo({ top: transcriptHistory.scrollHeight, behavior: 'smooth' });
}

function scrollHistoryToTop() {
    transcriptHistory.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateScrollNavVisibility() {
    const isScrollable = transcriptHistory.scrollHeight > transcriptHistory.clientHeight;
    scrollNav.classList.toggle('visible', isScrollable);
}

transcriptHistory.addEventListener('scroll', updateScrollNavVisibility);
btnScrollTop.addEventListener('click', scrollHistoryToTop);
btnScrollBottom.addEventListener('click', scrollHistoryToBottom);

let lastRenderedInterim = '';

function updateActiveArea() {
    if (interim === lastRenderedInterim) return;
    lastRenderedInterim = interim;
    transcriptActive.innerHTML = '';
    if (interim) transcriptActive.appendChild(createTranscriptLine(interim, true));
}

function appendLineToHistory(text) {
    placeholder.style.display = 'none';
    transcriptHistory.appendChild(createTranscriptLine(text, false));
    applyHistoryFade();
    scrollHistoryToBottom();
    updateScrollNavVisibility();
}

function render() {
    transcriptHistory.querySelectorAll('.line:not(.placeholder)').forEach(el => el.remove());
    placeholder.style.display = (committed.length === 0 && !interim) ? '' : 'none';
    committed.forEach(text => transcriptHistory.appendChild(createTranscriptLine(text, false)));
    applyHistoryFade();
    scrollHistoryToBottom();
    updateActiveArea();
}

function updateStatus(state, text) {
    dot.className          = state ? `dot ${state}` : 'dot';
    statusText.textContent = text;
}

function updateProPresenterBadge(state, text) {
    ppBadge.className        = state ? `pp-badge ${state}` : 'pp-badge';
    ppBadge.textContent      = text;
    ppBadge.style.visibility = text ? 'visible' : 'hidden';
}

function setButtonsRunning() {
    btnStart.disabled = true;
    btnStop.disabled  = false;
    btnClear.disabled = true;
}

function setButtonsStopped() {
    btnStart.disabled = false;
    btnStop.disabled  = true;
    btnClear.disabled = false;
}

function createVerseLogEntry(ref) {
    const entry = document.createElement('div');
    entry.className = 'verse-log-entry';
    entry.title = 'Klik untuk copy';

    const label = document.createElement('span');
    label.textContent = `${ref.book} ${ref.chapter}:${ref.verse}`;

    const hint = document.createElement('span');
    hint.className = 'copy-hint';
    hint.textContent = 'copy';

    entry.append(label, hint);
    entry.addEventListener('click', () => {
        navigator.clipboard.writeText(label.textContent);
        hint.textContent = '✓';
        setTimeout(() => { hint.textContent = 'copy'; }, 1500);
    });
    return entry;
}

function updateVerseCount() {
    verseCountEl.textContent = sessionVerses.length > 0 ? sessionVerses.length : '';
}

function renderVerseLog() {
    verseLogList.innerHTML = '';
    if (sessionVerses.length === 0) {
        verseLogList.innerHTML = '<div class="verse-log-empty">–</div>';
        updateVerseCount();
        return;
    }
    sessionVerses.forEach(ref => verseLogList.appendChild(createVerseLogEntry(ref)));
    updateVerseCount();
}

function addVersesToLog(refs) {
    const newRefs = refs.filter(ref => !sessionVerses.some(v => v.key === buildVerseKey(ref)));
    if (newRefs.length === 0) return;
    if (sessionVerses.length === 0) verseLogList.innerHTML = '';
    newRefs.forEach(ref => {
        sessionVerses.push({ ...ref, key: buildVerseKey(ref) });
        const entry = createVerseLogEntry(ref);
        entry.classList.add('verse-entry-new');
        verseLogList.appendChild(entry);
    });
    updateVerseCount();
}

function applyTheme(theme) {
    document.documentElement.dataset.theme = theme;
    btnTheme.textContent = theme === 'light' ? '☾' : '☀';
    localStorage.setItem('stt-theme', theme);
    applyHistoryFade();
    if (!running) drawIdleWaveform();
}

function toggleTheme() {
    applyTheme(document.documentElement.dataset.theme === 'light' ? 'dark' : 'light');
}
