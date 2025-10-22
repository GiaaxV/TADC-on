// Pomni Feeding Game Logic
// Digital Circus 2D – Prototipo HTML + JS

// ---------------------- Configuración ----------------------
const GAME_DURATION_MS = 30000; // 30s
const SOUNDS_ENABLED = true;
const STORAGE_KEYS = { POMNI_BEST: 'dcircus_pomni_best' };

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

// ---------------------- Minijuego 2: Pomni ----------------------
let pomniEndTimeout = null;
let pomniEndAt = 0;
let happiness = 50; // 0-100

function startPomniGame() {
    happiness = 50;
    updateHappiness(0);
    document.getElementById('pomni-result').hidden = true;

    const food = document.getElementById('food');
    const pomni = document.getElementById('pomni');
    const timeEl = document.getElementById('pomni-time');

    // Posición original de la comida
    const originalFoodPosition = {
        right: '20%',
        top: '60%'
    };

    // Drag manual para compatibilidad (desktop/mobile)
    let dragging = false;
    let offsetX = 0, offsetY = 0;

    function onPointerDown(e) {
        dragging = true;
        const rect = food.getBoundingClientRect();
        offsetX = (e.clientX ?? e.touches?.[0]?.clientX) - rect.left;
        offsetY = (e.clientY ?? e.touches?.[0]?.clientY) - rect.top;
        playBeep(700, 70, 'triangle');
    }
    function onPointerMove(e) {
        if (!dragging) return;
        const containerRect = document.querySelector('.pomni-area').getBoundingClientRect();
        const x = (e.clientX ?? e.touches?.[0]?.clientX) - containerRect.left - offsetX;
        const y = (e.clientY ?? e.touches?.[0]?.clientY) - containerRect.top - offsetY;
        food.style.left = `${x + food.offsetWidth / 2}px`;
        food.style.top = `${y + food.offsetHeight / 2}px`;
    }
    function onPointerUp() {
        if (!dragging) return;
        dragging = false;
        
        // Colisión simple por bounding boxes
        const a = food.getBoundingClientRect();
        const b = pomni.getBoundingClientRect();
        const collide = !(a.right < b.left || a.left > b.right || a.bottom < b.top || a.top > b.bottom);
        
        if (collide) {
            // Alimentación exitosa: +10 felicidad
            updateHappiness(+10);
            playBeep(1100, 90, 'sine');
        }
        
        // Siempre regresar la comida a su posición original con animación
        returnFoodToOriginalPosition();
    }

    // Función para regresar la comida a su posición original
    function returnFoodToOriginalPosition() {
        food.style.transition = 'right 0.5s ease-out, top 0.5s ease-out';
        food.style.right = originalFoodPosition.right;
        food.style.top = originalFoodPosition.top;
        
        // Remover la transición después de que termine la animación
        setTimeout(() => {
            food.style.transition = '';
        }, 500);
    }

    // Event listeners para mouse y touch
    food.addEventListener('mousedown', onPointerDown);
    food.addEventListener('touchstart', onPointerDown);
    window.addEventListener('mousemove', onPointerMove);
    window.addEventListener('touchmove', onPointerMove);
    window.addEventListener('mouseup', onPointerUp);
    window.addEventListener('touchend', onPointerUp);

    // temporizador
    const startAt = performance.now();
    pomniEndAt = startAt + GAME_DURATION_MS;
    function tick() {
        const now = performance.now();
        const left = pomniEndAt - now;
        if (timeEl) timeEl.textContent = String(formatSeconds(left));
        if (left > 0) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);

    pomniEndTimeout = setTimeout(() => {
        stopPomniGame();
        const bestPrev = Number(localStorage.getItem(STORAGE_KEYS.POMNI_BEST) || '0');
        const isRecord = happiness > bestPrev;
        if (isRecord) localStorage.setItem(STORAGE_KEYS.POMNI_BEST, String(happiness));
        const res = document.getElementById('pomni-result');
        const resText = document.getElementById('pomni-result-text');
        resText.textContent = `${isRecord ? '¡Nuevo récord!' : '¡Buen trabajo!'} Felicidad: ${happiness}${isRecord ? '' : ` | Mejor: ${bestPrev}`}`;
        res.hidden = false;
        playBeep(isRecord ? 1200 : 300, 260, isRecord ? 'square' : 'sawtooth');
    }, GAME_DURATION_MS);
}

function stopPomniGame() {
    const food = document.getElementById('food');
    const clone = food.cloneNode(true);
    food.replaceWith(clone); // remove listeners
    window.onmousemove = null; // safety
    window.onmouseup = null;
    window.ontouchmove = null; // safety
    window.ontouchend = null;
    if (pomniEndTimeout) clearTimeout(pomniEndTimeout);
    pomniEndTimeout = null;
}

function updateHappiness(delta) {
    happiness = Math.max(0, Math.min(100, happiness + delta));
    document.getElementById('pomni-meter').textContent = String(happiness);
}

// ---------------------- Init ----------------------
window.addEventListener('load', () => {
    startPomniGame();
});

