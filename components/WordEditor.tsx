"use client";

import { useRef } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import DecoupledEditor from "@ckeditor/ckeditor5-build-decoupled-document";

interface Props {
  value: string;
  onChange: (data: string) => void;
}

export default function WordEditor({ value, onChange }: Props) {
  const editorRef = useRef<any>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  return (
    <div>
      <div ref={toolbarRef} className="border p-2 bg-gray-100 rounded-t" />
      <div className="border rounded-b min-h-[300px]">
        <CKEditor
          editor={DecoupledEditor as any}
          data={value}
          onReady={(editor: any) => {
            editorRef.current = editor;
            // 👇 Append toolbar only ONCE here
            if (toolbarRef.current && !toolbarRef.current.contains(editor.ui.view.toolbar.element)) {
              toolbarRef.current.appendChild(editor.ui.view.toolbar.element);
            }
          }}
          onChange={(_, editor) => {
            onChange(editor.getData());
          }}
        />
      </div>
    </div>
  );
}
