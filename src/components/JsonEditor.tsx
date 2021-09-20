import React from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-xcode";

type Props = {
  onChange: (value: string, event?: any) => void;
  onBlur: (event: any) => void;
  value: string;
  readOnly?: boolean;
};

const JsonEditor = ({ onChange, onBlur, value, readOnly = false }: Props) => {
  return (
    <AceEditor
      tabSize={2}
      showGutter={false}
      mode="json"
      theme="xcode"
      onChange={onChange}
      onBlur={onBlur}
      name="json-editor"
      value={value}
      style={{
        resize: "vertical",
        minHeight: "128px",
      }}
      readOnly={readOnly}
    />
  );
};

export default JsonEditor;
