import React from "react";
import { DebuggerContext } from "../types";

export type InputProps = {
  instanceId: string;
  context: DebuggerContext;
  defaultValue?: any;
  onChange: (value: any) => void;
};

export type InputComponent = (props: any) => React.ReactElement;
