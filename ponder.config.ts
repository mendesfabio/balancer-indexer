import { createConfig } from "ponder";

import { VaultAbi } from "./abis/Vault";

export default createConfig({
  chains: {
    ethereum: {
      id: 1,
      rpc: process.env.PONDER_RPC_URL_1 || "https://eth.llamarpc.com",
    },
  },
  contracts: {
    Vault: {
      abi: VaultAbi,
      address: "0xbA1333333333a1BA1108E8412f11850A5C319bA9",
      startBlock: 21332121,
      chain: "ethereum",
    },
  },
});
