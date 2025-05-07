import styled from "styled-components";
import { Button } from "antd";

export const ToolbarWrapper = styled.div`
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  align-items: center;
  background: #f7f8fa;
  border-radius: 10px;
  padding: 10px 16px;
  margin-bottom: 18px;
  box-shadow: 0 1px 4px 0 rgba(60,60,60,0.05);
  border: 1px solid #ececec;
`;

export const ToolbarButton = styled(Button)<{ active?: boolean }>`
  min-width: 36px;
  background: ${({active}) => active ? '#e6f7ff' : '#fff'};
  border: none;
  box-shadow: none;
  color: #444;
  &:hover, &:focus {
    background: #e6f7ff;
    color: #1677ff;
  }
`;

export const DetailWrapper = styled.div`
  background: #fff;
  padding: 16px 16px 16px 16px;
  width: 100vw;
  height: 100vh;
  border-radius: 0;
  box-shadow: none;
  max-width: 100vw;
  margin: 0;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
`;

export const EditorContainer = styled.div`
  flex: 1;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e6e7eb;
  box-shadow: 0 1px 6px 0 rgba(180,180,180,0.06);
  min-height: 0;
  margin-top: 12px;
  background: #fff;
  display: flex;
  flex-direction: column;
`;
