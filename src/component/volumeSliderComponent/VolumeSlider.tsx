import React, { useEffect, useState } from 'react';
import styles from "./VolumeSlider.module.scss"

interface VolumeSliderProps {
    initialVolume?: number;
    onVolumeChange?: (volume: number) => void;
}

const VolumeSlider: React.FC<VolumeSliderProps> = ({ initialVolume = 0.5, onVolumeChange }) => {
    const [volume, setVolume] = useState<number>(initialVolume);

    const handleVolumeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const newVolume = parseFloat(event.target.value);
        setVolume(newVolume);
        if (onVolumeChange) {
            onVolumeChange(newVolume);
        }
    };

    useEffect(() => {
        setVolume(initialVolume);
    }, [initialVolume])

    return (
        <div className={styles.sliderContainer}>
            <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={handleVolumeChange}
                aria-label="Volume Slider"
                className={styles.slider}
            />
        </div>
    );
};

export default VolumeSlider;
