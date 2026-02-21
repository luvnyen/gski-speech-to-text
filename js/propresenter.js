/**
 * ProPresenter integration — sends live transcript text via HTTP API.
 */

let proPresenterMsgId     = null;
let proPresenterTokenName = null;
let proPresenterPending   = null;
let proPresenterWorker    = null;
let ppBaseUrl             = null;

function buildProPresenterBaseUrl() {
    return `http://localhost:${document.getElementById('ppPort').value}/v1`;
}

function ppUrl(path) {
    return `${ppBaseUrl || buildProPresenterBaseUrl()}${path}`;
}

async function fetchProPresenterMessage(msgName) {
    const res = await fetch(ppUrl('/messages'));
    const messages = await res.json();
    return messages.find(m => m.id.name === msgName) ?? null;
}

async function fetchMessageTextToken(msgId) {
    const res = await fetch(ppUrl(`/message/${msgId}`));
    const data = await res.json();
    return (data.tokens ?? []).find(t => 'text' in t) ?? null;
}

async function triggerProPresenterMessage(text) {
    await fetch(ppUrl(`/message/${proPresenterMsgId}/trigger`), {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify([{ name: proPresenterTokenName, text: { text } }]),
    });
}

async function connectToProPresenter() {
    const msgName = document.getElementById('ppMessage').value.trim();
    ppBaseUrl = buildProPresenterBaseUrl();
    updateProPresenterBadge('', 'ProPresenter: menghubungi…');
    try {
        const message = await fetchProPresenterMessage(msgName);
        if (!message) {
            updateProPresenterBadge('error', `PP: message '${msgName}' tidak ditemukan`);
            return;
        }
        proPresenterMsgId = message.id.uuid;

        const token = await fetchMessageTextToken(proPresenterMsgId);
        if (!token) {
            updateProPresenterBadge('error', 'PP: tidak ada text token di message');
            return;
        }
        proPresenterTokenName = token.name;

        await fetch(ppUrl(`/message/${proPresenterMsgId}/trigger`), { method: 'POST' });
        updateProPresenterBadge('ok', 'ProPresenter: terhubung');
    } catch {
        updateProPresenterBadge('error', 'PP: tidak bisa connect (ProPresenter running?)');
    }
}

function sendPendingProPresenterUpdate() {
    if (!proPresenterPending || !proPresenterMsgId || !proPresenterTokenName) return;
    const text = proPresenterPending;
    proPresenterPending = null;
    triggerProPresenterMessage(text).catch(() => {});
}

function startProPresenterWorker() {
    /* no-op: using debounce in scheduleProPresenterUpdate instead */
}

function stopProPresenterWorker() {
    if (proPresenterWorker) { clearTimeout(proPresenterWorker); proPresenterWorker = null; }
}

async function clearProPresenterMessage() {
    if (!proPresenterMsgId) return;
    try { await fetch(ppUrl(`/message/${proPresenterMsgId}/clear`)); } catch { /* silent */ }
    proPresenterMsgId = proPresenterTokenName = null;
    updateProPresenterBadge('', '');
}

const PP_THROTTLE_MS = 50;
let ppThrottled = false;

function scheduleProPresenterUpdate(text) {
    if (!proPresenterMsgId || !proPresenterTokenName) return;
    proPresenterPending = formatForDisplay(text);
    if (ppThrottled) return;
    ppThrottled = true;
    proPresenterWorker = setTimeout(() => {
        ppThrottled = false;
        sendPendingProPresenterUpdate();
    }, PP_THROTTLE_MS);
}

