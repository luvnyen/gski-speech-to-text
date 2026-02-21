/**
 * Application orchestrator — wires modules, lifecycle, and event listeners.
 */

function handleTranscriptUpdate() {
    updateActiveArea();
    const displayText = interim || committed.at(-1) || null;
    if (displayText) scheduleProPresenterUpdate(displayText);
}

function appendCommittedText(transcript) {
    committed.push(transcript);
    addVersesToLog(extractCompleteVerses(transcript));
    appendLineToHistory(transcript);
}

async function start() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SR) { alert('Web Speech API tidak tersedia.\nGunakan Chrome atau Edge terbaru.'); return; }

    committed.length = 0;
    sessionVerses.length = 0;
    interim = '';
    running = true;
    document.title = TITLE_LIVE;
    placeholder.innerHTML = PLACEHOLDER_LIVE;
    render();
    renderVerseLog();
    setButtonsRunning();

    await connectToProPresenter();
    startProPresenterWorker();

    recog = createRecognizer();
    recog.start();
    startWaveform();
}

async function stop() {
    running = false;
    if (recog) { recog.onend = null; recog.stop(); recog = null; }

    stopWaveform();
    stopProPresenterWorker();
    await clearProPresenterMessage();

    interim = '';
    placeholder.innerHTML = PLACEHOLDER_IDLE;
    render();
    document.title = TITLE_IDLE;
    updateStatus('', 'Selesai');
    setButtonsStopped();
}

function clearDisplay() {
    committed.length = 0;
    sessionVerses.length = 0;
    interim = '';
    lastRenderedInterim = '';
    placeholder.innerHTML = PLACEHOLDER_IDLE;
    render();
    renderVerseLog();
}

applyTheme(localStorage.getItem('stt-theme') ?? 'dark');
drawIdleWaveform();

btnStart.addEventListener('click', start);
btnStop.addEventListener('click', stop);
btnClear.addEventListener('click', clearDisplay);
btnTheme.addEventListener('click', toggleTheme);

document.addEventListener('keydown', event => {
    if (event.key === 'F11') { event.preventDefault(); document.documentElement.requestFullscreen?.(); }
    if (event.key === 'Escape' && document.fullscreenElement) { document.exitFullscreen?.(); }
});
