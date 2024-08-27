import React, { useEffect, useState } from 'react';
import styles from "./RelatedSong.module.scss"
import { SongPlayType, useSongPlayContext } from '@/contexts/SongPlayContext';
import { getReleatedDataMusicApi, searchMusicApi } from '@/services/musics.services';
import { Loader, Pagination } from 'semantic-ui-react';
import SongCard from '../songCard/songCard.component';
import WaveSurferManager from '@/contexts/WaveSurferManager';

interface RelatedSongProps {
    currentSong: number,
    type: string
}

const RelatedSong: React.FC<RelatedSongProps> = ({ currentSong, type }) => {
    const [activeSong, setActiveSong] = useState<string | null>(null);
    const { setSongPlay, musicData,
        setMusicData, isLoading,
        setIsLoading,
        pagingnation, setPagingnation,
        searchObject
    } = useSongPlayContext();
    const [musicDataState, setMusicDataState] = useState<any>(null);


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
            let { data, meta } = await getReleatedDataMusicApi(currentSong, type, 0, pagingnation.pageSize);
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

    return (
        <div className={styles.relatedSongContainer}>
            <div className={styles.songs}>
                {
                    musicDataState && musicDataState.filter((song: any) => currentSong != song.id).map((item: any) => {
                        let dataObject = item.attributes;
                        return <SongCard
                            key={item.id}
                            songContent={dataObject?.song_content?.data?.attributes?.url}
                            songImage={dataObject?.song_img?.data?.attributes?.url}
                            songName={dataObject?.song_name}
                            singer={dataObject?.singer_name} id={item.id}
                            isActive={activeSong === item.id.toString()}
                            onPlay={handlePlay} />
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
    );
};

export default RelatedSong;
