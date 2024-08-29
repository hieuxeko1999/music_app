'use client'
import { Icon, Image } from "semantic-ui-react";
import styles from "./songPlayBottom.component.module.scss";
import { useEffect, useRef, useState } from "react";
import { useSongPlayContext } from "@/contexts/SongPlayContext";
import WaveSurferManager from "@/contexts/WaveSurferManager";
import VolumeSlider from "../volumeSliderComponent/VolumeSlider";

const SongPlayBottom = () => {
    const [isShow, setIsShow] = useState<boolean>(true);
    const [onOpen, setOnOpen] = useState<boolean>(false);
    const { songPlay, setVolumn, volumn } = useSongPlayContext();
    const [isPlay, setIsPlay] = useState<boolean>(false);
    const [timeDuration, setTimeDuration] = useState<string>("00:00");
    const [currentTime, setCurrentTime] = useState<string>("00:00");
    const [isSeekBottom, setIsSeekBottom] = useState<boolean>(false);
    const [isMute, setIsMute] = useState<boolean>(false);
    const [songID, setSongID] = useState<string>("");

    const isSeekBottomRef = useRef(isSeekBottom);
    isSeekBottomRef.current = isSeekBottom;
    const onOpenRef = useRef(onOpen);
    onOpenRef.current = onOpen;

    const handlePlaySong = () => {
        if (songPlay) {
            const wavesurfer = WaveSurferManager.getInstance(`#card${songPlay.id}`, songPlay.id);
            if (!isPlay) {
                wavesurfer.play();
            } else {
                wavesurfer.pause();
            }
        }
    };

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const remainingSeconds = Math.floor(duration % 60);

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        if (songPlay) {
            setSongID(songPlay.id);
            setIsPlay(true);
            if (songID !== "") {
                if (songID !== songPlay.id) {
                    setOnOpen(false)
                    let checkExited = WaveSurferManager.checkInstance(`${songID}_bottom`);
                    if (checkExited) {
                        const wavesurferOld = WaveSurferManager.getInstance(`#card${songID}_bottom`, `${songID}_bottom`);
                        wavesurferOld.destroy();
                    }
                }
            }

            const wavesurfer = WaveSurferManager.getInstance(`#card${songPlay.id}`, songPlay.id);
            const wavesurferBottom = WaveSurferManager.getInstance(`#card${songPlay.id}_bottom`, `${songPlay.id}_bottom`);
            wavesurferBottom.load(songPlay.songContent);


            if (wavesurferBottom) {
                let stringTime = formatDuration(wavesurfer.getDuration());
                setTimeDuration(stringTime);
            }

            const handlePlay = () => {
                setIsPlay(true)
            };

            const handlePause = () => {
                setIsPlay(false);
            };

            const handleReady = () => {
                setOnOpen(true);
            };

            //Bottom Action
            wavesurferBottom.on('dragstart', (e: any) => {
                setIsSeekBottom(true);
                wavesurfer.pause();
            });
            wavesurferBottom.on('dragend', (e: any) => {
                setIsSeekBottom(false);
                setTimeout(() => {
                    wavesurfer.setTime(wavesurferBottom.getCurrentTime());
                    wavesurfer.play();
                }, 500)
            });
            wavesurferBottom.on('timeupdate', (e: any) => {
                let stringTime = formatDuration(e);
                setCurrentTime(stringTime);
            });

            wavesurferBottom.on('ready', handleReady);


            //Main Action
            wavesurfer.on('audioprocess', (e: any) => {
                if (!isSeekBottomRef.current) {
                    wavesurferBottom.setTime(e);
                }
            });

            wavesurfer.on('play', handlePlay);

            wavesurfer.on('pause', handlePause);

            wavesurfer.on('finish', () => {
                console.log(`Song ${songPlay.id} finished`);
                setIsPlay(false);
                wavesurfer.seekTo(0);
            });

            return () => {
                wavesurfer.un('play', handlePlay);
                wavesurfer.un('pause', handlePause);
                wavesurfer.un('finish', handlePause);
                wavesurferBottom.un('dragstart', () => { });
                wavesurferBottom.un('dragend', () => { });
                wavesurferBottom.un('dragend', () => { });
            };
        }
    }, [songPlay]);

    const handleVolumeChange = (volume: number) => {
        if (songPlay) {
            const wavesurfer = WaveSurferManager.getInstance(`#card${songPlay?.id}`, songPlay?.id);
            if (volume === 0) {
                setIsMute(true);
            } else {
                setIsMute(false);
            }
            setVolumn(volume);
            wavesurfer.setVolume(volume);
        }
    };

    const handleVolumeOnOff = () => {
        if (songPlay) {
            console.log("check 1====:", `#card${songPlay?.id}`);

            const wavesurfer = WaveSurferManager.getInstance(`#card${songPlay?.id}`, songPlay?.id);
            if (isMute) {
                setIsMute(false);
                wavesurfer.setVolume(0.5)
                setVolumn(0.5)
            } else {
                setIsMute(true);
                wavesurfer.setVolume(0)
                setVolumn(0)
            }
        }

    };

    return (
        <>
            <div className={`${styles.bottomPlay} ${(!songPlay) && styles.hide}`}>
                <div className={styles.spanBtn} onClick={() => setIsShow(!isShow)}>
                    {
                        isShow ? (<Icon name="arrow down"></Icon>) : (<Icon name="arrow up"></Icon>)
                    }

                </div>
                <div className={`${styles.container} ${isShow && styles.show}`}>
                    <div className={styles.mainContent}>
                        <div className={styles.firstCol}>
                            <div className={styles.playBtn} onClick={handlePlaySong}>
                                {
                                    isPlay ? (<Icon name="pause" />) : (<Icon name="play" />)
                                }
                            </div>
                            <div className={styles.songInfo}>
                                <Image className={styles.songImg} src={songPlay?.songImg} size="mini" />
                                <div className={styles.songName}>{`${songPlay?.songName} [${songPlay?.singer}]`}</div>
                            </div>
                        </div>
                        <div className={styles.midCol}>
                            <div className={styles.currentTime}>{currentTime}</div>
                            {
                                !onOpenRef.current && (
                                    <div className={styles.unLoadedLine}>
                                    </div>
                                )
                            }
                            <div id={`card${songPlay?.id}_bottom`} className={styles["wavesurfer-container"]} />
                            <div className={styles.totalTime}>{timeDuration}</div>
                        </div>
                        <div className={styles.lastCol}>
                            <div className={styles.actions}>
                                {
                                    isMute ? (<Icon name="volume off" onClick={handleVolumeOnOff} />) : (<Icon name="volume up" onClick={handleVolumeOnOff} />)
                                }
                                <VolumeSlider initialVolume={volumn} onVolumeChange={handleVolumeChange} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default SongPlayBottom;