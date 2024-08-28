'use client'

import React, { useEffect, useState } from 'react';
import styles from '../styles/header.module.scss';
import { Button, Input } from 'semantic-ui-react';
import { useSongPlayContext } from '@/contexts/SongPlayContext';
import { getAllCategoriesApi } from '@/services/categories.services';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/store';
import { addInputSearch } from '@/store/features/counter/counterSlice';
import { usePathname } from 'next/navigation';


interface HeaderProps {
}

const AppHeader: React.FC<HeaderProps> = () => {
    const dispatch = useDispatch<AppDispatch>();
    const pathname = usePathname()
    const handleLogoClick = () => {
        window.location.href = '/';
    };
    const {
        categoriesData,
        setCategoriesData,
        setSearchObject,
    } = useSongPlayContext();
    const [inputData, setInputData] = useState<string>("");


    const handleTypeing = (e: any) => {
        setInputData(e.currentTarget.value);
    }

    const hanldeSearch = () => {
        dispatch(addInputSearch(inputData));
        if (pathname != "/") {
            window.location.href = '/';
        }
        setSearchObject({
            input: inputData,
            type: "all"
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
                        MUSIC APP
                    </div>
                    <div className={styles["header__content"]}>
                        <Input type='text' placeholder='Search...' icon='search' iconPosition='left' onChange={handleTypeing} />
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