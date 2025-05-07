import styled, { css } from 'styled-components';
import { Button, Card } from 'antd';

export const ListWrapper = styled.div<{ $viewMode: string }>`
  &.list {
    max-width: 700px;
    margin: 0 auto;
  }
  &.card {
    max-width: 1200px;
    margin: 0 auto;
  }
`;

export const NewButton = styled(Button)`
  margin-bottom: 24px;
  font-weight: 500;
`;

export const SpinWrap = styled.div`
  margin: 48px auto;
  display: flex;
  justify-content: center;
`;

export const EmptyWrap = styled.div`
  margin: 48px auto;
  display: flex;
  justify-content: center;
`;

export const CardWrap = styled(Card)<{ $top?: boolean }>`
  margin-bottom: 18px;
  ${({ $top }) =>
    $top &&
    css`
      border: 1.5px solid #ffe58f !important;
      box-shadow: 0 1px 8px #fffbe6 !important;
      background: #fffbe6 !important;
    `}
  background: #fff;
`;

export const CardTitle = styled.div`
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 6px;
`;

export const CardContent = styled.div<{ $expanded: boolean; $maxHeight: number }>`
  color: #555;
  margin-bottom: 8px;
  font-size: 15px;
  max-height: ${({ $expanded, $maxHeight }) => ($expanded ? 'none' : `${$maxHeight}px`)};
  overflow: ${({ $expanded }) => ($expanded ? 'visible' : 'hidden')};
  white-space: pre-line;
  position: relative;
`;

export const CardExpandBtn = styled(Button)`
  position: absolute;
  right: 0;
  bottom: 0;
  background: rgba(255,255,255,0.8);
  z-index: 1;
  padding: 0 6px;
`;
