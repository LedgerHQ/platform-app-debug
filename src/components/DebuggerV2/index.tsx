import React, {
  useRef,
  useEffect,
  useMemo,
  useCallback,
  useState,
} from "react";
import { v4 as uuidv4 } from "uuid";

import {
  Text,
  SelectInput,
  Button,
  InfiniteLoader,
  Chip,
} from "@ledgerhq/react-ui";

import styled from "styled-components";

import { getSimulatorTransport } from "@ledgerhq/wallet-api-simulator";
import {
  WalletAPIClient,
  WindowMessageTransport,
} from "@ledgerhq/wallet-api-client";

import { getHandlers } from "./handlers";
import { DebuggerContext, MethodHandler, Result, ResultStatus } from "./types";
import { Option } from "@ledgerhq/react-ui/components/form/SelectInput/Option";
import { components } from "react-select";
import { OutputConsole } from "./OutputConsole";
import { useRouter } from "next/router";

type IOption = {
  value: string;
  label: string;
  description: string;
};

function handlerToOption(handler: MethodHandler): IOption {
  return {
    value: handler.id,
    label: handler.name,
    description: handler.description,
  };
}

const OptionContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const ClearButton = styled.div<{ visible: boolean }>`
  position: absolute;
  top: 0px;
  right: 0px;
  z-index: 1;
  color: white;
  background-color: #1d1f21;
  padding: 5px 10px;
  border: solid 1px grey;

  opacity: ${({ visible }) => (visible ? 1 : 0)};
  pointer-events: ${({ visible }) => (visible ? "auto" : "none")};
  transition: opacity ease-out 100ms;

  &:hover {
    opacity: 0.9;
    cursor: pointer;
  }

  &:active {
    opacity: 0.7;
    cursor: pointer;
  }
`;

function OptionComponent(props: any) {
  return (
    <Option {...props}>
      <OptionContainer>
        <Text variant="subtitle">{props.data.label}</Text>
        <Text
          variant="small"
          marginTop="6px"
          color="palette.neutral.c70"
          width="100%"
          overflow="ellipsis"
        >
          {props.data.description}
        </Text>
      </OptionContainer>
    </Option>
  );
}

async function getState(sdk: WalletAPIClient): Promise<DebuggerContext> {
  const [accounts, currencies] = await Promise.all([
    sdk.listAccounts({ currencyIds: ["ethereum"] }),
    sdk.listCurrencies({ currencyIds: ["ethereum"] }),
  ]);

  return {
    accounts,
    currencies,
  };
}

function ValueComponent(props: any) {
  return (
    <components.SingleValue {...props}>
      <Text variant="subtitle" marginRight="12px">
        {props.data.label}
      </Text>
    </components.SingleValue>
  );
}

const DebuggerContainer = styled.div`
  display: flex;
  flex-direction: row;
  height: 100%;
  position: relative;
  overflow: hidden;
  @media screen and (max-width: 800px) {
    flex-direction: column;
    padding-top: 53px;
    overflow: auto;
  }
`;

const ChipContainer = styled.div`
  background-color: ${(p) => p.theme.colors.background.main};
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1;
  padding: 12px;
  display: none;
  @media screen and (max-width: 800px) {
    display: initial;
  }
`;

const PanelContainer = styled.div<{ mobileDisplayed: boolean }>`
  flex: 1;
  max-width: 400px;
  padding: 12px;

  @media screen and (max-width: 800px) {
    padding: 12px 0px;
    max-width: 100%;
    overflow-y: auto;
    display: ${({ mobileDisplayed }) => (mobileDisplayed ? "flex" : "none")};
  }
  overflow-y: scroll;
  display: flex;
  flex-direction: column;
`;

const OutputContainer = styled.div<{ mobileDisplayed: boolean }>`
  background-color: ${(p) => p.theme.colors.background.main};
  flex: 1;
  margin-left: 12px;
  padding: 12px 0px;
  @media screen and (max-width: 800px) {
    margin-left: 0px;
    display: ${({ mobileDisplayed }) => (mobileDisplayed ? "flex" : "none")};
    pointer-events: ${({ mobileDisplayed }) =>
      mobileDisplayed ? "auto" : "none"};
  }

  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
`;

const InputContainer = styled.div`
  margin-top: 24px;
`;

const initialState = { accounts: [], currencies: [] };

