import { axios } from '@/lib/axiosConfig'
import qs from 'qs';
import { ApiResponse } from './musics.services';

export const getAdsByTypeApi = async (typeInput: string) => {
    const query = qs.stringify(
        {
            fields: ['ads_url', 'type', 'active'],
            populate: {
                ads_media: {
                    fields: ['url'],
                },
            },
            filters: {
                type: {
                    $eq: typeInput,
                },
            },
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    try {
        const response = await axios.get<ApiResponse<any>>(`/api/ads?${query}`);
        const data = response.data.data;
        const meta = response.data.meta;

        return { data, meta };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}

export const getAdsApi = async () => {
    const query = qs.stringify(
        {
            fields: ['ads_url', 'type', 'active'],
            populate: {
                ads_media: {
                    fields: ['url'],
                },
            }
        },
        {
            encodeValuesOnly: true, // prettify URL
        }
    );
    try {
        const response = await axios.get<ApiResponse<any>>(`/api/ads?${query}`);
        const data = response.data.data;
        const meta = response.data.meta;

        return { data, meta };
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
}
