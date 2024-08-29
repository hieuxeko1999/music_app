'use client'

import { useEffect, useRef, useState } from "react";
import styles from "../styles/homepage.module.scss";
import SongCard from "./songCard/songCard.component";
import { getDataMusicApi, searchMusicApi } from "@/services/musics.services";
import { Loader, Pagination } from "semantic-ui-react";
import { SongPlayType, useSongPlayContext } from "@/contexts/SongPlayContext";
import Ads, { AdsType } from "./ads/Ads";
import { getAdsByTypeApi } from "@/services/ads.services";
import WaveSurferManager from "@/contexts/WaveSurferManager";
import FilterComponent from "./filterComponent/FilterComponent";
import { useDispatch, useSelector } from "react-redux";
import { clearInputSearch, selectInputSearch } from "@/store/features/counter/counterSlice";
import { AppDispatch } from "@/store";

const AppHomePage = () => {
    const [ads, setAds] = useState<any>(null);
    const [activeSong, setActiveSong] = useState<string | null>(null);
    const { setSongPlay, musicData,
        setMusicData, isLoading,
        setIsLoading,
        pagingnation, setPagingnation,
        searchObject
    } = useSongPlayContext();
    const [musicDataState, setMusicDataState] = useState<any>(null);
    const channelArnRef = useRef(activeSong);
    channelArnRef.current = activeSong;
    const searchTrigger = useSelector(selectInputSearch);
    const dispatch = useDispatch<AppDispatch>();

    const searchMusicData = async (page: number) => {
        setIsLoading(true)
        await WaveSurferManager.destroyAll()
        setSongPlay(null)
        setMusicData([]);
        let { data, meta } = await searchMusicApi(searchObject.input, searchObject.type, page + 1, pagingnation.pageSize);
        if (data && data.length > 0) {
            setMusicData(data);
        } else {
            setMusicData([]);
        }

        if (meta && meta.pagination) {
            setPagingnation(meta.pagination);
        }

        setIsLoading(false);
    }

    const handlePlay = (songData: SongPlayType) => {
        setActiveSong(songData.id);
        setSongPlay(songData);
    };

    const handleEnd = (currentIndex: number) => {
        if (musicDataState.length > currentIndex) {
            let nextSong = musicDataState[currentIndex + 1];
            let nextSongId = nextSong.id
            const wavesurfer = WaveSurferManager.getInstance(`#card${nextSongId}`, nextSongId);
            wavesurfer.play();
        }
    };

    const hanldeChangePage = async (event: React.SyntheticEvent<HTMLElement>,
        data: any) => {
        await searchMusicData(data.activePage)
        setPagingnation({
            ...pagingnation,
            page: data.activePage
        })
    };

    useEffect(() => {
        if (musicData) {
            setMusicDataState(musicData);
        }
    }, [musicData])

    useEffect(() => {
        const getMusicData = async () => {
            let { data, meta } = await getDataMusicApi(0, pagingnation.pageSize);
            if (data && data.length > 0) {
                setMusicData(data);
            } else {
                setMusicData([]);
            }

            if (meta && meta.pagination) {
                setPagingnation(meta.pagination);
            }

            setIsLoading(false);
        }
        getMusicData();
    }, [])

    useEffect(() => {
        const getAdsData = async () => {
            let { data } = await getAdsByTypeApi(AdsType.HORIZONTAL);
            if (data && data.length > 0) {
                setAds(data);
            }
        }
        if (!ads) {
            getAdsData();
        }
    }, [])


    useEffect(() => {
        const searchMusicData = async (input: string) => {
            setIsLoading(true)
            await WaveSurferManager.destroyAll()
            setSongPlay(null)
            setMusicData([]);

            let { data, meta } = await searchMusicApi(input, "all", 0, pagingnation.pageSize);
            if (data && data.length > 0) {
                setMusicData(data);
            } else {
                setMusicData([]);
            }

            if (meta && meta.pagination) {
                setPagingnation(meta.pagination);
            }
            dispatch(clearInputSearch());
            setIsLoading(false);
        }
        if (searchTrigger !== "") {
            searchMusicData(searchTrigger);
        }
    }, [searchTrigger])


    return (
        <div className={styles.container}>
            <div className={styles.filterZone}>
                <FilterComponent />
            </div>
            <div className={styles.musics_content}>
                {
                    ads && (
                        <Ads type={AdsType.HORIZONTAL} ads={ads} />
                    )
                }
                <div className={styles.songs}>
                    {
                        musicDataState && musicDataState.map((item: any, index: number) => {
                            let dataObject = item.attributes;
                            return <SongCard
                                key={item.id}
                                songContent={dataObject?.song_content?.data?.attributes?.url}
                                songImage={dataObject?.song_img?.data?.attributes?.url}
                                songName={dataObject?.song_name}
                                singer={dataObject?.singer_name} id={item.id}
                                isActive={activeSong === item.id.toString()}
                                onPlay={handlePlay}
                                currentIndex={index}
                                onEnd={handleEnd} />
                        })
                    }
                    {
                        ((!musicDataState || musicDataState.length == 0) && !isLoading) && (<>
                            Không có bài nhạc nào !
                        </>)
                    }
                    {isLoading && (
                        <Loader active inline='centered' content='Loading Music' />)
                    }
                </div>
                <div className={styles.loadMore}>
                    {
                        (!isLoading && pagingnation.pageCount > 0) && (
                            <Pagination
                                defaultActivePage={pagingnation.page}
                                firstItem={null}
                                lastItem={null}
                                pointing
                                secondary
                                totalPages={pagingnation.pageCount}
                                onPageChange={hanldeChangePage}
                            />
                        )
                    }
                </div>

            </div>
        </div>
    );
}

export default AppHomePage;