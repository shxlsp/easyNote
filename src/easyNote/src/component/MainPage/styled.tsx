import styled from 'styled-components';
import { Typography, Button, Layout } from 'antd';

export const StyledMainPage = styled(Layout)`
  min-height: 100vh;
  background: #fafbfc;
`;

export const Header = styled(Layout.Header)`
  background: #fff;
  border-bottom: 1px solid #f0f0f0;
  padding: 0 24px;
  display: flex;
  align-items: center;
  height: 60px;
  justify-content: space-between;
`;

export const Title = styled(Typography.Title)`
  && {
    margin: 0;
    color: #222;
  }
`;

export const Content = styled(Layout.Content)`
  /* padding: 0 20px; */
  max-width: 1200px;
  margin: 0 auto;
  width: 100%;
`;

export const ViewSwitch = styled.div`
  display: inline-flex;
  gap: 8px;
  margin-right: 8px;
`;

export const CloseBtn = styled(Button)`
`;

export const BackBtn = styled(Button)`
`;
