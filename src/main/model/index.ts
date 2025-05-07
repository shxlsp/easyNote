import { getUserInfo, setUserInfo } from './userInfo';
export const envMode = process.argv.includes('--pre') ? 'pre' : 'prod';

export default {
  getUserInfo,
  setUserInfo,
};
