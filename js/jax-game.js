// Jax Whack-a-Mole Game Logic
// Digital Circus 2D – Prototipo HTML + JS

// ---------------------- Configuración ----------------------
const GAME_DURATION_MS = 30000; // 30s
const JAX_APPEAR_INTERVAL_MS = 600; // frecuencia de aparición de Jax (más dinámico)
const SOUNDS_ENABLED = true;
const STORAGE_KEYS = { JAX_BEST: 'dcircus_jax_best' };

// Sonidos simples (beeps generados por WebAudio)
const audioCtx = typeof AudioContext !== 'undefined' ? new AudioContext() : null;
function playBeep(frequency, durationMs, type = 'sine', volume = 0.08) {
    if (!SOUNDS_ENABLED || !audioCtx) return;
    const oscillator = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    oscillator.type = type;
    oscillator.frequency.value = frequency;
    gain.gain.value = volume;
    oscillator.connect(gain).connect(audioCtx.destination);
    oscillator.start();
    setTimeout(() => {
        oscillator.stop();
    }, durationMs);
}

// ---------------------- Utilidades ----------------------
function formatSeconds(msLeft) {
    return Math.max(0, Math.ceil(msLeft / 1000));
}

// ---------------------- Minijuego 1: Jax ----------------------
let jaxInterval = null;
let jaxEndTimeout = null;
let jaxScore = 0;
let jaxEndAt = 0;

function startJaxGame() {
    // Reset
    jaxScore = 0;
    document.getElementById('jax-score').textContent = String(jaxScore);
    document.getElementById('jax-result').hidden = true;

    const target = document.getElementById('jax-target');
    const holes = Array.from(document.querySelectorAll('.hole'));
    const timeEl = document.getElementById('jax-time');

    function moveJax() {
        const hole = holes[Math.floor(Math.random() * holes.length)];
        const rect = hole.getBoundingClientRect();
        const boardRect = document.getElementById('jax-board').getBoundingClientRect();
        const left = rect.left - boardRect.left + rect.width / 2;
        const top = rect.top - boardRect.top + rect.height / 2;
        target.style.left = `${left}px`;
        target.style.top = `${top}px`;
    }

    function onClickJax() {
        jaxScore += 1;
        document.getElementById('jax-score').textContent = String(jaxScore);
        playBeep(1000, 80, 'sine');
        moveJax();
    }

    target.addEventListener('click', onClickJax);

    // loop de aparición
    moveJax();
    jaxInterval = setInterval(moveJax, JAX_APPEAR_INTERVAL_MS);

    // temporizador
    const startAt = performance.now();
    jaxEndAt = startAt + GAME_DURATION_MS;
    function tick() {
        const now = performance.now();
        const left = jaxEndAt - now;
        if (timeEl) timeEl.textContent = String(formatSeconds(left));
        if (left > 0) {
            requestAnimationFrame(tick);
        }
    }
    requestAnimationFrame(tick);

    jaxEndTimeout = setTimeout(() => {
        stopJaxGame();
        const bestPrev = Number(localStorage.getItem(STORAGE_KEYS.JAX_BEST) || '0');
        const isRecord = jaxScore > bestPrev;
        if (isRecord) localStorage.setItem(STORAGE_KEYS.JAX_BEST, String(jaxScore));
        const res = document.getElementById('jax-result');
        const resText = document.getElementById('jax-result-text');
        resText.textContent = `${isRecord ? '¡Nuevo récord!' : '¡Buen trabajo!'} Puntaje: ${jaxScore}${isRecord ? '' : ` | Mejor: ${bestPrev}`}`;
        res.hidden = false;
        playBeep(isRecord ? 1200 : 300, 260, isRecord ? 'square' : 'sawtooth');
    }, GAME_DURATION_MS);
}

function stopJaxGame() {
    const target = document.getElementById('jax-target');
    const clone = target.cloneNode(true);
    target.replaceWith(clone); // remove listeners
    if (jaxInterval) clearInterval(jaxInterval);
    if (jaxEndTimeout) clearTimeout(jaxEndTimeout);
    jaxInterval = null;
    jaxEndTimeout = null;
}

// ---------------------- Init ----------------------
window.addEventListener('load', () => {
    startJaxGame();
});

