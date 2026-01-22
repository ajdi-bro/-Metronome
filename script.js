function playTone(time, beatNumber) {
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    if (beatNumber === 0) {
        // --- BJELLE-LYD ---
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, time); 
        
        envelope.gain.setValueAtTime(0, time);
        envelope.gain.linearRampToValueAtTime(0.8, time + 0.005); // Hurtig fade inn for å unngå "klikk"
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    } else {
        // --- TRE-METRONOM ---
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, time);
        
        envelope.gain.setValueAtTime(0, time);
        envelope.gain.linearRampToValueAtTime(0.5, time + 0.002);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    }

    osc.connect(envelope);
    envelope.connect(audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.5);

    // Visuell effekt
    setTimeout(() => {
        indicator.classList.add('pulse');
        setTimeout(() => indicator.classList.remove('pulse'), 100);
    }, (time - audioContext.currentTime) * 1000);
}
