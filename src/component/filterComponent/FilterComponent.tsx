import { useSongPlayContext } from '@/contexts/SongPlayContext';
import { getAllCategoriesApi } from '@/services/categories.services';
import React, { useEffect } from 'react'
import styles from './FilterComponentProps.module.scss'
import WaveSurferManager from '@/contexts/WaveSurferManager';
import { searchMusicApi } from '@/services/musics.services';



const FilterComponent = () => {
    const { searchObject, setSearchObject, categoriesData, setCategoriesData, setIsLoading, setSongPlay, setMusicData, pagingnation, setPagingnation } = useSongPlayContext();



    const searchMusicData = async (type: string) => {
        setIsLoading(true)
        await WaveSurferManager.destroyAll()
        setSongPlay(null)
        setMusicData([]);

        let { data, meta } = await searchMusicApi("", type, 0, pagingnation.pageSize);
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


    const handleOpenByType = (type: string) => {
        searchMusicData(type);
        setSearchObject({
            ...searchObject,
            type: type
        })
    }

    useEffect(() => {
        const getCategoriesData = async () => {
            let { data } = await getAllCategoriesApi();
            if (data && data.length > 0) {
                let allItem = [{ key: 'all', text: 'All', value: 'all' }];
                let newDropDown = data.map((item: any) => {
                    return {
                        key: item.attributes.uuid,
                        text: item.attributes.name,
                        value: item.attributes.uuid
                    }
                })
                let result = allItem.concat(newDropDown);
                setCategoriesData(result);
            }
        }
        if (!categoriesData || categoriesData.length == 0) {
            getCategoriesData();
        }
    }, [categoriesData])

    return (
        <div className={styles.filterContainer}>
            {
                categoriesData.map((item, index) =>
                    <div key={index} className={styles.categoryItem} onClick={() => handleOpenByType(item.key)}>
                        {item.text}
                    </div>
                )
            }
        </div>
    )

}

export default FilterComponent