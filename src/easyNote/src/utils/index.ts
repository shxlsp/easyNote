const editModeHeadClassName = 'edit-memo-header';
const createBtnClassName = 'create-memo-card-btn';
export const createNewNote = () => {
  if (document.querySelector(`.${editModeHeadClassName}`)) {
    // 当前小记处于编辑模式，无需处理
    return;
  }
  const createBtn = document.querySelector(`.${createBtnClassName}`) as HTMLElement;
  // 点击新建小记按钮
  createBtn?.click();
};
