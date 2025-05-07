import { BrowserWindow, ipcMain, IpcMainEvent, IpcMainInvokeEvent } from 'electron';
import { IPC_EVENT_NAMES } from '@/common/events';
import { createNameSpaceLog } from './log';
const ipcLog = createNameSpaceLog('utils:ipc ');
export const ipcMainOn = (
  eventName: IPC_EVENT_NAMES,
  cb: (event: { event: IpcMainEvent; currentWindow: BrowserWindow }, ...args: any[]) => any
) => {
  ipcMain.on(eventName, (event, ...args: any[]) => {
    try {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win) {
        throw new Error('current window not exist');
      }
      return cb(
        {
          event,
          currentWindow: win,
        },
        ...args
      );
    } catch (error) {
      ipcLog(error, 'error');
    }
  });
};

export const ipcMainHandle = (
  eventName: IPC_EVENT_NAMES,
  cb: (event: { event: IpcMainInvokeEvent; currentWindow: BrowserWindow }, ...args: any[]) => any
) => {
  ipcMain.handle(eventName, (event, ...args: any[]) => {
    try {
      const win = BrowserWindow.fromWebContents(event.sender);
      if (!win) {
        throw new Error('current window not exist');
      }
      return cb(
        {
          event,
          currentWindow: win,
        },
        ...args
      );
    } catch (error) {
      ipcLog(error, 'error');
    }
  });
};
