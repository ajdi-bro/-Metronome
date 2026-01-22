function playTone(time, beatNumber) {
    const osc = audioContext.createOscillator();
    const envelope = audioContext.createGain();

    if (beatNumber === 0) {
        // --- BJELLE-LYD (Første slag) ---
        // Bruker en "sine" bølge for en renere tone
        osc.type = 'sine';
        osc.frequency.setValueAtTime(1200, time); 
        
        // En bjelle ringer litt lenger enn treverket
        envelope.gain.setValueAtTime(0.8, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.4);
    } else {
        // --- TRE-METRONOM (De andre slagene) ---
        // Bruker en "triangle" bølge som er mykere enn standard
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(600, time);
        
        // En veldig kort og perkusiv lyd (klikk-aktig)
        envelope.gain.setValueAtTime(0.5, time);
        envelope.gain.exponentialRampToValueAtTime(0.001, time + 0.05);
    }

    osc.connect(envelope);
    envelope.connect(audioContext.destination);

    osc.start(time);
    osc.stop(time + 0.5);

    // Visuell effekt (samme som før)
    setTimeout(() => {
        indicator.classList.add('pulse');
        setTimeout(() => indicator.classList.remove('pulse'), 100);
    }, (time - audioContext.currentTime) * 1000);
}
