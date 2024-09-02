import axiosLib from 'axios'

/**
 * Axios instance for browser,
 * with `access-token` header injected
 */

let baseURL = 'https://music-box-api-btcdd0ehfcgsbxdj.southeastasia-01.azurewebsites.net'
if (typeof window !== 'undefined') {
    baseURL = localStorage.getItem('baseurl') || baseURL
}

export const axios = axiosLib.create({
    baseURL: baseURL,
    headers: {
        Authorization:
            'Bearer a01c16fcc9a1c8b839bbce9b4e6e3f70d94cd65e0d309767c050c9ebf9d4e521477d6d9f5c78b495ed164360cdd7cf8a4d63d95bef17afcb822d291434c4faeda4f6838d7d37b1ebfdbec6f5a647bb4f8a10ba0c3321325fbac308b1b1cac48bb1ed677914cc392a91d19974c37f27ef036fd57d511139d2dfcff9ac97965079',
    },
})

axios.interceptors.response.use(
    (response) => response,
    (error) => {
        return Promise.reject(error)
    }
)

axios.interceptors.request.use((config) => {
    return config
})


