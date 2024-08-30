import { axios } from '@/lib/axiosConfig'
import qs from 'qs';

// Define types for API response
export interface Meta {
    pagination: {
        page: number;
        pageSize: number;
        pageCount: number;
        total: number;
    };
}

export interface ApiResponse<T> {
    data: T[];
    meta: Meta;
}

export const getDataMusicApi = async (page: number, pageSize: number) => {
    const query = qs.stringify(
        {
            fields: ['song_name', 'singer_name', 'active'],
            populate: {
                song_content: {
                    fields: ['url'],
                },
                song_img: {
                    fields: ['url'],
                },
                music_category: {
                    fields: ['name', 'uuid'],
                },
            },
            filters: {
                active: {
                    $eq: true,
                },
            },
            sort: ['updatedAt:desc'],
            pagination: {
                page: page - 1,      // Page number (1-based)
                pageSize,  // Number of items per page
            },
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    try {
        const response = await axios.get<ApiResponse<any>>(`/api/music?${query}`);
        const data = response.data.data;
        const meta = response.data.meta;
        return { data, meta };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const getReleatedDataMusicApi = async (exceptSong: number, type: string, page: number, pageSize: number) => {
    let queryObject = {
        fields: ['song_name', 'singer_name', 'active'],
        populate: {
            song_content: {
                fields: ['url'],
            },
            song_img: {
                fields: ['url'],
            },
            music_category: {
                fields: ['name', 'uuid'],
            },
        },
        filters: {
            $and: [
                {
                    active: true,
                },
                {
                    id: {
                        $ne: exceptSong,  // Exclude the song with the given ID
                    },
                },
                {
                    music_category: {
                        uuid: {
                            $eq: type, // Exact match for category name
                        },
                    }
                }
            ],
        },
        sort: ['updatedAt:asc'],
        pagination: {
            page: page - 1,      // Page number (1-based)
            pageSize,  // Number of items per page
        },
    }

    const query = qs.stringify(
        queryObject,
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    try {
        const response = await axios.get<ApiResponse<any>>(`/api/music?${query}`);
        const data = response.data.data;
        const meta = response.data.meta;
        return { data, meta };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}


export const getDataMusicByIdApi = async (id: string) => {
    try {
        const response = await axios.get<ApiResponse<any>>(`/api/music/${id}/?populate=*`);
        const data = response.data.data;
        const meta = response.data.meta;

        return { data, meta };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const searchMusicApi = async (input: string, type: string, page: number, pageSize: number) => {
    let queryObject = {
        fields: ['song_name', 'singer_name', 'active'],
        populate: {
            song_content: {
                fields: ['url'],
            },
            song_img: {
                fields: ['url'],
            },
            music_category: {
                fields: ['name'],
            },
        },
        filters: {
            active: {
                $eq: true,
            },
        } as Record<string, any>,
        sort: ['updatedAt:asc'],
        pagination: {
            page: page - 1,      // Page number (1-based)
            pageSize,  // Number of items per page
        },
    };

    if (input && input.trim() !== "") {
        queryObject.filters.$or = [
            { song_name: { $containsi: input } },  // Case-insensitive partial match for song_name
            { singer_name: { $containsi: input } } // Case-insensitive partial match for singer_name
        ];
    }

    if (type && type.trim() !== "all") {
        queryObject.filters.music_category = {
            uuid: {
                $eq: type, // Exact match for category name
            },
        };
    }

    const query = qs.stringify(
        queryObject,
        {
            encodeValuesOnly: true, // prettify URL
        }
    );


    try {
        const response = await axios.get<ApiResponse<any>>(`/api/music?${query}`);
        const data = response.data.data;
        const meta = response.data.meta;

        return { data, meta };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}