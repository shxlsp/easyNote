import React, { useMemo } from "react";
import { createEditor, Descendant } from "slate";
import { Slate, Editable, withReact } from "slate-react";

interface SlateRendererProps {
  value: string | Descendant[];
  style?: React.CSSProperties;
  className?: string;
}

const defaultValue: Descendant[] = [
  {
    type: "paragraph",
    children: [{ text: "" }]
  }
];

const SlateRenderer: React.FC<SlateRendererProps> = ({ value, style, className }) => {
  const editor = useMemo(() => withReact(createEditor()), []);

  let content: Descendant[];
  if (!value) {
    content = defaultValue;
  } else if (typeof value === "string") {
    try {
      content = JSON.parse(value);
      if (!Array.isArray(content)) content = defaultValue;
    } catch {
      content = defaultValue;
    }
  } else if (Array.isArray(value)) {
    content = value;
  } else {
    content = defaultValue;
  }

  // 支持常见的元素类型
  const renderElement = React.useCallback(props => {
    const { element, children, attributes } = props;
    switch (element.type) {
      case "heading":
      case "heading-one":
        return <h1 {...attributes}>{children}</h1>;
      case "heading-two":
        return <h2 {...attributes}>{children}</h2>;
      case "heading-three":
        return <h3 {...attributes}>{children}</h3>;
      case "bulleted-list":
        return <ul {...attributes}>{children}</ul>;
      case "numbered-list":
        return <ol {...attributes}>{children}</ol>;
      case "list-item":
        return <li {...attributes}>{children}</li>;
      case "blockquote":
        return <blockquote {...attributes}>{children}</blockquote>;
      case "link":
        return (
          <a {...attributes} href={element.url} target="_blank" rel="noopener noreferrer">
            {children}
          </a>
        );
      default:
        return <p {...attributes}>{children}</p>;
    }
  }, []);

  const renderLeaf = React.useCallback(props => {
    const { leaf, children, attributes } = props;
    let el = children;
    if (leaf.bold) el = <strong>{el}</strong>;
    if (leaf.italic) el = <em>{el}</em>;
    if (leaf.underline) el = <u>{el}</u>;
    if (leaf.code) el = <code>{el}</code>;
    return <span {...attributes}>{el}</span>;
  }, []);

  return (
    <Slate editor={editor} initialValue={content}>
      <Editable
        readOnly
        style={style}
        className={className}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        spellCheck={false}
        autoFocus={false}
      />
    </Slate>
  );
};

export default SlateRenderer;
