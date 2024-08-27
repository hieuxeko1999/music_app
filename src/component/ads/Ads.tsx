'use client'
import React, { useEffect, useState } from 'react';
import styles from "./Ads.module.scss"
import { Image } from "semantic-ui-react";
export const AdsType = {
    HORIZONTAL: 'horizontal',
    VERTICAL: 'vertical',
}

interface Ads {
    type: string;
    ads: any;
}

const Ads: React.FC<Ads> = ({ type, ads }) => {
    const [adsData, setAdsData] = useState<any>(null);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleClickAds = (url: string) => {
        window.open(url)
    }

    useEffect(() => {
        if (!adsData) {
            setAdsData(ads)
        }
    }, [ads])

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((prevIndex) => (prevIndex + 1) % adsData.length);
        }, 3000); // Change ads every 2 seconds

        return () => clearInterval(interval); // Cleanup interval on component unmount
    }, [adsData]);

    return (
        <div className={`${styles.AdsContainer} ${type === AdsType.VERTICAL ? styles.vertical : styles.horizontal}`}>
            {
                adsData && (
                    <Image
                        className={styles.adsImg}
                        onClick={() => handleClickAds(adsData[currentIndex].attributes.ads_url)}
                        src={adsData[currentIndex].attributes.ads_media.data.attributes.url}
                        alt="Advertisement"
                    />
                )
            }
        </div>
    );
};

export default Ads;
