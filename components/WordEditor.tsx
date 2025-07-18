"use client";

import { useRef, useEffect } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";

interface Props {
  value: string;
  onChange: (data: string) => void;
}

export default function WordEditor({ value, onChange }: Props) {
  const editorRef = useRef<any>(null);

  useEffect(() => {
    const style = document.createElement("style");
    style.innerHTML = `
      .ck.ck-editor__editable {
        background-color: inherit !important;
        color: inherit !important;
        min-height: 300px;
      }

      .ck.ck-editor__main > .ck-editor__editable:not(.ck-focused) {
        border-color: #d1d5db;
      }

      .ck.ck-toolbar {
        background-color: inherit !important;
        border-color: #d1d5db !important;
      }
    `;
    document.head.appendChild(style);
    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <div className="bg-inherit text-inherit border rounded p-2">
      <CKEditor
        editor={ClassicEditor}
        data={value}
        config={{
          toolbar: [
            "heading",
            "|",
            "bold",
            "italic",
            "underline",
            "fontSize",
            "fontColor",
            "fontBackgroundColor",
            "|",
            "alignment",
            "numberedList",
            "bulletedList",
            "link",
            "insertTable",
            "|",
            "undo",
            "redo",
          ],
          fontSize: {
            options: [9, 11, 13, "default", 17, 19, 21],
            supportAllValues: true,
          },
          fontColor: {
            colors: [
              { color: "#000000", label: "Black" },
              { color: "#FF0000", label: "Red" },
              { color: "#00FF00", label: "Green" },
              { color: "#0000FF", label: "Blue" },
              { color: "#FFFFFF", label: "White" },
              { color: "#FFA500", label: "Orange" },
              { color: "#800080", label: "Purple" },
              { color: "#808080", label: "Gray" },
            ],
            columns: 5,
            documentColors: 10,
          },
          fontBackgroundColor: {
            colors: [
              { color: "#ffffff", label: "White" },
              { color: "#ffff00", label: "Yellow" },
              { color: "#00ffff", label: "Cyan" },
              { color: "#ff00ff", label: "Magenta" },
              { color: "#d3d3d3", label: "Light Gray" },
              { color: "#000000", label: "Black" },
            ],
            columns: 5,
            documentColors: 10,
          },
          alignment: {
            options: ["left", "center", "right", "justify"],
          },
        }}
        onReady={(editor: any) => {
          editorRef.current = editor;
          const editableElement = editor.ui.view.editable.element;
          editableElement.style.backgroundColor = "inherit";
          editableElement.style.color = "inherit";
        }}
        onChange={(_, editor) => {
          onChange(editor.getData());
        }}
      />
    </div>
  );
}
