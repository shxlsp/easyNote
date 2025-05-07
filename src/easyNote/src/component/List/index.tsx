import React, { useEffect, useState } from "react";
import { Card, List as AntdList, Button, Dropdown, Menu, Tooltip, Spin, Empty, message, Space } from "antd";
import { EllipsisOutlined, EditOutlined, PushpinFilled, PushpinOutlined, DeleteOutlined, UpOutlined, DownOutlined } from "@ant-design/icons";
import type { ViewMode } from "../MainPage";
import { ListWrapper, NewButton, SpinWrap, EmptyWrap, CardWrap, CardTitle, CardContent, CardExpandBtn } from './styled';

interface NoteItem {
  id: string;
  title: string;
  content: string;
  isPinned?: boolean;
}

interface ListProps {
  viewMode: ViewMode;
  onEdit: (id: string | 'new') => void;
}

const MAX_HEIGHT = 150;

const List: React.FC<ListProps> = ({ viewMode, onEdit }) => {
  const [data, setData] = useState<NoteItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandIds, setExpandIds] = useState<string[]>([]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await window.jsBridge.noteApi.listNotes();
      setData(res);
    } catch (e) {
      console.error("Failed to fetch notes:", e);
      setData([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const isExpanded = (id: string) => expandIds.includes(id);
  const handleExpand = (id: string) => {
    setExpandIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handlePinToggle = async (id: string, isPinned: boolean) => {
    try {
      const noteToUpdate = data.find((n) => n.id === id);
      if (!noteToUpdate) return;

      const { success } = await window.jsBridge.noteApi.updateNote({
        ...noteToUpdate,
        isPinned: !isPinned
      });

      if (success) {
        await fetchData(); // 重新获取数据以确保与后端同步
        message.success(isPinned ? "已取消置顶" : "已置顶");
      }
    } catch (e) {
      console.error("Failed to toggle pin:", e);
      message.error("操作失败，请重试");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const { success } = await window.jsBridge.noteApi.deleteNote(id);
      if (success) {
        await fetchData(); // 重新获取数据以确保与后端同步
        message.success("已删除");
      }
    } catch (e) {
      console.error("Failed to delete note:", e);
      message.error("删除失败，请重试");
    }
  };

  const getMoreMenu = (item: NoteItem) => (
    <Menu
      items={[
        {
          key: "pin",
          icon: item.isPinned ? <PushpinOutlined /> : <PushpinFilled />,
          label: item.isPinned ? "取消置顶" : "置顶",
          onClick: () => handlePinToggle(item.id, !!item.isPinned),
        },
        {
          key: "delete",
          icon: <DeleteOutlined />,
          label: "删除",
          onClick: () => handleDelete(item.id),
          danger: true,
        },
      ]}
    />
  );

  const renderItem = (item: NoteItem) => {
    const contentHeight = isExpanded(item.id) ? undefined : MAX_HEIGHT;
    const showExpand =
      item.content.split("\n").length > 6 ||
      item.content.length > 120 ||
      !isExpanded(item.id)
        ? item.content.length > 0 &&
          (item.content.length > 120 ||
            item.content.split("\n").length > 6)
        : false;
    return (
      <CardWrap
        $top={item.isPinned}
        hoverable
        key={item.id}
        title={
          <CardTitle>
            <span>{item.title}</span>
            {item.isPinned && (
              <Tooltip title="已置顶">
                <PushpinFilled style={{ color: "#d4a100" }} />
              </Tooltip>
            )}
          </CardTitle>
        }
        extra={
          <Space>
            <Tooltip title="编辑">
              <Button
                size="small"
                shape="circle"
                icon={<EditOutlined />}
                onClick={(e) => {
                  e.stopPropagation();
                  onEdit(item.id);
                }}
              />
            </Tooltip>
            <Dropdown
              overlay={getMoreMenu(item)}
              trigger={["click"]}
              placement="bottomRight"
              arrow
            >
              <Button
                size="small"
                shape="circle"
                icon={<EllipsisOutlined />}
                onClick={(e) => e.stopPropagation()}
              />
            </Dropdown>
          </Space>
        }
        bodyStyle={{ paddingTop: 14, paddingBottom: 12 }}
      >
        <CardContent
          $expanded={isExpanded(item.id)}
          $maxHeight={MAX_HEIGHT}
        >
          {item.content}
          {showExpand && (
            <CardExpandBtn
              size="small"
              type="link"
              icon={isExpanded(item.id) ? <UpOutlined /> : <DownOutlined />}
              onClick={(e) => {
                e.stopPropagation();
                handleExpand(item.id);
              }}
            >
              {isExpanded(item.id) ? "收起" : "展开"}
            </CardExpandBtn>
          )}
        </CardContent>
      </CardWrap>
    );
  };

  const sortedData = [
    ...data.filter((n) => n.isPinned),
    ...data.filter((n) => !n.isPinned),
  ];

  return (
    <ListWrapper $viewMode={viewMode}>
      <NewButton
        type="primary"
        block
        onClick={() => onEdit('new')}
      >
        新建轻记
      </NewButton>
      {loading ? (
        <SpinWrap>
          <Spin tip="加载中..." />
        </SpinWrap>
      ) : sortedData.length === 0 ? (
        <EmptyWrap>
          <Empty description="暂无数据" />
        </EmptyWrap>
      ) : (
        <AntdList
          grid={
            viewMode === "card"
              ? { gutter: 18, column: 3 }
              : undefined
          }
          dataSource={sortedData}
          renderItem={(item) => (
            <AntdList.Item style={viewMode === "card" ? { display: "flex" } : {}}>
              {renderItem(item)}
            </AntdList.Item>
          )}
        />
      )}
    </ListWrapper>
  );
};

export default List;
