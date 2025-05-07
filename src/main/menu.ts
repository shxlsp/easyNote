import { Menu, BrowserWindow, MenuItemConstructorOptions } from 'electron';
import {
  getExpandMode,
  setExpandMode,
  getDefaultAction,
  setDefaultAction,
  ExpandMode,
  DefaultAction,
} from './model/store';

export function createMenu(mainWindow: BrowserWindow) {
  const template: MenuItemConstructorOptions[] = [
    {
      label: '小记',
      submenu: [
        {
          label: '关闭小记',
          click: () => {
            mainWindow.close();
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
      ],
    },
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// 更新菜单状态的函数
export function updateMenu() {
  createMenu(BrowserWindow.getAllWindows()[0]);
}
