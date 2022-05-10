import { InputProps } from "./types";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/keybinding-vscode";
import "ace-builds/src-noconflict/theme-textmate";
import "ace-builds/src-noconflict/theme-tomorrow_night";
import { useTheme } from "styled-components";
import styled from "styled-components";

const EditorContainer = styled.div`
  border: ${({ theme }) => `1px solid ${theme.colors.neutral.c40}`};
  border-radius: 12px;
  padding: 6px;
  flex: 1;

  > #json-editor {
    width: 100% !important;
    height: 128px !important;
    min-height: 128px;
    max-height: 186px;
  }

  > #json-viewer {
    flex: 1;
    width: 100% !important;
    height: 100% !important;
  }
`;

export function JSONTextArea({
  onChange,
  defaultValue,
}: InputProps): React.ReactElement {
  const theme = useTheme();

  return (
    <EditorContainer>
      <AceEditor
        tabSize={3}
        defaultValue={defaultValue}
        keyboardHandler="vscode"
        showGutter={false}
        mode="json"
        theme={theme.theme === "dark" ? "tomorrow_night" : "textmate"}
        onChange={onChange}
        name="json-editor"
        style={{
          resize: "vertical",
        }}
      />
    </EditorContainer>
  );
}
