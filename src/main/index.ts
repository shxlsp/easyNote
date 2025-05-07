console.log('主进程开始工作');
import { app, Tray, ipcMain } from 'electron';
// import fs from 'fs';
// import path from 'path';
import { initController } from './controller';
import { loginWindowCreate } from './model/broswerWindow';
import { createTray } from './tray';
import { envMode } from './model';

let tray: Tray | null = null;
const init = () => {
  loginWindowCreate(envMode);
  tray = createTray();
  initController();

  // 监听窗口创建事件，以便在创建新窗口时更新托盘
  // app.on('browser-window-created', () => {
  //   updateTray();
  // });

  // ipcMain.handle('GET_SQLITE_DB_BUFFER', async () => {
  //   const dbPath = path.join(app.getPath('userData'), 'easyNote.sqlite');
  //   try {
  //     const buffer = fs.readFileSync(dbPath);
  //     return buffer;
  //   } catch (err) {
  //     console.error('读取数据库文件失败:', err);
  //     throw err;
  //   }
  // });
};

app.whenReady().then(() => {
  init();

  // app.on('activate', () => {
  //   if (BrowserWindow.getAllWindows().length === 0) {
  //     init();
  //   }
  // });
});

app.on('window-all-closed', () => {
  if (tray) {
    tray.destroy();
    tray = null;
  }
  app.quit();
});
