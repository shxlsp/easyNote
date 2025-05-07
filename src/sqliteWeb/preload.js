/**
 * Webview preload script for sqliteviz auto db inject (Electron)
 */
window.addEventListener('DOMContentLoaded', async () => {
  if (!window.electronAPI || typeof window.electronAPI.getDbBuffer !== 'function') return;

  try {
    const buffer = await window.electronAPI.getDbBuffer();
    // 创建File对象
    const dbFile = new File([buffer], 'easyNote.sqlite', { type: 'application/octet-stream' });

    // 查找sqliteviz的file input元素，自动注入文件并触发change事件
    const tryInject = () => {
      const input = document.querySelector('input[type="file"]');
      if (input) {
        const dataTransfer = new DataTransfer();
        dataTransfer.items.add(dbFile);
        input.files = dataTransfer.files;
        // 触发change事件
        const event = new Event('change', { bubbles: true });
        input.dispatchEvent(event);
        return true;
      }
      return false;
    };

    // 多次尝试，兼容sqliteviz页面异步加载input
    let injected = tryInject();
    if (!injected) {
      let tries = 0;
      const timer = setInterval(() => {
        tries++;
        if (tryInject() || tries > 10) {
          clearInterval(timer);
        }
      }, 300);
    }
  } catch (err) {
    console.error('自动注入数据库失败:', err);
  }
});
