import React from "react";
import { DebuggerContext } from "../types";

export type InputProps = {
  instanceId: string;
  context: DebuggerContext;
  onChange: (value: any) => void;
};

export type InputComponent = (props: InputProps) => React.ReactElement;
