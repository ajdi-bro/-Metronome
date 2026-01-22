function playTone(time, beatNumber) {
    const osc = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    osc.connect(gainNode);
    gainNode.connect(audioContext.destination);

    if (beatNumber === 0) {
        // BJELLE-LYD (Høy og klar)
        osc.type = 'sine';
        osc.frequency.value = 1000; 
        gainNode.gain.setValueAtTime(0.6, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.4);
    } else {
        // TRE-LYD (Kort klikk)
        osc.type = 'triangle';
        osc.frequency.value = 400; 
        gainNode.gain.setValueAtTime(0.4, time);
        gainNode.gain.exponentialRampToValueAtTime(0.01, time + 0.05);
    }

    osc.start(time);
    osc.stop(time + 0.5);

    // Visuell indikator
    setTimeout(() => {
        indicator.classList.add('pulse');
        setTimeout(() => indicator.classList.remove('pulse'), 100);
    }, (time - audioContext.currentTime) * 1000);
}

startStopBtn.addEventListener('click', () => {
    // VIKTIG: Flyttet AudioContext-opprettelsen hit for maksimal kompatibilitet
    if (!audioContext) {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
    }

    // Tvinger lyd-motoren til å starte hvis den sover
    if (audioContext.state === 'suspended') {
        audioContext.resume();
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
