'use client'
import styles from "./songCardDetail.component.module.scss";
import { Icon, Image } from "semantic-ui-react";
import { useEffect, useRef, useState } from "react";
import { SongPlayType, useSongPlayContext } from "@/contexts/SongPlayContext";
import WaveSurferManager from "@/contexts/WaveSurferManager";

export interface songCardDetailProps {
    songContent: string,
    songImage: string,
    songName: string,
    singer: string
    id: string
}


const SongCardDetail = (props: songCardDetailProps) => {
    const [isPlay, setIsPlay] = useState<boolean>(false);
    const [timeDuration, setTimeDuration] = useState<string>("00:00s");
    const [currentTime, setCurrentTime] = useState<string>("00:00");
    const [isReady, setIsReady] = useState<boolean>(false);
    const { setSongPlay } = useSongPlayContext();
    const onOpenRef = useRef(isReady);
    onOpenRef.current = isReady;

    const handlePlaySong = () => {
        const wavesurfer = WaveSurferManager.getInstance(`#card${props.id}`, props.id);
        if (!isPlay) {
            WaveSurferManager.stopAll();
            wavesurfer.play();
        } else {
            wavesurfer.pause();
        }

    };

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const remainingSeconds = Math.floor(duration % 60);

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
    }

    useEffect(() => {
        const wavesurfer = WaveSurferManager.getInstance(`#card${props.id}`, props.id);

        const handleReady = () => {
            setIsReady(true);
            let stringTime = formatDuration(wavesurfer.getDuration());
            setTimeDuration(stringTime);
        };

        const handlePlay = () => {
            setIsPlay(true)
            let dataSongPlay: SongPlayType = {
                singer: props.singer,
                songContent: props.songContent,
                songImg: props.songImage,
                songName: props.songName,
                id: props.id.toString()
            }
            setSongPlay(dataSongPlay);
        };

        const handlePause = () => {
            setIsPlay(false);
        };


        if (!isReady) {
            wavesurfer.load(props.songContent);
        }

        wavesurfer.on('ready', handleReady);

        wavesurfer.on('play', handlePlay);

        wavesurfer.on('pause', handlePause);

        wavesurfer.on('finish', () => {
            console.log(`Song ${props.id} finished`);
            setIsPlay(false);
            wavesurfer.seekTo(0);
        });

        wavesurfer.on('timeupdate', (e: any) => {
            let stringTime = formatDuration(e);
            setCurrentTime(stringTime);
        });

        return () => {
            wavesurfer.un('ready', handleReady);
            wavesurfer.un('play', handlePlay);
            wavesurfer.un('pause', handlePause);
            wavesurfer.un('finish', handlePause);
        };

    }, [isReady, props.id, props.songContent]);

    return (
        <>
            <div className={styles.container} >
                <div style={{
                    backgroundSize: "cover",
                    backgroundRepeat: "no-repeat",
                    backgroundPosition: "center",
                    borderRadius: "10px"
                }} className={styles.bgr}>
                    <Image className={styles.songImg} src={props.songImage} />
                </div>
                <div className={styles.card_info}>
                    <div className={styles.songInfo}>
                        <Image className={styles.songImg} src={props.songImage} size="tiny" />
                        <div className={styles.songName}>{`${props.songName} [${props.singer}]`}</div>
                    </div>
                    <div className={styles.midCol}>
                        <div className={styles.currentTime}>{currentTime}</div>
                        {
                            !isReady && (
                                <div className={styles.unLoadedLine}>
                                </div>
                            )
                        }
                        <div id={`card${props.id}`} className={styles["wavesurfer-container"]} />
                        <div className={styles.totalTime}>{timeDuration}</div>
                    </div>
                    <div className={styles.lastCol}>
                        <div className={styles.playBtn} onClick={handlePlaySong}>
                            {
                                isPlay ? (<Icon name="pause" />) : (<Icon name="play" />)
                            }
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}

export default SongCardDetail;