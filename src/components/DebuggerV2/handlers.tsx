import { MethodHandler } from "./types";
import { AccountSelector } from "./inputs/AccountSelector";
// import { ValueSelector } from "./inputs/ValueSelector";
import dynamic from "next/dynamic";
import { InputComponent } from "./inputs/types";

import defaultListCurrencyParameters from "./defaults/listCurrency/parameters.json";
import defaultListAccountsParameters from "./defaults/listAccounts/parameters.json";
import defaultRequestAccountParameters from "./defaults/requestAccount/parameters.json";
import defaultSignTransactionTransaction from "./defaults/signTransaction/transaction.json";
import defaultSignTransactionParameters from "./defaults/signTransaction/parameters.json";
// import defaultCompleteExchangeParameters from "./defaults/completeExchange/parameters.json";
import {
  deserializeTransaction,
  WalletAPIClient,
} from "@ledgerhq/wallet-api-client";

const JSONTextArea = dynamic(
  import("./inputs/JSONTextArea").then((mod) => mod.JSONTextArea),
  {
    ssr: false,
  }
) as InputComponent;

export function getHandlers(walletAPIClient: WalletAPIClient): MethodHandler[] {
  return [
    {
      id: "listCurrencies",
      name: "List currencies",
      description: "List all supported currencies",
      handler: walletAPIClient.listCurrencies.bind(walletAPIClient),
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
      handler: walletAPIClient.listAccounts.bind(walletAPIClient),
      inputs: [
        {
          name: "parameters",
          component: JSONTextArea,
          modifier: (value: any) => JSON.parse(value),
          defaultValue: JSON.stringify(defaultListAccountsParameters, null, 3),
        },
      ],
    },
    {
      id: "requestAccount",
      name: "Request an Account",
      description: "Display a Native UI and have the user select an account",
      handler: walletAPIClient.requestAccount.bind(walletAPIClient),
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
      id: "signTransaction",
      name: "Sign a transaction",
      description:
        "Display a Native UI and have the user signing a transaction using his Hardware Wallet",
      handler: walletAPIClient.signTransaction.bind(walletAPIClient),
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
      id: "signMessage",
      name: "Sign a message",
      description:
        "Display a Native UI and have the user signing a message using his Hardware Wallet",
      handler: walletAPIClient.signMessage.bind(walletAPIClient),
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
