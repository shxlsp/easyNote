import { BrowserWindow } from 'electron';
import path, { join } from 'path';
import { merge } from 'lodash-es';
let easyNoteWindow: BrowserWindow = null;
interface EasyNoteWindowConfigSize {
  width: number;
  height: number;
}
export const easyNoteWindowConfigSize: EasyNoteWindowConfigSize = {
  width: 500,
  height: 700,
};
export const easyNoteWindowConfig = (mode: string) => ({
  frame: false, // 创建无边框
  center: true,
  show: true,
  transparent: true, // 透明窗口
  hasShadow: true, // 是否需要阴影
  enableLargerThanScreen: true,
  ...easyNoteWindowConfigSize,
  webPreferences: {
    preload: join(__dirname, './preloads/easyNotePreload.js'),
    nodeIntegration: true,
    contextIsolation: false,
    devTools: mode === 'pre',
  },
});
export const easyNoteWindowCreate = (mode: string) => {
  if (easyNoteWindow) {
    easyNoteWindow.webContents.reload();
    easyNoteWindow.show();
    return;
  }
  easyNoteWindow = new BrowserWindow(easyNoteWindowConfig(mode));
  easyNoteWindow.loadFile(path.join(__dirname, './easyNote.html'));
  if (mode === 'pre') {
    setTimeout(() => {
      easyNoteWindow.webContents.openDevTools();
      console.log('open dev tools');
    }, 1000);
  }
  easyNoteWindow.on('closed', () => {
    easyNoteWindow = null;
  });

  return easyNoteWindow;
};

export const getEasyNoteWindowConfigSize = () => easyNoteWindowConfigSize;
export const setEasyNoteWindowConfigSize = (data: Partial<EasyNoteWindowConfigSize>) => {
  merge(easyNoteWindowConfigSize, data);
};
