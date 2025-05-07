import './jsBridgePreload';
import nativeRequire from '../utils/native-require';
import { EventEmitter } from 'eventemitter3';
import { WEB_PAGE_EVENT_NAMES } from '@/common/events';

let Bus = new EventEmitter();
window.GlobalEventBus = Bus;

const eventMap = new Map();
// const sleep = async (time = 300) => {
//   return new Promise((resolve) => {
//     setTimeout(() => {
//       resolve(true);
//     }, time);
//   });
// };

// const makeSuccessResult = (data, eventName, requestId) => {
//   return {
//     data,
//     errorCode: 2000,
//     eventName,
//     message: '成功！',
//     requestId,
//   };
// };

window.jsBridge.call = async (params) => {
  const { name, data } = params;
  console.log('call', params);
  switch (name) {
    case 'getMeVersion':
      return {
        '0': {
          eventName: 'getMeVersion',
          from: '--',
        },
        eventName: 'setMeVersion',
        version: '7.9.4',
      };
    case 'requestAuthCode': {
      // eslint-disable-next-line no-lone-blocks
      {
        // const res = await window.jsBridge.sendEvent.authcode(data);
        // const fn = eventMap.get(`${name}Result`);
        // if (!fn) return;
        // fn(makeSuccessResult(res, data.name, data.requestId));
      }
      break;
    }
    default:
      break;
  }
};
window.jsBridge.on = async (eventName, cb) => {
  console.log('on', eventName);
  switch (eventName) {
    case 'requestAuthCodeResult':
      eventMap.set(eventName, cb);

      break;
    default:
      break;
  }
};

window.jsBridge.destroy = () => {
  // 小记主窗口点击关闭后，通知React
  Bus.emit(WEB_PAGE_EVENT_NAMES.ON_NOTE_CLOSE);
};

/**
 * 渲染React应用
 *
 * 设置全局renderReactApp函数，在页面加载完成后执行
 * 加载easyNote.js文件并清除全局renderReactApp函数
 */
const renderReactApp = () => {
  const path = nativeRequire('path');
  // @ts-ignore
  window.renderReactApp = () => {
    nativeRequire(path.resolve(__dirname, '../easyNote.js'));
  };
  window.addEventListener('load', () => {
    // @ts-ignore
    window.renderReactApp();
    // @ts-ignore
    window.renderReactApp = null;
  });
  // setTimeout(() => {
  // }, 500);
};
renderReactApp();
