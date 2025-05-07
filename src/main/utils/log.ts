import { throttle } from 'lodash-es';
export const log = (...args) => {
  const leng = args.length;
  if (leng === 1) {
    console.log(args[0]);
    return;
  }
  const level = args[leng - 1];
  if (console[level]) {
    console[level](...args.slice(0, leng - 1));
    return;
  }
  console.log(...args);
};

export const createNameSpaceLog = (nameSpace: string, openThrottle = false) => {
  if (openThrottle) {
    return throttle(log.bind(null, nameSpace), 100);
  }
  return log.bind(null, nameSpace);
};
