import { Account, Currency } from "@ledgerhq/wallet-api-client";
import { InputComponent } from "./inputs/types";

export type Parameter = {
  name: string;
  description?: string;
  defaultValue?: string;
  component: InputComponent;
  props?: Record<string, unknown>;
  modifier?: (value: any) => any;
  mode?: string;
};

export type MethodHandler = {
  id: string;
  name: string;
  description: string;
  inputs: Parameter[];
  handler: (...args: any[]) => Promise<unknown>;
};

export type DebuggerContext = {
  accounts: Account[];
  currencies: Currency[];
};

export enum ResultStatus {
  PENDING = "PENDING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

type BaseResult = {
  uuid: string;
  methodId: string;
  inputs: any[];
  queriedAt: Date;
  respondedAt: Date;
};

type ResultSuccess = BaseResult & {
  status: ResultStatus.SUCCESS;
  data: any;
};

type ResultPending = BaseResult & {
  status: ResultStatus.PENDING;
  data: any;
};

type ResultError = BaseResult & {
  status: ResultStatus.ERROR;
  error: any;
};

export type Result = ResultSuccess | ResultError | ResultPending;
