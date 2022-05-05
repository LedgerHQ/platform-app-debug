import { MethodHandler } from "./types";
import LedgerLiveApi from "@ledgerhq/live-app-sdk";
import { AccountSelector } from "./inputs/AccountSelector";
import dynamic from "next/dynamic";
import { InputComponent } from "./inputs/types";

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
        },
        {
          name: "parameters",
          component: JSONTextArea,
        },
      ],
    },
  ];
}
