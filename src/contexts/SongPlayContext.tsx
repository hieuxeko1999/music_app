'use client'

import React, {
    createContext,
    RefObject,
    useContext,
    useRef,
    useState,
} from "react";

interface SongPlayContextProviderProps {
    children: React.ReactNode;
}

export interface SongPlayType {
    songImg: string,
    songName: string,
    singer: string,
    songContent: string,
    id: string
}

export interface CategoriesType {
    key: string,
    text: string,
    value: string
}

export interface SearchSongType {
    input: string,
    type: string,
}
export interface Paging {
    page: number,
    pageCount: number,
    pageSize: number,
    total: number,
}

interface SongPlayContextContextType {
    songPlay: SongPlayType | null;
    setSongPlay: (data: SongPlayType | null) => void;
    setVolumn: (data: number) => void;
    volumn: number
    setCategoriesData: (data: CategoriesType[]) => void;
    categoriesData: CategoriesType[]
    setSearchObject: (data: SearchSongType) => void;
    searchObject: SearchSongType
    setMusicData: (data: any) => void;
    musicData: any
    setIsLoading: (data: boolean) => void;
    isLoading: boolean
    setPagingnation: (data: Paging) => void;
    pagingnation: Paging
    setIsPlayRelatedSong: (data: string | null) => void;
    isPlayRelatedSong: string | null
}

export const SongPlayContextContext = createContext<
    SongPlayContextContextType | undefined
>(undefined);

export const SongPlayContextProvider: React.FC<
    SongPlayContextProviderProps
> = ({ children }) => {
    const [songPlay, setSongPlay] = useState<SongPlayType | null>(null);
    const [categoriesData, setCategoriesData] = useState<CategoriesType[]>([]);
    const [searchObject, setSearchObject] = useState<SearchSongType>({
        input: "",
        type: "all"
    });
    const [volumn, setVolumn] = useState<number>(0.5);
    const [musicData, setMusicData] = useState<any>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isPlayRelatedSong, setIsPlayRelatedSong] = useState<string | null>(null);
    const [pagingnation, setPagingnation] = useState<Paging>({
        page: 1,
        pageCount: 0,
        pageSize: 7,
        total: 0,
    });

    return (
        <SongPlayContextContext.Provider value={{
            songPlay,
            setSongPlay,
            volumn,
            setVolumn,
            categoriesData,
            setCategoriesData,
            searchObject,
            setSearchObject,
            musicData,
            setMusicData,
            isLoading,
            setIsLoading,
            pagingnation,
            setPagingnation,
            isPlayRelatedSong,
            setIsPlayRelatedSong
        }}>
            {children}
        </SongPlayContextContext.Provider>
    );
};

export const useSongPlayContext = () => {
    const context = useContext(SongPlayContextContext);
    if (!context) {
        throw new Error(
            "use SongPlayContextContext must be used within a SongPlayContextProvider"
        );
    }
    return context;
};
