import { BrowserWindow } from 'electron';

export const toggleResizable = (win: BrowserWindow, resizable = true) => {
  win.setResizable(resizable);
  win.setFullScreenable(resizable);
  win.setMinimizable(resizable);
  win.setMaximizable(resizable);
};
