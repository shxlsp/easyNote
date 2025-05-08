import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  createEditor,
  Descendant,
  Editor,
  Transforms,
  Element as SlateElement,
  BaseEditor,
} from "slate";
import { Slate, Editable, withReact, ReactEditor } from "slate-react";
import { HistoryEditor, withHistory } from "slate-history";
import { Button, Tooltip, message } from "antd";
import {
  UndoOutlined,
  RedoOutlined,
  BoldOutlined,
  StrikethroughOutlined,
  UnorderedListOutlined,
  CheckSquareOutlined,
  PictureOutlined,
} from "@ant-design/icons";
import {
  ToolbarWrapper,
  ToolbarButton,
  DetailWrapper,
  EditorContainer,
} from "./styled";
import { throttle } from "lodash";
import { useDataCache, useThrottle } from "../../hooks";
import useClassState from "../../hooks/useClassState";

type CustomElement = {
  type: "paragraph" | "list-item" | "checkbox" | "image";
  children: CustomText[];
};
type CustomText = { text: string; bold?: boolean; strike?: boolean };

declare module "slate" {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor;
    Element: CustomElement;
    Text: CustomText;
  }
}

interface DetailProps {
  id: string | "new";
  onBack: () => void;
}

const TOOLBAR_BTNS = [
  { key: "undo", label: "撤销", icon: <UndoOutlined /> },
  { key: "redo", label: "重做", icon: <RedoOutlined /> },
  { key: "bold", label: "加粗", icon: <BoldOutlined /> },
  { key: "strike", label: "横划线", icon: <StrikethroughOutlined /> },
  { key: "list", label: "列表", icon: <UnorderedListOutlined /> },
  { key: "checkbox", label: "Checkbox", icon: <CheckSquareOutlined /> },
  { key: "image", label: "图片上传", icon: <PictureOutlined /> },
];

const initialValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }],
  },
];

const Detail: React.FC<DetailProps> = ({ id, onBack }) => {
  const [editor] = useState(() => withReact(withHistory(createEditor())));
  const [{ title, content }, setState, stateRef] = useClassState({
    title: "",
    content: initialValue,
  });
  const idRef = useRef(id);

  useEffect(() => {
    const fetchNote = async () => {
      if (id !== "new") {
        try {
          const note = await window.jsBridge.noteApi.readNote(id);
          editor.children = JSON.parse(note.content);
          setState({
            title: note.title,
            content: JSON.parse(note.content),
          });
        } catch (error) {
          console.error("Failed to fetch note:", error);
          message.error("获取笔记失败");
        }
      }
    };
    fetchNote();
  }, [id]);

  const saveNote = useCallback(async () => {
    const { title, content } = stateRef.current;
    if (idRef.current === "new") {
      try {
        const newNote = await window.jsBridge.noteApi.createNote({
          title,
          content: JSON.stringify(content),
        });
        idRef.current = newNote.id;
        message.success("笔记已创建");
        // onBack();
      } catch (error) {
        console.error("Failed to create note:", error);
        message.error("创建笔记失败");
      }
    } else {
      try {
        await window.jsBridge.noteApi.updateNote({
          id: idRef.current,
          title,
          content: JSON.stringify(content),
        });
        message.success("笔记已保存");
      } catch (error) {
        console.error("Failed to update note:", error);
        message.error("保存笔记失败");
      }
    }
  }, [id])

  const saveNoteThrottle = useThrottle(
    saveNote,
    2000,
    [saveNote],
    { leading: false, trailing: true }
  );

  const onEditorChange = (content) => {
    setState({ content });
    saveNoteThrottle();
  };

  const onTitleChange = (e) => {
    setState({ title: e.target.value });
    saveNoteThrottle();
  };

  useEffect(() => {
    // saveNote();
    return () => {
      saveNote();
      saveNoteThrottle.cancel();
    };
  }, [saveNote]);

  const renderElement = useCallback((props: any) => {
    switch (props.element.type) {
      case "list-item":
        return <li {...props.attributes}>{props.children}</li>;
      case "checkbox":
        return (
          <div {...props.attributes}>
            <input type="checkbox" checked={props.element.checked} readOnly />
            {props.children}
          </div>
        );
      case "image":
        return (
          <img
            {...props.attributes}
            src={props.element.url}
            alt="Uploaded image"
            style={{ maxWidth: "100%" }}
          />
        );
      default:
        return <p {...props.attributes}>{props.children}</p>;
    }
  }, []);

  const renderLeaf = useCallback((props: any) => {
    if (props.leaf.bold) {
      props.children = <strong>{props.children}</strong>;
    }
    if (props.leaf.strike) {
      props.children = <s>{props.children}</s>;
    }
    return <span {...props.attributes}>{props.children}</span>;
  }, []);

  const handleToolbarClick = (key: string) => {
    switch (key) {
      case "undo":
        editor.undo();
        break;
      case "redo":
        editor.redo();
        break;
      case "bold":
        Editor.addMark(editor, "bold", true);
        break;
      case "strike":
        Editor.addMark(editor, "strike", true);
        break;
      case "list":
        Transforms.setNodes(
          editor,
          { type: "list-item" },
          {
            match: (n) =>
              SlateElement.isElement(n) && Editor.isBlock(editor, n),
          }
        );
        break;
      case "checkbox":
        Transforms.insertNodes(editor, {
          type: "checkbox",
          checked: false,
          children: [{ text: "" }],
        } as CustomElement);
        break;
      case "image":
        handleImageUpload();
        break;
      default:
        break;
    }
  };

  const handleImageUpload = async () => {
    // 这里应该实现文件选择逻辑，为了简化，我们使用一个模拟的文件buffer
    const mockFileBuffer = Buffer.from("mock image data");
    const mockFileName = "mock_image.png";

    try {
      const { path } = await window.jsBridge.noteApi.uploadImage(
        mockFileBuffer,
        mockFileName
      );
      Transforms.insertNodes(editor, {
        type: "image",
        url: path,
        children: [{ text: "" }],
      } as CustomElement);
    } catch (error) {
      console.error("Failed to upload image:", error);
      message.error("上传图片失败");
    }
  };

  return (
    <DetailWrapper>
      <ToolbarWrapper>
        {TOOLBAR_BTNS.map((btn) => (
          <Tooltip title={btn.label} key={btn.key}>
            <ToolbarButton
              icon={btn.icon}
              size="middle"
              onClick={() => handleToolbarClick(btn.key)}
            />
          </Tooltip>
        ))}
      </ToolbarWrapper>
      <EditorContainer>
        <input
          type="text"
          value={title}
          onChange={onTitleChange}
          placeholder="笔记标题"
          style={{
            fontSize: 20,
            fontWeight: "bold",
            marginBottom: 10,
            width: "100%",
            border: "none",
            outline: "none",
          }}
        />
        <Slate editor={editor} initialValue={content} onChange={onEditorChange}>
          <Editable
            renderElement={renderElement}
            renderLeaf={renderLeaf}
            style={{
              height: "calc(100% - 40px)",
              fontSize: 15,
              fontFamily: "Menlo, Monaco, 'Fira Mono', monospace",
              overflowY: "auto",
            }}
          />
        </Slate>
      </EditorContainer>
    </DetailWrapper>
  );
};

export default Detail;
