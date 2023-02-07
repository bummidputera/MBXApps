import {postAPI} from './httpService';

export const fetchComment = async body => {
  const endpoint = 'comment';
  const result = await postAPI(endpoint, body);
  console.log(`result ${endpoint} ${body}`, result);
  return result;
};