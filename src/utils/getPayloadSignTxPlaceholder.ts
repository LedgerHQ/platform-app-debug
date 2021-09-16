import { FAMILIES } from "@ledgerhq/live-app-sdk";

import * as algorandMocks from "@ledgerhq/live-app-sdk/dist/families/algorand/mocks";
import * as bitcoinMocks from "@ledgerhq/live-app-sdk/dist/families/bitcoin/mocks";
import * as cosmosMocks from "@ledgerhq/live-app-sdk/dist/families/cosmos/mocks";
import * as ethereumMocks from "@ledgerhq/live-app-sdk/dist/families/ethereum/mocks";
import * as polkadotMocks from "@ledgerhq/live-app-sdk/dist/families/polkadot/mocks";
import * as rippleMocks from "@ledgerhq/live-app-sdk/dist/families/ripple/mocks";
import * as stellarMocks from "@ledgerhq/live-app-sdk/dist/families/stellar/mocks";
import * as tezosMoscks from "@ledgerhq/live-app-sdk/dist/families/tezos/mocks";
import * as tronMoscks from "@ledgerhq/live-app-sdk/dist/families/tron/mocks";

import { rawTxCommon } from "@ledgerhq/live-app-sdk/dist/mock/transactionCommon";

const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
};

const generateDefaultTx = (family: FAMILIES) => {
  return {
    ...rawTxCommon,
    family,
  };
};

type Props = {
  family: FAMILIES;
  useFullTx?: boolean;
};

// FIXME: could implement and use a byFamily abstraction in SDK (but it might be a breaking change on SDK side)

const getPayloadSignTxPlaceholder = ({ family, useFullTx = false }: Props) => {
  switch (family) {
    case FAMILIES.ALGORAND:
      return {
        transaction: useFullTx ? algorandMocks.rawTxFull : algorandMocks.rawTx,
        params: {
          useApp: "Algorand",
        },
      };

    case FAMILIES.BITCOIN:
      return {
        transaction: useFullTx ? bitcoinMocks.rawTxFull : bitcoinMocks.rawTx,
        params: {
          useApp: "Bitcoin",
        },
      };

    case FAMILIES.COSMOS:
      return {
        transaction: useFullTx ? cosmosMocks.rawTxFull : cosmosMocks.rawTx,
        params: {
          useApp: "Cosmos",
        },
      };

    case FAMILIES.ETHEREUM:
      return {
        transaction: useFullTx ? ethereumMocks.rawTxFull : ethereumMocks.rawTx,
        params: {
          useApp: "Ethereum",
        },
      };

    case FAMILIES.POLKADOT:
      return {
        transaction: useFullTx ? polkadotMocks.rawTxFull : polkadotMocks.rawTx,
        params: {
          useApp: "Polkadot",
        },
      };

    case FAMILIES.RIPPLE:
      return {
        transaction: useFullTx ? rippleMocks.rawTxFull : rippleMocks.rawTx,
        params: {
          useApp: "XRP",
        },
      };

    case FAMILIES.STELLAR:
      return {
        transaction: useFullTx ? stellarMocks.rawTxFull : stellarMocks.rawTx,
        params: {
          useApp: "Stellar",
        },
      };

    case FAMILIES.TEZOS:
      return {
        transaction: useFullTx ? tezosMoscks.rawTxFull : tezosMoscks.rawTx,
        params: {
          useApp: "Tezos",
        },
      };

    case FAMILIES.TRON:
      return {
        transaction: useFullTx ? tronMoscks.rawTxFull : tronMoscks.rawTx,
        params: {
          useApp: "Tron",
        },
      };

    default:
      return {
        transaction: generateDefaultTx(family),
        params: {
          useApp: capitalizeFirstLetter(family),
        },
      };
  }
};

export default getPayloadSignTxPlaceholder;
