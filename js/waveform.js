/**
 * Audio waveform visualization using Web Audio API.
 * Draws a 7-bar frequency visualizer on a small canvas.
 */

const WAVEFORM_BAR_COUNT = 7;

let audioContext   = null;
let analyser       = null;
let micStream      = null;
let animationFrame = null;

function getWaveformCanvas() {
    return document.getElementById('waveform');
}

function isLightTheme() {
    return document.documentElement.dataset.theme === 'light';
}

function drawIdleWaveform() {
    const canvas = getWaveformCanvas();
    const ctx    = canvas.getContext('2d');
    const barWidth = (canvas.width - (WAVEFORM_BAR_COUNT - 1) * 2) / WAVEFORM_BAR_COUNT;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = isLightTheme() ? 'rgba(60,60,60,0.2)' : 'rgba(255,255,255,0.15)';

    for (let i = 0; i < WAVEFORM_BAR_COUNT; i++) {
        ctx.fillRect(i * (barWidth + 2), (canvas.height - 2) / 2, barWidth, 2);
    }
}

function drawWaveform() {
    const canvas   = getWaveformCanvas();
    const ctx      = canvas.getContext('2d');
    const dataArray = new Uint8Array(analyser.frequencyBinCount);
    const binStep  = Math.floor(analyser.frequencyBinCount / WAVEFORM_BAR_COUNT);
    const barWidth = (canvas.width - (WAVEFORM_BAR_COUNT - 1) * 2) / WAVEFORM_BAR_COUNT;

    function draw() {
        animationFrame = requestAnimationFrame(draw);
        analyser.getByteFrequencyData(dataArray);
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = isLightTheme() ? 'rgba(60,60,60,0.55)' : 'rgba(255,255,255,0.55)';

        for (let i = 0; i < WAVEFORM_BAR_COUNT; i++) {
            let sum = 0;
            for (let j = 0; j < binStep; j++) sum += dataArray[i * binStep + j];
            const barHeight = Math.max(2, (sum / binStep / 255) * canvas.height);
            ctx.fillRect(i * (barWidth + 2), (canvas.height - barHeight) / 2, barWidth, barHeight);
        }
    }
    draw();
}

async function startWaveform() {
    try {
        micStream = await navigator.mediaDevices.getUserMedia({ audio: true, video: false });
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        analyser = audioContext.createAnalyser();
        analyser.fftSize = 64;
        audioContext.createMediaStreamSource(micStream).connect(analyser);
        drawWaveform();
    } catch {
        /* waveform is optional — mic permission may be denied separately */
    }
}

function stopWaveform() {
    if (animationFrame) { cancelAnimationFrame(animationFrame); animationFrame = null; }
    if (audioContext)   { audioContext.close(); audioContext = null; }
    if (micStream)      { micStream.getTracks().forEach(t => t.stop()); micStream = null; }
    analyser = null;
    drawIdleWaveform();
}
