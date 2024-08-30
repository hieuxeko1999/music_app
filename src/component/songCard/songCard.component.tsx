'use client'
import { Icon, Image } from "semantic-ui-react";
import styles from "./songCard.component.module.scss";
import { useEffect, useRef, useState } from "react";
import WaveSurferManager from "@/contexts/WaveSurferManager";
import { SongPlayType } from "@/contexts/SongPlayContext";

export interface SongCardProps {
    songContent: string,
    songImage: string,
    songName: string,
    singer: string
    id: string
    isActive: boolean;
    onPlay: Function,
    onEnd: Function,
    currentIndex: number,
}

const SongCard = (props: SongCardProps) => {
    const [isPlay, setIsPlay] = useState<boolean>(false);
    const [timeDuration, setTimeDuration] = useState<string>("00:00s");
    const [isReady, setIsReady] = useState<boolean>(false);

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
    const handleOpenDetail = () => {
        let slug = stringToSlug(props.songName);
        window.location.href = `/music/${slug}-${props.id}`;
    }

    const formatDuration = (duration: number) => {
        const minutes = Math.floor(duration / 60);
        const remainingSeconds = Math.floor(duration % 60);

        return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}s`;
    }

    const stringToSlug = (str: string) => {
        return str
            .toLowerCase()                 // Convert the string to lowercase
            .trim()                        // Remove whitespace from both ends of the string
            .replace(/[\s\W-]+/g, '-')     // Replace spaces and non-word characters with a dash
            .replace(/^-+|-+$/g, '');      // Remove leading and trailing dashes
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
            props.onPlay(dataSongPlay, props.currentIndex)
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
            props.onEnd(props.currentIndex);
        });

        return () => {
            wavesurfer.un('ready', handleReady);
            wavesurfer.un('play', handlePlay);
            wavesurfer.un('pause', handlePause);
            wavesurfer.un('finish', handlePause);
        };

    }, [props.isActive, isReady, props.id, props.songContent]);

    return (
        <div className={styles.container}>
            <div className={styles.firstCol}>
                <div className={styles.playBtn} onClick={handlePlaySong}>
                    {
                        isPlay ? (<Icon name="pause" />) : (<Icon name="play" />)
                    }
                </div>
                <div className={styles.songInfo}>
                    <Image className={styles.songImg} src={props.songImage || `http://dummyimage.com/107x100.png/dddddd/000000`} />
                    <div className={styles.songName} onClick={handleOpenDetail}>{`${props.songName} [${props.singer}]`}</div>
                </div>
            </div>
            <div className={styles.midCol}>
                {(!onOpenRef.current) && (
                    <div className={styles.unLoadedLine}>
                    </div>)
                }
                <div id={`card${props.id}`} className={styles["wavesurfer-container"]} />
            </div>
            <div className={styles.lastCol}>
                <div className={styles.actions}>
                    <div className={styles.songTime}>
                        <Icon name="clock" /> {timeDuration}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SongCard;