import React from 'react';

// 适用于 Electron + React 环境，webview 自动加载本地 sqliteWeb/dist/index.html
const SqliteVizViewer: React.FC = () => {
  // 动态拼接绝对路径（需确保打包后路径正确）
  const pagePath = `file://${__dirname}/../web/index.html`;
  const preloadPath = `file://${__dirname}/../preload.js`;

  return (
    <div style={{ width: '100vw', height: '100vh', background: '#222' }}>
      <webview
        src={pagePath}
        preload={preloadPath}
        style={{ width: '100%', height: '100%', border: 'none' }}
        // @ts-ignore
        nodeintegration="false"
        webpreferences="contextIsolation"
        // @ts-ignore
        allowpopups="true"
      />
    </div>
  );
};

export default SqliteVizViewer;
