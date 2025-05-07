import { BrowserWindow, screen } from 'electron';

interface SnapConfig {
  width: number;
  height: number;
  margin: number;
}
export const getCurrentDisplay = (win: BrowserWindow) => {
  const winBounds = win.getBounds();
  const currentDisplay = screen.getDisplayNearestPoint({ x: winBounds.x, y: winBounds.y });
  return currentDisplay;
};
export const snapWindowToEdge = (win: BrowserWindow, config: SnapConfig) => {
  const winBounds = win.getBounds();
  const currentDisplay = getCurrentDisplay(win);
  const { workArea } = currentDisplay;
  const {
    width: screenWidth,
    // height: screenHeight,
    x: screenX,
    // y: screenY,
  } = workArea;

  let winLeft = screenX + config.margin;
  if (winBounds.x > screenWidth / 2) {
    winLeft = screenX + screenWidth - config.width - config.margin;
  }

  // let winTop = screenY + config.margin;
  // if (winBounds.y > screenY + screenHeight / 2) {
  //   winTop = screenY + screenHeight - config.height - config.margin;
  // }

  win.setBounds(
    {
      x: winLeft,
      y: winBounds.y,
      width: config.width,
      height: config.height,
    },
    true
  );
};
