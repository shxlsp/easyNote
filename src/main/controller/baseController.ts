import { BrowserWindow } from 'electron';
import { ipcMainHandle, ipcMainOn } from '../utils/ipc';
import { IPC_EVENT_NAMES } from '@/common/events';
import { MethodParams } from '@/common/types';
import { createNameSpaceLog } from '../utils';
const log = createNameSpaceLog('baseController', true);

export const windowController = () => {
  // 主窗口展示
  ipcMainOn(IPC_EVENT_NAMES.WINDOW_SHOW, (event) => {
    log('主窗口展示');
    event.currentWindow.show();
  });

  ipcMainOn(
    IPC_EVENT_NAMES.SET_ALWAYS_ON_TOP,
    (event, ...args: Parameters<BrowserWindow['setAlwaysOnTop']>) => {
      log('setAlwaysOnTop', ...args);
      event.currentWindow.setAlwaysOnTop(...args);
    }
  );

  ipcMainOn(
    IPC_EVENT_NAMES.BROWSER_WINDOW_METHOD_SYNC,
    <K extends keyof BrowserWindow>(
      event,
      methodName: K,
      ...args: MethodParams<BrowserWindow, K>
    ) => {
      log(methodName, ...args, event.currentWindow[methodName]);
      if (event.currentWindow[methodName] instanceof Function) {
        return event.currentWindow[methodName](...args);
      }
      return event.currentWindow[methodName];
    }
  );

  ipcMainHandle(
    IPC_EVENT_NAMES.BROWSER_WINDOW_METHOD_ASYNC,
    <K extends keyof BrowserWindow>(
      event,
      methodName: K,
      ...args: MethodParams<BrowserWindow, K>
    ) => {
      log(methodName, ...args, event.currentWindow[methodName]);
      if (event.currentWindow[methodName] instanceof Function) {
        return event.currentWindow[methodName](...args);
      }
      return event.currentWindow[methodName];
    }
  );
};
