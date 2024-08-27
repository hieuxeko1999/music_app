import WaveSurfer from 'wavesurfer.js';

class WaveSurferManager {
    private static instances: { [key: string]: WaveSurfer } = {};

    static getInstance(container: string, key: string): WaveSurfer {
        if (!WaveSurferManager.instances[key]) {
            WaveSurferManager.instances[key] = WaveSurfer.create({
                container,
                waveColor: "#34374B",
                progressColor: "#00AB6B",
                dragToSeek: true,
                width: "30vw",
                hideScrollbar: true,
                normalize: true,
                barGap: 0.1,
                height: 30,
                barHeight: 10,
                barRadius: 10,
                barWidth: 1,
                cursorColor: "black",
                cursorWidth: 1
            });
        }
        return WaveSurferManager.instances[key];
    }

    static checkInstance(key: string): boolean {
        if (!WaveSurferManager.instances[key]) {
            return false
        }
        return true
    }

    static stopAll() {
        Object.values(WaveSurferManager.instances).forEach(instance => {
            if (instance.isPlaying()) {
                instance.stop();
            }
        });
    }

    static destroyAll() {
        Object.values(WaveSurferManager.instances).forEach(instance => {
            instance.destroy(); // Destroy each WaveSurfer instance
        });
        WaveSurferManager.instances = {}; // Clear the instances object
    }
}

export default WaveSurferManager;
