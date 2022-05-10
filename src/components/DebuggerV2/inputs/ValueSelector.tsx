import { SelectInput } from "@ledgerhq/react-ui";
import { useCallback } from "react";
import { OptionsType } from "react-select";
import { InputProps } from "./types";

type Option = OptionsType<{ value: string; label: string }>;

type Props = {
  options: Option[];
};

export function ValueSelector({
  instanceId,
  onChange,
  options,
}: InputProps & Props): React.ReactElement {
  const handleChange = useCallback((option) => {
    onChange(option.value);
  }, []);

  return (
    <SelectInput
      instanceId={instanceId}
      options={options}
      onChange={handleChange}
    />
  );
}
