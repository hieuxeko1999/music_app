'use client'
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { getDataMusicByIdApi } from "@/services/musics.services";
import SongCardDetail from "@/component/songCard/songCardDetail.component";
import styles from './detailSong.module.scss'
import { getAdsByTypeApi } from "@/services/ads.services";
import Ads, { AdsType } from "@/component/ads/Ads";
import { Dimmer, Loader } from "semantic-ui-react";
import { useSongPlayContext } from "@/contexts/SongPlayContext";
import RelatedSong from "@/component/relatedSong/RelatedSong";

export default function DetailSong() {
  const param = useParams();
  const [musicId, setMusicId] = useState<string>("");
  const [musicData, setMusicData] = useState<any>(null);
  const [ads, setAds] = useState<any>(null);
  const { isLoading, setIsLoading } = useSongPlayContext();
  const getLastPartOfSlug = (slug: any) => {
    const parts = slug.split('-');
    return parts[parts.length - 1];
  }

  useEffect(() => {
    if (param) {
      let idMusic = getLastPartOfSlug(param.slug);
      setMusicId(idMusic);
    }
  }, [param]);

  useEffect(() => {
    const getMusicData = async () => {
      let { data } = await getDataMusicByIdApi(musicId);
      if (data) {
        setMusicData(data);
      }
    }

    if (musicId && musicId != "") {
      getMusicData();
    }
    setIsLoading(false);
  }, [musicId])


  useEffect(() => {
    const getAdsData = async () => {
      let { data } = await getAdsByTypeApi(AdsType.VERTICAL);
      if (data && data.length > 0) {
        setAds(data);
      }
    }
    if (!ads) {
      getAdsData();
    }
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.leftZone}>
        {
          musicData && (
            <>
              <SongCardDetail songContent={musicData?.attributes?.song_content?.data?.attributes?.url
              } songImage={musicData?.attributes?.song_img?.data?.attributes?.url} songName={musicData?.attributes?.song_name} singer={musicData?.attributes?.singer_name
              } id={musicData?.id} />
              <div className={styles.listMusic}>
                <h4>Bài hát liên quan</h4>
                <RelatedSong currentSong={musicData?.id} type={musicData?.attributes?.music_category?.data?.attributes?.uuid} />
              </div>
            </>
          )
        }

      </div>
      <div className={styles.rightZone}>
        <Ads type={AdsType.VERTICAL} ads={ads} />
      </div>
      {isLoading && (
        <Dimmer active inverted>
          <Loader inverted content='Loading' />
        </Dimmer>)}
    </div>

  );
}