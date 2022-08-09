import { MethodHandler } from "./types";
import LedgerLiveApi, {
  deserializeTransaction,
  ExchangeType,
} from "@ledgerhq/live-app-sdk";
import { AccountSelector } from "./inputs/AccountSelector";
import { ValueSelector } from "./inputs/ValueSelector";
import dynamic from "next/dynamic";
import { InputComponent } from "./inputs/types";

import defaultListCurrencyParameters from "./defaults/listCurrency/parameters.json";
import defaultRequestAccountParameters from "./defaults/requestAccount/parameters.json";
import defaultSignTransactionTransaction from "./defaults/signTransaction/transaction.json";
import defaultSignTransactionParameters from "./defaults/signTransaction/parameters.json";
import defaultCompleteExchangeParameters from "./defaults/completeExchange/parameters.json";

const JSONTextArea = dynamic(
  import("./inputs/JSONTextArea").then((mod) => mod.JSONTextArea),
  {
    ssr: false,
  }
) as InputComponent;

export function getHandlers(platformSDK: LedgerLiveApi): MethodHandler[] {
  return [
    {
      id: "listCurrencies",
      name: "List currencies",
      description: "List all supported currencies",
      handler: platformSDK.listCurrencies.bind(platformSDK),
      inputs: [
        {
          name: "parameters",
          component: JSONTextArea,
          modifier: (value: any) => JSON.parse(value),
          defaultValue: JSON.stringify(defaultListCurrencyParameters, null, 3),
        },
      ],
    },
    {
      id: "listAccounts",
      name: "List accounts",
      description: "List all user accounts",
      handler: platformSDK.listAccounts.bind(platformSDK),
      inputs: [],
    },
    {
      id: "requestAccount",
      name: "Request an Account",
      description: "Display a Native UI and have the user select an account",
      handler: platformSDK.requestAccount.bind(platformSDK),
      inputs: [
        {
          name: "parameters",
          component: JSONTextArea,
          modifier: (value: any) => JSON.parse(value),
          defaultValue: JSON.stringify(
            defaultRequestAccountParameters,
            null,
            3
          ),
        },
      ],
    },
    {
      id: "verifyAddress",
      name: "Verify an address",
      description:
        "Display a Native UI and have the user verifying an address using his Hardware Wallet",
      handler: platformSDK.receive.bind(platformSDK),
      inputs: [
        {
          name: "account",
          component: AccountSelector,
        },
      ],
    },
    {
      id: "signTransaction",
      name: "Sign a transaction",
      description:
        "Display a Native UI and have the user signing a transaction using his Hardware Wallet",
      handler: platformSDK.signTransaction.bind(platformSDK),
      inputs: [
        {
          name: "account",
          component: AccountSelector,
        },
        {
          name: "transaction",
          component: JSONTextArea,
          modifier: (tx: any) => deserializeTransaction(JSON.parse(tx)),
          defaultValue: JSON.stringify(
            defaultSignTransactionTransaction,
            null,
            3
          ),
        },
        {
          name: "parameters",
          component: JSONTextArea,
          modifier: (value: any) => JSON.parse(value),
          defaultValue: JSON.stringify(
            defaultSignTransactionParameters,
            null,
            3
          ),
        },
      ],
    },
    {
      id: "startExchange",
      name: "Start an Exchange Process",
      description:
        "Start a secure end to end process with a trusted third party",
      handler: (exchangeType) => platformSDK.startExchange({ exchangeType }),
      inputs: [
        {
          name: "Exchange Type",
          props: {
            options: [
              {
                value: ExchangeType.SWAP,
                label: "Swap",
              },
              {
                value: ExchangeType.FUND,
                label: "Fund",
              },
              {
                value: ExchangeType.SELL,
                label: "Sell",
              },
            ],
          },
          component: ValueSelector,
        },
      ],
    },
    {
      id: "completeExchange",
      name: "Complete an Exchange Process",
      description:
        "Complete a secure end to end process with a trusted third party",
      handler: platformSDK.completeExchange.bind(platformSDK),
      inputs: [
        {
          name: "parameters",
          component: JSONTextArea,
          modifier: (value: any) => JSON.parse(value),
          defaultValue: JSON.stringify(
            defaultCompleteExchangeParameters,
            null,
            3
          ),
        },
      ],
    },
    {
      id: "signMessage",
      name: "Sign a message",
      description:
        "Display a Native UI and have the user signing a message using his Hardware Wallet",
      handler: platformSDK.signMessage.bind(platformSDK),
      // TODO: Pass mode to AceEditor, inside JSONTextArea (ie json or text)
      inputs: [
        {
          name: "account",
          component: AccountSelector,
        },
        {
          name: "message",
          component: JSONTextArea,
          modifier: (value: any) => Buffer.from(value),
          defaultValue: "Test message",
          mode: "text",
        },
      ],
    },
  ];
}
