import React, { useCallback, useEffect, useRef, useState } from "react";
import styled, { css, DefaultTheme } from "styled-components";
import Select from "react-select";
import Switch from "react-switch";
import dynamic from "next/dynamic";

import LedgerLiveApi, {
  WindowMessageTransport,
  deserializeTransaction,
} from "@ledgerhq/live-app-sdk";

import getPayloadSignTxPlaceholder from "../src/utils/getPayloadSignTxPlaceholder";

const JsonEditor = dynamic(import("../src/components/JsonEditor"), {
  ssr: false,
});

const AppLoaderPageContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  flex-grow: 1;
`;

const Field = styled.label`
  background-color: gainsboro;
  flex-grow: 1;
  padding: 2px;
  display: flex;
  flex-direction: column;
`;

const SwitchField = styled(Field)`
  flex-direction: row;
  align-items: center;
`;

const ToolBar = styled.div`
  color: #222;
  padding: 8px 6px;
`;

type OutputProps = { type: string; theme: DefaultTheme };
const Output = styled.pre`
  overflow: scroll;
  margin: 0;
  font-size: 12px;
  ${(p: OutputProps) =>
    p.type === "pending" &&
    css`
      color: ${p.theme.colors.primary};
    `}
  ${(p: OutputProps) =>
    p.type === "success" &&
    css`
      color: ${p.theme.colors.text};
    `}
    ${(p: OutputProps) =>
    p.type === "error" &&
    css`
      color: ${p.theme.colors.alert};
    `}
`;

const PAYLOAD_BROADCAST = {
  accountId: "ACCOUNT_ID",
  signedTransaction: {
    operation: {},
    signature: "SIGNATURE",
    expirationDate: null,
  },
};

const ACTIONS = [
  { value: "account.list", label: "List Accounts" },
  { value: "account.request", label: "Request Account", usePayload: true },
  { value: "account.receive", label: "Verify Address", useAccount: true },
  {
    value: "transaction.sign",
    label: "Sign Transaction",
    useAccount: true,
    usePayload: true,
  },
  {
    value: "transaction.broadcast",
    label: "Broadcast Transaction",
    useAccount: true,
    usePayload: PAYLOAD_BROADCAST,
  },
  { value: "currency.list", label: "List Currencies", usePayload: true },
];

const prettyJSON = (payload: any) => JSON.stringify(payload, null, 2);

const DebugApp = () => {
  const api = useRef<LedgerLiveApi | null>(null);
  const [lastAnswer, setLastAnswer] = useState<any>(undefined);
  const [answerType, setAnswerType] = useState<string>("none");
  const [method, setMethod] = useState<any>(ACTIONS[0]);
  const [accounts, setAccounts] = useState<any>([]);
  const [account, setAccount] = useState<any>(null);
  const [rawPayload, setRawPayload] = useState<any>("");

  const [useFullTx, setUseFullTx] = useState(false);

  useEffect(() => {
    const llapi = new LedgerLiveApi(new WindowMessageTransport());
    api.current = llapi;

    llapi.connect();
    return () => {
      api.current = null;
      void llapi.disconnect();
    };
  }, []);

  const execute = useCallback(async () => {
    if (!api.current) {
      return;
    }

    let action;
    switch (method.value) {
      case "account.list":
        action = api.current.listAccounts();
        break;
      case "account.request":
        try {
          const payload = rawPayload ? JSON.parse(rawPayload) : undefined;
          action = api.current.requestAccount(payload);
        } catch (error) {
          action = Promise.reject(error);
        }
        break;
      case "account.receive":
        if (account) {
          action = api.current.receive(account.id);
        } else {
          action = Promise.reject(new Error("No accountId selected"));
        }
        break;
      case "transaction.sign":
        try {
          const payload = JSON.parse(rawPayload);
          const transaction = deserializeTransaction(payload.transaction);
          action = api.current.signTransaction(
            account.id,
            transaction,
            payload?.params
          );
        } catch (error) {
          action = Promise.reject(error);
        }
        break;
      case "transaction.broadcast":
        try {
          const rawSignedTransaction = JSON.parse(rawPayload);
          action = api.current.broadcastSignedTransaction(
            account.id,
            rawSignedTransaction
          );
        } catch (error) {
          action = Promise.reject(error);
        }
        break;
      case "currency.list":
        try {
          const payload = rawPayload ? JSON.parse(rawPayload) : undefined;
          action = api.current.listCurrencies(payload);
        } catch (error) {
          action = Promise.reject(error);
        }
        break;
      default:
        action = Promise.resolve();
    }

    try {
      setAnswerType("pending");
      setLastAnswer("Waiting...");
      const result = await action;
      setAnswerType("success");
      setLastAnswer(result);
      if (method.value === "account.list") {
        setAccounts(result);
        if (result instanceof Array && result.length) {
          setAccount(result[0]);
        }
      }
    } catch (err: any) {
      setLastAnswer({ message: err.message });
      console.log(err);
      setAnswerType("error");
    }
  }, [method, account, rawPayload]);

  useEffect(() => {
    if (method.value !== "transaction.sign" || !account) {
      return;
    }

    const { currency: family } = account;

    const placeholder = getPayloadSignTxPlaceholder({ family, useFullTx });

    setRawPayload(prettyJSON(placeholder));
  }, [method, account, useFullTx]);

  const handleMethodChange = useCallback(
    (option) => {
      setMethod(option);
      if (option && option.usePayload && option.usePayload !== true) {
        setRawPayload(prettyJSON(option.usePayload));
      }
    },
    [setMethod]
  );

  const handleAccountChange = useCallback(
    (option) => {
      setAccount(option);
    },
    [setAccount]
  );

  const handlePayloadChange = useCallback(
    (value) => {
      setRawPayload(value);
    },
    [setRawPayload]
  );

  const handlePayloadBlur = useCallback(
    (event) => {
      try {
        const payload = JSON.parse(event.target.value);
        setRawPayload(prettyJSON(payload));
      } catch (err) {
        // FIXME: do something with error?
      }
    },
    [setRawPayload]
  );

  return (
    <AppLoaderPageContainer>
      <ToolBar>
        <Row>
          <Field>
            Method:
            <Select
              instanceId="method"
              options={ACTIONS}
              onChange={handleMethodChange}
              value={method}
              isSearchable={false}
            />
          </Field>
          <Field>
            Account:
            <Select
              instanceId="account"
              options={accounts}
              onChange={handleAccountChange}
              getOptionValue={(option) => option.id}
              getOptionLabel={(option) => `${option.name} (${option.address})`}
              value={account}
              isDisabled={!method.useAccount}
              isSearchable={false}
            />
          </Field>
        </Row>
        <Row>
          <SwitchField>
            Use full transaction: &nbsp;
            <Switch
              disabled={method.value !== "transaction.sign"}
              checked={useFullTx}
              onChange={setUseFullTx}
            />
          </SwitchField>
        </Row>
        <Field>
          Payload:
          <JsonEditor
            onChange={handlePayloadChange}
            onBlur={handlePayloadBlur}
            value={rawPayload}
            readOnly={!method.usePayload}
          />
        </Field>
        <button onClick={execute}>EXECUTE</button>
      </ToolBar>

      <Output type={answerType}>
        {lastAnswer !== undefined ? prettyJSON(lastAnswer) : ""}
      </Output>
    </AppLoaderPageContainer>
  );
};

export default DebugApp;
