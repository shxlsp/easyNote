import { IPC_EVENT_NAMES } from '@/common/events';
import { getUserInfo } from '@/main/model/userInfo';
import { ipcMainHandle, ipcMainOn } from '@/main/utils';
import { EasyNoteMode } from '@/common/types';
import {
  easyNoteMove,
  setEasyNoteFloatingMode,
  setEasyNoteNormalgMode,
} from '@/main/service/easyNoteWinPosition';
import {
  getExpandMode,
  setExpandMode,
  getDefaultAction,
  setDefaultAction,
  ExpandMode,
  DefaultAction,
} from '@/main/model/store';
import { envMode } from '@/main/model';
import { databaseService } from '@/main/service/database';
import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';

export const bizController = () => {
  // 初始化数据库表
  databaseService.initializeTables();

  // 笔记CRUD接口
  ipcMainHandle(IPC_EVENT_NAMES.CREATE_NOTE, async (event, { title, content }) => {
    const id = await databaseService.createNote(title, content);
    return { id };
  });

  ipcMainHandle(IPC_EVENT_NAMES.READ_NOTE, async (event, id: number) => {
    return await databaseService.readNote(id);
  });

  ipcMainHandle(IPC_EVENT_NAMES.UPDATE_NOTE, async (event, { id, title, content, isPinned }) => {
    await databaseService.updateNote(id, title, content, isPinned);
    return { success: true };
  });

  ipcMainHandle(IPC_EVENT_NAMES.DELETE_NOTE, async (event, id: number) => {
    await databaseService.deleteNote(id);
    return { success: true };
  });

  ipcMainHandle(IPC_EVENT_NAMES.LIST_NOTES, async () => {
    return await databaseService.listNotes();
  });

  // 图片上传，带MD5去重和加密
  ipcMainHandle(IPC_EVENT_NAMES.UPLOAD_IMAGE, async (event, fileBuffer: Buffer, fileName: string) => {
    const md5 = crypto.createHash('md5').update(fileBuffer).digest('hex');
    // 加密处理（示例：此处实际可根据需求选择加密算法）
    const encryptedBuffer = fileBuffer; // TODO: 可替换为加密后的buffer
    const imgDir = path.join(app.getPath('userData'), 'img');
    if (!fs.existsSync(imgDir)) fs.mkdirSync(imgDir, { recursive: true });
    const savePath = path.join(imgDir, md5 + path.extname(fileName));
    if (!fs.existsSync(savePath)) fs.writeFileSync(savePath, encryptedBuffer);
    const finalPath = await databaseService.uploadImage(savePath, md5);
    return { path: finalPath, md5 };
  });

  // 展开模式选择
  ipcMainHandle(IPC_EVENT_NAMES.SET_EXPAND_MODE, (event, mode: ExpandMode) => {
    setExpandMode(mode);
  });

  // 获取当前展开模式
  ipcMainHandle(IPC_EVENT_NAMES.GET_EXPAND_MODE, () => {
    return getExpandMode();
  });

  // 设置开启轻记默认操作
  ipcMainHandle(IPC_EVENT_NAMES.SET_DEFAULT_ACTION, (event, action: DefaultAction) => {
    setDefaultAction(action);
  });

  // 获取当前开启轻记默认操作
  ipcMainHandle(IPC_EVENT_NAMES.GET_DEFAULT_ACTION, () => {
    return getDefaultAction();
  });

  ipcMainHandle(IPC_EVENT_NAMES.GET_TOKEN, () => {
    return getUserInfo().tokenInfo;
  });

  ipcMainHandle(IPC_EVENT_NAMES.CHANGE_EASY_NOTE_MODE, (event, mode: EasyNoteMode) => {
    const win = event.currentWindow;
    switch (mode) {
      case EasyNoteMode.floatingWindow:
        return setEasyNoteFloatingMode(win);
      case EasyNoteMode.normalWindow: {
        const expandMode = getExpandMode();
        return setEasyNoteNormalgMode(win, expandMode);
      }
      default:
        break;
    }
  });
  ipcMainOn(IPC_EVENT_NAMES.FLOATING_WINDOW_MOVE, (event, data: { x: number; y: number }) => {
    easyNoteMove(event.currentWindow, data);
  });
};
