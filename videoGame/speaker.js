export class Speaker {
    constructor(path, isLoop = false, level = 1) {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.audioSource = path;
        this.isLoop = isLoop;
        this.soundLevel = level;
        this.decodedBuffer = null;
        this.isLoaded = false;
        this.audioSourceNode = null;
    }

    loadSound(callback) {
        fetch(this.audioSource)
            .then((response) => response.arrayBuffer())
            .then((arrayBuffer) => this.audioContext.decodeAudioData(arrayBuffer))
            .then((decodedBuffer) => {
                this.decodedBuffer = decodedBuffer;
                this.isLoaded = true;
                if (callback) callback();
            })
            .catch((error) => {
                console.error('Error loading sound:', error);
            });
    }

    play() {
        if (!this.isLoaded) {
            console.warn('Sound is not loaded yet!');
            return;
        }

        // Stop any currently playing audio before starting a new one
        this.stop();

        this.audioSourceNode = this.audioContext.createBufferSource();
        this.audioSourceNode.buffer = this.decodedBuffer;
        this.audioSourceNode.loop = this.isLoop;

        const gainNode = this.audioContext.createGain();
        gainNode.gain.value = this.soundLevel;

        this.audioSourceNode.connect(gainNode);
        gainNode.connect(this.audioContext.destination);

        this.audioSourceNode.start();
    }

    stop() {
        if (this.audioSourceNode) {
            try {
                this.audioSourceNode.stop();
            } catch (e) {
                console.warn('Error stopping audio:', e);
            }
            this.audioSourceNode = null;
        }
    }
}

export class SoundManager {
    constructor() {
        this.sounds = {
            collectSuccess: new Speaker('assets/collect-success.wav', false, 1),
            toyShow: new Speaker('assets/water-bubble.wav', false, 1),
            startGame: new Speaker('assets/start-game.wav', true, 1),
            endGame: new Speaker('assets/end-game.wav', false, 1)
        };

        // Load all sound files
        for (let key in this.sounds) {
            this.sounds[key].loadSound(() => {
                console.log(`${key} loaded.`);
            });
        }
    }

    play(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].play();
        }
    }

    stop(soundName) {
        if (this.sounds[soundName]) {
            this.sounds[soundName].stop();
        }
    }
}
