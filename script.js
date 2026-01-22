let audioContext = null;
let isPlaying = false;
let currentBeat = 0;
let bpm = 120;
let beatsPerMeasure = 4;
let nextNoteTime = 0.0;
const lookahead = 25.0;
const scheduleAheadTime = 0.1;

const bpmSlider = document.getElementById('bpm-slider');
const bpmValue = document.getElementById('bpm-value');
const startStopBtn = document.getElementById('start-stop');
const timeSigSelect = document.getElementById('time-signature');
const indicator = document.getElementById('indicator');

bpmSlider.addEventListener('input', () => {
    bpm = bpmSlider.value;
    bpmValue.textContent = bpm;
});

timeSigSelect.addEventListener('change', () => {
    beatsPerMeasure = parseInt(timeSigSelect.value);
    currentBeat = 0;
});

function playTone(time, beatNumber) {
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    // Velg lyd basert på slag
    if (beatNumber === 0) {
        osc.type = 'sine'; // Bjelle-aktig
        osc.frequency.setValueAtTime(1000, time);
        envelope.gain.setValueAtTime(0.5, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.3);
    } else {
        osc.type = 'triangle'; // Tre-aktig
        osc.frequency.setValueAtTime(500, time);
        envelope.gain.setValueAtTime(0.3, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    }

    osc.connect(envelope);
    envelope.connect(audioContext.destination);
    osc.start(time);
    osc.stop(time + 0.3);

    // Visuell effekt
    const diff = (time - audioContext.currentTime) * 1000;
    setTimeout(() => {
        indicator.classList.add('pulse');
        setTimeout(() => indicator.classList.remove('pulse'), 50);
    }, diff > 0 ? diff : 0);
}

function scheduler() {
    while (nextNoteTime < audioContext.currentTime + scheduleAheadTime) {
        playTone(nextNoteTime, currentBeat);
        nextNote();
    }
    if (isPlaying) {
        setTimeout(scheduler, lookahead);
    }
}

function nextNote() {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime += secondsPerBeat;
    currentBeat = (currentBeat + 1) % beatsPerMeasure;
}

startStopBtn.addEventListener('click', () => {
    // 1. Lag context hvis den ikke finnes
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // 2. Tving den til å starte (løser browser-blokkering)
    if (audioContext.state === 'suspended') {
        audioContext.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
        currentBeat = 0;
        // Gi den 0.1 sekund buffer så den ikke starter "i fortiden"
        nextNoteTime = audioContext.currentTime + 0.1;
        startStopBtn.textContent = 'STOPP';
        scheduler();
    } else {
        startStopBtn.textContent = 'START';
    }
});
