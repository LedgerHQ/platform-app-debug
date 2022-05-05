import { Account } from "@ledgerhq/live-app-sdk";
import { SelectInput } from "@ledgerhq/react-ui";
import { useCallback } from "react";
import { OptionsType } from "react-select";
import { InputProps } from "./types";

function accountsToOptions(
  accounts: Account[]
): OptionsType<{ value: string; label: string }> {
  return accounts.map((account) => ({
    value: account.id,
    label: account.name,
  }));
}

export function AccountSelector({
  instanceId,
  context,
  onChange,
}: InputProps): React.ReactElement {
  const handleChange = useCallback((option) => {
    onChange(option.value);
  }, []);

  return (
    <SelectInput
      instanceId={instanceId}
      options={accountsToOptions(context.accounts)}
      onChange={handleChange}
    />
  );
}
