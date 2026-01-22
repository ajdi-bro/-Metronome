let audioContext = null;
let isPlaying = false;
let currentBeat = 0;
let bpm = 120;
let beatsPerMeasure = 4;
let nextNoteTime = 0.0; // Når neste tone skal spilles
const lookahead = 25.0; // Hvor ofte vi sjekker for nye toner (ms)
const scheduleAheadTime = 0.1; // Hvor langt frem i tid vi planlegger (s)

const bpmSlider = document.getElementById('bpm-slider');
const bpmValue = document.getElementById('bpm-value');
const startStopBtn = document.getElementById('start-stop');
const timeSigSelect = document.getElementById('time-signature');
const indicator = document.getElementById('indicator');

// Oppdater verdier fra grensesnittet
bpmSlider.addEventListener('input', () => {
    bpm = bpmSlider.value;
    bpmValue.textContent = bpm;
});

timeSigSelect.addEventListener('change', () => {
    beatsPerMeasure = parseInt(timeSigSelect.value);
    currentBeat = 0; // Nullstill takten når vi bytter
});

function nextNote() {
    const secondsPerBeat = 60.0 / bpm;
    nextNoteTime += secondsPerBeat; // Legg til tid for neste slag
    currentBeat++;
    if (currentBeat >= beatsPerMeasure) {
        currentBeat = 0;
    }
}

function playTone(time, beatNumber) {
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    // Endre frekvens: Høyt "pling" på første slag (0), lavere på resten
    osc.frequency.value = beatNumber === 0 ? 880 : 440;
    
    envelope.gain.value = 1;
    envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.1);

    osc.connect(envelope);
    envelope.connect(audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.1);

    // Visuell effekt
    setTimeout(() => {
        indicator.classList.add('pulse');
        setTimeout(() => indicator.classList.remove('pulse'), 100);
    }, (time - audioContext.currentTime) * 1000);
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

startStopBtn.addEventListener('click', () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
        currentBeat = 0;
        nextNoteTime = audioContext.currentTime;
        startStopBtn.textContent = 'STOPP';
        scheduler();
    } else {
        startStopBtn.textContent = 'START';
    }
});