export function DebuggerV2(): React.ReactElement {
  const router = useRouter();

  const { mode } = router.query;

  const platformSDK = useRef<WalletAPIClient>(
    new WalletAPIClient(
      mode === "simulator"
        ? getSimulatorTransport("strandard")
        : new WindowMessageTransport()
    )
  );

  const handlers = useMemo(() => {
    return getHandlers(platformSDK.current);
  }, []);

  const [context, setContext] = useState<DebuggerContext>(initialState);

  useEffect(() => {
    const sdk = platformSDK.current;

    getState(sdk).then((newState) => setContext(newState));
  }, []);

  const [method, setMethod] = useState<IOption>(handlerToOption(handlers[0]));

  const handleMethodChange = useCallback((option: any) => {
    setMethod(option);
  }, []);

  const handler = useMemo(() => {
    return handlers.find((handler) => handler.id === method.value);
  }, [method]);

  const [values, setValues] = useState<any[]>([]);

  const [results, setResults] = useState<Result[]>([]);

  useEffect(() => {
    if (handler) {
      const values = handler.inputs.map((input) => input.defaultValue);
      setValues(values);
    }
  }, [handler]);

  console.log({
    handler,
    context,
    values,
    results,
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [tabIndex, setTabIndex] = useState(0);

  const onTabChange = useCallback((newTabIndex: number) => {
    setTabIndex(newTabIndex);
  }, []);

  return (
    <>
      <ChipContainer>
        <Chip initialActiveIndex={0} onTabChange={onTabChange}>
          <Text color="inherit" variant="small">
            Panel
          </Text>
          <Text color="inherit" variant="small">
            Console
          </Text>
        </Chip>
      </ChipContainer>
      <DebuggerContainer>
        <PanelContainer mobileDisplayed={tabIndex === 0}>
          <div>
            <Text marginBottom="6px" variant="subtitle" display="block">
              Method
            </Text>
            <SelectInput
              options={handlers.map(handlerToOption)}
              components={{
                Option: OptionComponent,
                SingleValue: ValueComponent,
              }}
              instanceId="methodSelect"
              onChange={handleMethodChange}
              value={method}
              isSearchable={false}
            />
            {handler
              ? handler.inputs.map((input, inputIndex) => {
                  const compId = `${handler.id}-${input.name}-${inputIndex}`;
                  return (
                    <InputContainer key={compId}>
                      <Text
                        marginBottom="6px"
                        variant="subtitle"
                        display="block"
                      >
                        {input.name}
                      </Text>
                      <input.component
                        {...input.props}
                        instanceId={compId}
                        defaultValue={input.defaultValue}
                        context={context}
                        onChange={(value: any) => {
                          setValues((oldValues) => {
                            const newValues = [...oldValues];
                            newValues[inputIndex] = value;
                            return newValues;
                          });
                        }}
                      />
                    </InputContainer>
                  );
                })
              : null}
            <Button
              disabled={!handler}
              variant="color"
              marginTop="18px"
              onClick={async () => {
                if (handler) {
                  const uuid = uuidv4();
                  const queriedAt = new Date();
                  try {
                    setLoading(true);
                    const modifiedValues = values.map((value, index) => {
                      const modifier = handler.inputs[index].modifier;

                      return modifier ? modifier(value) : value;
                    });
                    const data = await handler.handler(...modifiedValues);
                    setLoading(false);

                    const newResult: Result = {
                      status: ResultStatus.SUCCESS,
                      uuid,
                      methodId: handler.id,
                      inputs: values,
                      queriedAt,
                      respondedAt: new Date(),
                      data,
                    };
                    setTabIndex(1);
                    setResults((oldResults) => {
                      const newResults = [...oldResults, newResult];

                      if (newResults.length > 10) {
                        newResults.shift();
                      }

                      return newResults;
                    });
                  } catch (error: any) {
                    const newResult: Result = {
                      status: ResultStatus.ERROR,
                      uuid,
                      methodId: handler.id,
                      inputs: values,
                      queriedAt,
                      respondedAt: new Date(),
                      error,
                    };
                    setTabIndex(1);
                    setLoading(false);
                    setResults((oldResults) => [...oldResults, newResult]);
                  }
                }
              }}
            >
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                }}
              >
                Send
                {loading ? (
                  <div style={{ marginLeft: "6px" }}>
                    <InfiniteLoader size={18} />
                  </div>
                ) : null}
              </div>
            </Button>{" "}
          </div>
        </PanelContainer>
        <OutputContainer mobileDisplayed={tabIndex === 1}>
          <ClearButton
            onClick={() => setResults([])}
            visible={results.length > 0}
          >
            <Text fontSize="12px">Clear</Text>
          </ClearButton>
          <Text marginBottom="6px" variant="subtitle" display="block">
            Results
          </Text>
          <OutputConsole results={results} />
        </OutputContainer>
      </DebuggerContainer>
    </>
  );
}
