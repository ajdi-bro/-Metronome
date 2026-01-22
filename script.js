function playTone(time, beatNumber) {
    // Vi må sørge for at oscillatoren og gain lages hver gang
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    if (beatNumber === 0) {
        // BJELLE
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, time); 
        envelope.gain.setValueAtTime(0, time);
        envelope.gain.linearRampToValueAtTime(0.8, time + 0.01);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    } else {
        // TREVERK
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, time);
        envelope.gain.setValueAtTime(0, time);
        envelope.gain.linearRampToValueAtTime(0.5, time + 0.005);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    }

    osc.connect(envelope);
    envelope.connect(audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.5);

    // Visuell indikator
    setTimeout(() => {
        indicator.classList.add('pulse');
        setTimeout(() => indicator.classList.remove('pulse'), 100);
    }, (time - audioContext.currentTime) * 1000);
}

// VIKTIG: Endret denne for å "vekke" lyden
startStopBtn.addEventListener('click', async () => {
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Dette er trikset: Hvis nettleseren har blokkert lyden, start den igjen
    if (audioContext.state === 'suspended') {
        await audioContext.resume();
    }

    isPlaying = !isPlaying;

    if (isPlaying) {
        currentBeat = 0;
        nextNoteTime = audioContext.currentTime + 0.05;
        startStopBtn.textContent = 'STOPP';
        scheduler();
    } else {
        startStopBtn.textContent = 'START';
    }
});
