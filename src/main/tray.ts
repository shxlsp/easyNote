import { Tray, Menu, app } from 'electron';
import path from 'path';
import {
  getExpandMode,
  setExpandMode,
  getDefaultAction,
  setDefaultAction,
  ExpandMode,
  DefaultAction,
} from './model/store';

let tray: Tray | null = null;

const getTrayConfig = () => {
  return [
    {
      label: '关闭轻记',
      click: () => {
        app.quit();
      },
    },
    { type: 'separator' },
    {
      label: '展开模式',
      submenu: [
        {
          label: '居中模式',
          type: 'radio',
          checked: getExpandMode() === ExpandMode.Center,
          click: () => setExpandMode(ExpandMode.Center),
        },
        {
          label: '跟随模式',
          type: 'radio',
          checked: getExpandMode() === ExpandMode.Follow,
          click: () => setExpandMode(ExpandMode.Follow),
        },
      ],
    },
    {
      label: '开启轻记默认操作',
      submenu: [
        {
          label: '新建轻记',
          type: 'radio',
          checked: getDefaultAction() === DefaultAction.NewNote,
          click: () => setDefaultAction(DefaultAction.NewNote),
        },
        {
          label: '打开轻记列表',
          type: 'radio',
          checked: getDefaultAction() === DefaultAction.OpenList,
          click: () => setDefaultAction(DefaultAction.OpenList),
        },
      ],
    },
    // {
    //   label: 'openDevTools',
    //   click: () => {
    //     BrowserWindow.getAllWindows()[0].webContents.openDevTools();
    //   },
    // },
  ];
};

export function createTray() {
  const iconPath = path.join(__dirname, '../resources/img/tray.png');
  tray = new Tray(iconPath);

  const contextMenu = Menu.buildFromTemplate(getTrayConfig() as any);

  tray.setToolTip('轻记');
  // tray.setContextMenu(contextMenu);
  tray.setContextMenu(contextMenu);
  tray.setTitle('轻记');
  return tray;
}

export function updateTray() {
  if (tray) {
    const contextMenu = Menu.buildFromTemplate(getTrayConfig() as any);

    tray.setContextMenu(contextMenu);
  }
}
