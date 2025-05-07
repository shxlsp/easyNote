import { UserInfo } from '@/common/types';
import { BrowserWindow, session } from 'electron';
import { join } from 'path';
import { setUserInfo } from '../userInfo';
import { easyNoteWindowCreate } from './easyNoteWindow';
let loginWindow: BrowserWindow = null;

export const loginWindowCreate = (mode: string) => {
  // todo 登录窗口
  if(mode){
    easyNoteWindowCreate(mode);
    return;
  }
  if (loginWindow) {
    loginWindow.show();
    return;
  }
  loginWindow = new BrowserWindow({
    frame: false, // 创建无边框
    center: true,
    show: false,
    transparent: true, // 透明窗口
    hasShadow: true, // 是否需要阴影
    enableLargerThanScreen: true,
    width: 500,
    height: 500,
    webPreferences: {
      preload: join(__dirname, './preloads/easyNotePreload.js'),
      nodeIntegration: true,
      contextIsolation: false,
      devTools: mode === 'pre',
    },
  });
    loginWindow.loadFile('./sqliteWeb.html');
  // loginWindow.loadURL(
  //   ''
  // );
  loginWindow.webContents.on('will-navigate', (event) => {
    if (event.url.startsWith('xxx')) {
      session.defaultSession.cookies.get({ url: 'xxx' }).then((cookies) => {
        const tokenInfo: UserInfo['tokenInfo'] = {};
        cookies.forEach((i) => {
          switch (i.name) {
            case 'token':
              tokenInfo.token = i.value;
              tokenInfo.expired = Math.floor(i.expirationDate * 1000);
              break;
            case 'id':
              tokenInfo.id = i.value;
              break;
            default:
              break;
          }
        });
        setUserInfo({ tokenInfo });
        loginWindow.webContents.close();
        easyNoteWindowCreate(mode);
      });
    }
  });
  setTimeout(() => {
    loginWindow?.show();
  }, 500);
  loginWindow.on('closed', () => {
    loginWindow = null;
  });
  return loginWindow;
};
