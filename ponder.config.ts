import { createConfig } from "ponder";

import { UnverifiedContractAbi } from "./abis/UnverifiedContractAbi";

export default createConfig({
  chains: { mainnet: { id: 1, rpc: "http(process.env.PONDER_RPC_URL_1)" } },
  contracts: {
    UnverifiedContract: {
      abi: UnverifiedContractAbi,
      address: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
      chain: "mainnet",
    },
  },
});
