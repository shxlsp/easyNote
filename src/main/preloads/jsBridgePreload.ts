import { ipcRenderer } from 'electron';
import { IPC_EVENT_NAMES } from '@/common/events';
import { DefaultAction } from '../model/store';
// '@/common/web' 每次增加内容，需要在common/web.d.ts中添加ts定义
const sendEvent = {
  windowShow: () => {
    ipcRenderer.send(IPC_EVENT_NAMES.WINDOW_SHOW);
  },
  setAlwaysOnTop: (...args) => {
    ipcRenderer.send(IPC_EVENT_NAMES.SET_ALWAYS_ON_TOP, ...args);
  },
  browserWindowMethodSync: (...args) => {
    return ipcRenderer.send(IPC_EVENT_NAMES.BROWSER_WINDOW_METHOD_SYNC, ...args);
  },
  browserWindowMethodAsync: (...args) => {
    return ipcRenderer.invoke(IPC_EVENT_NAMES.BROWSER_WINDOW_METHOD_ASYNC, ...args);
  },
  setGlobalOnTop: (v) => {
    sendEvent.setAlwaysOnTop(v, 'screen-saver');
    sendEvent.browserWindowMethodAsync('setVisibleOnAllWorkspaces', v, {
      visibleOnFullScreen: v,
    });
  },
  changeEasyNoteMode: (mode) => {
    return ipcRenderer.invoke(IPC_EVENT_NAMES.CHANGE_EASY_NOTE_MODE, mode);
  },
  floatingWindowMove: (data) => {
    return ipcRenderer.send(IPC_EVENT_NAMES.FLOATING_WINDOW_MOVE, data);
  },
  getDefaultAction: (): Promise<DefaultAction> => {
    return ipcRenderer.invoke(IPC_EVENT_NAMES.GET_DEFAULT_ACTION);
  },
  createNewNote: () => {
    // 暂时不实现该方法
    // return ipcRenderer.invoke(IPC_EVENT_NAMES.CREATE_NEW_NOTE);
  },
  getDbBuffer: async () => {
    // 返回ArrayBuffer，兼容webview/iframe注入
    const buffer = await ipcRenderer.invoke('GET_SQLITE_DB_BUFFER');
    // Electron返回的是Uint8Array对象，需转为ArrayBuffer
    if (buffer instanceof Uint8Array) {
      return buffer.buffer.slice(buffer.byteOffset, buffer.byteOffset + buffer.byteLength);
    }
    if (buffer instanceof ArrayBuffer) {
      return buffer;
    }
    // 其它情况直接返回
    return buffer;
  }
};
const noteApi = {
  listNotes: () => ipcRenderer.invoke(IPC_EVENT_NAMES.LIST_NOTES),
  readNote: (id: string) => ipcRenderer.invoke(IPC_EVENT_NAMES.READ_NOTE, id),
  createNote: ({ title, content }: { title: string; content: string }) => 
    ipcRenderer.invoke(IPC_EVENT_NAMES.CREATE_NOTE, { title, content }),
  updateNote: ({ id, title, content, isPinned }: { id: string; title: string; content: string; isPinned?: boolean }) => 
    ipcRenderer.invoke(IPC_EVENT_NAMES.UPDATE_NOTE, { id, title, content, isPinned }),
  deleteNote: (id: string) => ipcRenderer.invoke(IPC_EVENT_NAMES.DELETE_NOTE, id),
  uploadImage: (buffer: Buffer, fileName: string) => 
    ipcRenderer.invoke(IPC_EVENT_NAMES.UPLOAD_IMAGE, buffer, fileName),
};

window.jsBridge = {
  sendEvent,
  call: () => {},
  on: () => {},
  destroy: () => {},
  noteApi,
};

