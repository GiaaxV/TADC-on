// Digital Circus 2D – Loading Screen
// Pantalla de carga con botón START

// ---------------------- Configuración ----------------------
const LOADING_DURATION_MS = 3000; // 3s
const SOUNDS_ENABLED = true;

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

// ---------------------- Pantalla de carga ----------------------
function runLoading() {
    const bar = document.getElementById('loading-bar');
    const startButton = document.getElementById('start-button');
    const subtitle = document.querySelector('.subtitle');
    const dots = document.querySelector('.dots');
    const start = performance.now();
    
    function step(now) {
        const t = now - start;
        const progress = Math.min(1, t / LOADING_DURATION_MS);
        if (bar) bar.style.width = `${(progress * 100).toFixed(1)}%`;
        
        if (t < LOADING_DURATION_MS) {
            requestAnimationFrame(step);
        } else {
            // Mostrar botón START después de completar la carga
            if (subtitle) subtitle.textContent = '¡Listo!';
            if (dots) dots.style.display = 'none';
            if (startButton) {
                startButton.style.display = 'block';
                startButton.addEventListener('click', () => {
                    playBeep(800, 120, 'square');
                    // Ir a Minijuegos.html
                    window.location.href = 'html/Minijuegos.html';
                });
            }
        }
    }
    requestAnimationFrame(step);
}

// ---------------------- Init ----------------------
window.addEventListener('load', () => {
    runLoading();
});

