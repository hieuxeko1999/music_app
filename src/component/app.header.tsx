'use client'

import React, { useEffect, useState } from 'react';
import styles from '../styles/header.module.scss';
import { Button, Input, Select } from 'semantic-ui-react';
import { useSongPlayContext } from '@/contexts/SongPlayContext';
import { getAllCategoriesApi } from '@/services/categories.services';
import { searchMusicApi } from '@/services/musics.services';
import WaveSurferManager from '@/contexts/WaveSurferManager';
import { useRouter } from 'next/navigation'
import { usePathname } from 'next/navigation'


interface HeaderProps {
}

const AppHeader: React.FC<HeaderProps> = () => {
    const router = useRouter();
    const pathname = usePathname();

    const handleLogoClick = () => {
        window.location.href = '/';
    };
    const { setSongPlay, categoriesData, setCategoriesData, searchObject, setSearchObject, setIsLoading, setMusicData, setPagingnation, pagingnation } = useSongPlayContext();

    const [inputData, setInputData] = useState<string>("");
    const [selectData, setSelectData] = useState<string>("");


    const handleTypeing = (e: any) => {
        setInputData(e.currentTarget.value);
    }
    const handleChange = (event: React.SyntheticEvent<HTMLElement>,
        data: any) => {
        setSelectData(data.value);
    }
    const searchMusicData = async (input: string, type: string) => {
        setIsLoading(true)
        await WaveSurferManager.destroyAll()
        setSongPlay(null)
        setMusicData([]);

        let { data, meta } = await searchMusicApi(input, type, 0, pagingnation.pageSize);
        if (data && data.length > 0) {
            setMusicData(data);
        } else {
            setMusicData([]);
        }

        if (meta && meta.pagination) {
            setPagingnation(meta.pagination);
        }

        if (pathname !== "/") {
            window.location.href = '/';
        }

        setIsLoading(false);
    }

    const hanldeSearch = () => {
        searchMusicData(inputData, selectData);
        setSearchObject({
            input: inputData,
            type: selectData
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
        <header className={styles["header"]}>
            <div className={"container_main"}>
                <div className={styles["header_top"]}>
                    <div className={styles["header__logo"]} onClick={handleLogoClick}>
                        {/* <img src={logoUrl} alt={`${title} logo`} /> */}
                        LOGO
                    </div>
                    <div className={styles["header__content"]}>
                        <Input type='text' placeholder='Search...' icon='search' iconPosition='left' onChange={handleTypeing} />
                        <Select className={styles.dropDown} options={categoriesData} defaultValue={searchObject.type} onChange={handleChange} />
                        <Button inverted color='green' onClick={hanldeSearch}>
                            Tìm
                        </Button>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AppHeader;