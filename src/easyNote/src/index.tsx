import "antd/dist/reset.css";
// import React, { useState, useEffect } from 'react';
import { useState } from "react";
import FloatingWindow from "./component/FloatingWindow";
import MainPage, { ViewMode } from "./component/MainPage";
import { GlobalStyled } from "./globalStyled";
import { EasyNoteMode } from "@/common/types";

const App = () => {
  const [mode, setMode] = useState(EasyNoteMode.normalWindow);

  // 详情id: 有id则渲染详情，否则渲染列表
  const [detailId, setDetailId] = useState<string | null>(null);

  // 视图模式: list 或 card
  const [viewMode, setViewMode] = useState<ViewMode>('list');

  return (
    <>
      <GlobalStyled mode={mode} />
      <FloatingWindow mode={mode} setMode={setMode} />
      <MainPage
        detailId={detailId}
        setDetailId={setDetailId}
        viewMode={viewMode}
        setViewMode={setViewMode}
      />
    </>
  );
};

export default App;
