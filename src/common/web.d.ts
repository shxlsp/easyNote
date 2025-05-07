import { BrowserWindow } from 'electron';
import { EasyNoteMode, MethodParams } from '@/common/types';
import { EventEmitter } from 'eventemitter3';
import { DefaultAction } from '@/main/model/store';

export {};

declare global {
  interface Window {
    jsBridge: {
      sendEvent: {
        windowShow: () => void;
        setAlwaysOnTop: (...args: Parameters<BrowserWindow['setAlwaysOnTop']>) => void;
        browserWindowMethodSync: <K extends keyof BrowserWindow>(
          methodName: K,
          ...args: MethodParams<BrowserWindow, K>
        ) => any;
        browserWindowMethodAsync: <K extends keyof BrowserWindow>(
          methodName: K,
          ...args: MethodParams<BrowserWindow, K>
        ) => any;
        setGlobalOnTop: (v: boolean) => void;
        changeEasyNoteMode: (mode: EasyNoteMode) => void;
        floatingWindowMove: (position: { x: number; y: number }) => void;
        getDefaultAction: () => Promise<DefaultAction>;
        createNewNote: () => void;
      };
      // 小记页面专用 模拟京ME平台事件
      call: (...args: any[]) => any;
      on: (eventName: string, cb: (...args: any) => any) => any;
      destroy: () => void;
      noteApi: {
        listNotes: () => Promise<Array<{ id: string; title: string; content: string; isPinned?: boolean }>>;
        readNote: (id: string) => Promise<{ id: string; title: string; content: string; isPinned?: boolean }>;
        createNote: (note: { title: string; content: string }) => Promise<{ id: string }>;
        updateNote: (note: { id: string; title: string; content: string; isPinned?: boolean }) => Promise<{ success: boolean }>;
        deleteNote: (id: string) => Promise<{ success: boolean }>;
        uploadImage: (buffer: Buffer, fileName: string) => Promise<{ path: string; md5: string }>;
      };
    };
    GlobalEventBus: EventEmitter;
  }
}
