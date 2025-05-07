import { createRoot } from 'react-dom/client';
import App from './src';
const rootDomId = 'easyNoteRoot';
const createRootDom = () => {
  const rootDom = document.querySelector('#' + rootDomId);
  if (rootDom) return rootDom;
  const div = document.createElement('div');
  div.id = rootDomId;
  document.body.appendChild(div);
  return div;
};
window.jsBridge.sendEvent.setGlobalOnTop(true);
const initReactDOM = () => {
  const root = createRoot(createRootDom());
  root.render(<App />);
  return () => {
    root.unmount();
  };
};

initReactDOM();
