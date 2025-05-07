import { EasyNoteMode } from '@/common/types';
import { createGlobalStyle } from 'styled-components';

export const GlobalStyled = createGlobalStyle<{ mode: EasyNoteMode }>`
      .drag-bar {
        -webkit-app-region: drag;
      }
      html,body{
       background-color: ${(props) =>
         props.mode === EasyNoteMode.floatingWindow ? 'rgba(0,0,0,0)' : '#ffffff'}
      }
  `;
