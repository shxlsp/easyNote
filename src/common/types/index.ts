import { BrowserWindow } from 'electron';
export * from './userInfo';

export type MethodParams<T extends BrowserWindow, K extends keyof T> = T[K] extends (
  ...args: infer P
) => any
  ? P
  : never;

export enum EasyNoteMode {
  floatingWindow = 'floatingWindow',
  normalWindow = 'normalWindow',
}
