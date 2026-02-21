/**
 * Web Speech API wrapper — recognition lifecycle and event handling.
 */

let recog   = null;
let running = false;

function createRecognizer() {
    const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognizer          = new SR();
    recognizer.lang           = document.getElementById('lang').value;
    recognizer.continuous     = true;
    recognizer.interimResults = true;
    recognizer.maxAlternatives = 1;
    recognizer.onstart  = () => updateStatus('listening', 'Mendengarkan…');
    recognizer.onresult = handleRecognitionResult;
    recognizer.onerror  = handleRecognitionError;
    recognizer.onend    = () => { if (running) scheduleRecognitionRestart(); };
    return recognizer;
}

function handleRecognitionResult(event) {
    let newInterim = '';
    for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        if (result.isFinal) {
            const text = result[0].transcript.trim();
            if (text) appendCommittedText(text);
        } else {
            newInterim += result[0].transcript;
        }
    }
    interim = newInterim.trim();
    handleTranscriptUpdate();
}

function handleRecognitionError(event) {
    if (event.error === 'not-allowed') {
        updateStatus('', 'Izin mikrofon ditolak — izinkan di browser lalu coba lagi');
        stop();
    } else if (event.error !== 'no-speech' && event.error !== 'aborted') {
        console.warn('[STT error]', event.error);
    }
}

function scheduleRecognitionRestart() {
    setTimeout(() => {
        if (running) try { recog.start(); } catch {}
    }, RECOGNITION_RESTART_DELAY_MS);
}
