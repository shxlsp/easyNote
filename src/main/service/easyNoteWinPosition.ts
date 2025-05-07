import { BrowserWindow } from 'electron';
import { toggleResizable } from '../utils/win';
import { getCurrentDisplay, snapWindowToEdge } from '../utils';
import {
  getEasyNoteWindowConfigSize,
  setEasyNoteWindowConfigSize,
} from '../model/broswerWindow/easyNoteWindow';
import { ExpandMode } from '@/main/model/store';

const margin = 10;
const floatingWindowConfig = {
  width: 36,
  height: 36,
};

export const setEasyNoteFloatingMode = (win: BrowserWindow) => {
  const { width, height } = win.getBounds();
  snapWindowToEdge(win, {
    width: floatingWindowConfig.width,
    height: floatingWindowConfig.height,
    margin,
  });
  setEasyNoteWindowConfigSize({
    width,
    height,
  });
  toggleResizable(win, false);
};

let floatingWindowMoveTimeoutKey = null;

export const setEasyNoteNormalgMode = (win: BrowserWindow, expandMode: ExpandMode) => {
  const { width, height } = getEasyNoteWindowConfigSize();
  clearTimeout(floatingWindowMoveTimeoutKey);

  let x;
  let y;
  const { x: currentX, y: currentY } = win.getBounds();
  const display = getCurrentDisplay(win);
  const { width: screenWidth, height: screenHeight } = display.workAreaSize;

  if (expandMode === ExpandMode.Center) {
    x = Math.round((screenWidth - width) / 2);
    y = Math.round((screenHeight - height) / 2);
  } else {
    // ExpandMode.Follow
    if (currentX <= screenWidth / 2) {
      // 左侧展开
      x = margin;
    } else {
      // 右侧展开
      x = screenWidth - width - margin;
    }
    y = currentY;
  }

  win.setBounds({ x, y, width, height }, true);
  toggleResizable(win, true);
};

export const easyNoteMove = (win: BrowserWindow, data: { x: number; y: number }) => {
  const { width, height } = win.getBounds();
  win.setBounds({ x: data.x, y: data.y, width, height });
  clearTimeout(floatingWindowMoveTimeoutKey);
  // 添加拖拽结束后的吸附逻辑
  floatingWindowMoveTimeoutKey = setTimeout(() => {
    const { width, height } = win.getBounds();
    snapWindowToEdge(win, {
      width,
      height,
      margin,
    });
  }, 500); // 拖拽结束检测延时，单位毫秒
};
