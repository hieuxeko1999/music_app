import axiosLib from 'axios'

/**
 * Axios instance for browser,
 * with `access-token` header injected
 */

let baseURL = 'https://music-app-api-hzfuh8ewaqb2fmbs.southeastasia-01.azurewebsites.net'
if (typeof window !== 'undefined') {
    baseURL = localStorage.getItem('baseurl') || baseURL
}

export const axios = axiosLib.create({
    baseURL: baseURL,
    headers: {
        Authorization:
            'Bearer 1f40d0ae83ddef83e4cb304a7277f065333a0c06562beb9604e8386abb283e2f5f646101257c0d6f8d9f5888d2b7cbf5cb503a8cab148ac2ecd824f6009586843b8a3998c7ec802a3a843149f6a0c56a3ad6ffe0b9223572ea1609b938d56b22d2ccf5f3e32824160a2caa2b151e8d4ba99ad5b8d95c66226c3dee1b5638b274',
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


