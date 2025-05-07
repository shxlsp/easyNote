import Store from 'electron-store';
import { updateTray } from '../tray';

// 定义展开模式和开启轻记默认操作的类型
export enum ExpandMode {
  Center = 'center',
  Follow = 'follow',
}

export enum DefaultAction {
  NewNote = 'newNote',
  OpenList = 'openList',
}

interface StoreSchema {
  expandMode: ExpandMode;
  defaultAction: DefaultAction;
}

// 创建一个自定义类型，确保它包含 get 和 set 方法
type TypedStore = Store<StoreSchema> & {
  get: <K extends keyof StoreSchema>(key: K) => StoreSchema[K];
  set: <K extends keyof StoreSchema>(key: K, value: StoreSchema[K]) => void;
};

const store = new Store<StoreSchema>({
  name: 'easyNote-settings',
  defaults: {
    expandMode: ExpandMode.Follow,
    defaultAction: DefaultAction.OpenList,
  },
}) as TypedStore;

export const getExpandMode = (): ExpandMode => store.get('expandMode');
export const setExpandMode = (mode: ExpandMode): void => {
  store.set('expandMode', mode);
  updateTray();
};

export const getDefaultAction = (): DefaultAction => store.get('defaultAction');
export const setDefaultAction = (action: DefaultAction): void => {
  store.set('defaultAction', action);
  updateTray();
};
