import { axios } from '@/lib/axiosConfig'
import qs from 'qs';
import { ApiResponse } from './musics.services';

export const getAllCategoriesApi = async () => {
    const query = qs.stringify(
        {
            fields: ['name', 'uuid', 'active'],
            filters: {
                active: {
                    $eq: true,
                },
            },
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );

    try {
        const response = await axios.get<ApiResponse<any>>(`/api/music-categories?${query}`);
        const data = response.data.data;
        const meta = response.data.meta;
        return { data, meta };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
