import styled from 'styled-components';

export const StyledContainer = styled.div`
  .floating-fixed-container {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    transition: opacity 0.3s, display 0.3s;
    z-index: 2000;
    -webkit-app-region: no-drag;
    transition-behavior: allow-discrete;
    display: block;
    .icon {
      width: 100%;
      height: 100%;
      .img {
        display: block;
        width: 100%;
        height: 100%;
        -webkit-user-drag: none;
      }
    }
    &.hide {
      opacity: 0;
      pointer-events: none;
      display: none;
    }
  }
`;
