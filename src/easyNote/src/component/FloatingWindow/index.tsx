import { WEB_PAGE_EVENT_NAMES } from '@/common/events';
import { useEffect, useState } from 'react';
import { StyledContainer } from './styled';
import { EasyNoteMode } from '@/common/types';
import { DefaultAction } from '@/main/model/store';
import { createNewNote } from '../../utils';

export default ({ setMode }: { mode: EasyNoteMode; setMode: (v: EasyNoteMode) => void }) => {
  const [isShowFloatingWindow, setIsShoFloatingWindow] = useState(false);
  useEffect(() => {
    const onChangeToFloatingMode = async () => {
      console.log('change FLoating mode');
      setIsShoFloatingWindow(true);
      await window.jsBridge.sendEvent.changeEasyNoteMode(EasyNoteMode.floatingWindow);
      setMode(EasyNoteMode.floatingWindow);
    };
    window.GlobalEventBus.on(WEB_PAGE_EVENT_NAMES.ON_NOTE_CLOSE, onChangeToFloatingMode);
  }, [setMode]);
  const onFloatingWindowClick = async () => {
    setIsShoFloatingWindow(false);
    await window.jsBridge.sendEvent.changeEasyNoteMode(EasyNoteMode.normalWindow);
    setMode(EasyNoteMode.normalWindow);

    try {
      // 获取默认操作
      const defaultAction = await window.jsBridge.sendEvent.getDefaultAction();
      console.log(defaultAction, '???defaultAction');
      // 根据默认操作执行相应的行为
      if (defaultAction === DefaultAction.NewNote) {
        // 执行新建轻记的操作
        console.log('Creating new note');
        createNewNote();
      }
    } catch (error) {
      console.error('Error while handling floating window click:', error);
    }
  };

  // 主要的鼠标按下事件处理函数
  const onMouseDown = (): void => {
    const startTimestamp = Date.now();

    // 鼠标移动事件处理函数
    const onMouseMove = (moveEvent: MouseEvent): void => {
      window.jsBridge.sendEvent.floatingWindowMove({
        x: moveEvent.screenX - 18,
        y: moveEvent.screenY - 18,
      });
    };

    // 鼠标松开事件处理函数
    const onMouseUp = (): void => {
      document.removeEventListener('mousemove', onMouseMove);
      const isQuickClick = Date.now() - startTimestamp < 300;
      console.log('isQuickClick, isQuickClick', isQuickClick);
      if (isQuickClick) {
        onFloatingWindowClick();
      }
    };

    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mouseup', onMouseUp, { once: true });
  };

  return (
    <StyledContainer className="floating-container">
      <div
        className={`floating-fixed-container${isShowFloatingWindow ? '' : ' hide'}`}
        // onClick={onFloatingWindowClick}
        onMouseDown={onMouseDown}
      >
        <div className="icon">
          <img
            src="data:image/png;base64,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"
            className="img"
          />
        </div>
      </div>
    </StyledContainer>
  );
};
