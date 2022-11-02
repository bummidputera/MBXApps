import { postAPI } from './httpService';

export const fetchFavoriteTenant = async(body) => {
    const endpoint = 'favorite-tenant/like';
    const result = await postAPI(endpoint, body);
    console.log(`result ${endpoint}`, body, result);
    return result;
}