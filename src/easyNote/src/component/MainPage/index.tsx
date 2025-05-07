import React from 'react';
import List from '../List';
import Detail from '../Detail';
import { Header, Title, Content, ViewSwitch, CloseBtn, BackBtn, StyledMainPage } from './styled';
import { LeftOutlined, CloseOutlined, AppstoreOutlined, BarsOutlined } from '@ant-design/icons';
import { WEB_PAGE_EVENT_NAMES } from '@/common/events';

export type ViewMode = 'list' | 'card';

interface MainPageProps {
  detailId: string | null;
  setDetailId: (id: string | null) => void;
  viewMode: ViewMode;
  setViewMode: (mode: ViewMode) => void;
}

const MainPage: React.FC<MainPageProps> = ({
  detailId,
  setDetailId,
  viewMode,
  setViewMode,
}) => {
  const handleClose = () => {
    // window.GlobalEventBus.emit(WEB_PAGE_EVENT_NAMES.ON_NOTE_CLOSE);
    window.close();
  };
  

  const handleViewSwitch = (mode: ViewMode) => {
    setViewMode(mode);
  };

  const handleBack = () => {
    setDetailId(null);
  };

  return (
    <StyledMainPage>
      <Header>
        <div>
          {detailId ? (
            <BackBtn type="text" icon={<LeftOutlined />} onClick={handleBack}>
              返回
            </BackBtn>
          ) : (
            <Title level={4}>轻记</Title>
          )}
        </div>
        <div>
          {!detailId && (
            <ViewSwitch>
              <CloseBtn
                type={viewMode === 'list' ? 'primary' : 'default'}
                icon={<BarsOutlined />}
                onClick={() => handleViewSwitch('list')}
                size="middle"
              >
                列表视图
              </CloseBtn>
              <CloseBtn
                type={viewMode === 'card' ? 'primary' : 'default'}
                icon={<AppstoreOutlined />}
                onClick={() => handleViewSwitch('card')}
                size="middle"
              >
                卡片视图
              </CloseBtn>
            </ViewSwitch>
          )}
          <CloseBtn
            type="text"
            icon={<CloseOutlined />}
            onClick={handleClose}
            style={{ color: '#888' }}
          />
        </div>
      </Header>
      <Content>
        {detailId ? (
          <Detail id={detailId} onBack={handleBack} />
        ) : (
          <List viewMode={viewMode} onEdit={setDetailId} />
        )}
      </Content>
    </StyledMainPage>
  );
};

export default MainPage;
