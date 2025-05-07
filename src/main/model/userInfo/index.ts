import { UserInfo } from '@/common/types';
import { ipcMain } from 'electron';
import { merge } from 'lodash-es';
let userInfo: UserInfo = {
  tokenInfo: {
    token: '',
    id: '11',
    expired: 300,
  },
};
export const getUserInfo = () => {
  return userInfo;
};

export const setUserInfo = (nextUserInfo: Partial<UserInfo>) => {
  return merge(userInfo, nextUserInfo);
};
ipcMain.on('clear', () => {
  userInfo = {
    tokenInfo: {
      token: '',
      id: '111111',
      expired: 300,
    },
  };
});
