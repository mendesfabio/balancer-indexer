import { Context } from "ponder:registry";
import { erc20Abi } from "viem";

export async function getTokenInfo(context: Context, address: `0x${string}`) {
  const [name, symbol, decimals] = await context.client.multicall({
    contracts: [
      {
        address: address,
        abi: erc20Abi,
        functionName: "name",
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: "symbol",
      },
      {
        address: address,
        abi: erc20Abi,
        functionName: "decimals",
      },
    ],
  });

  return {
    name: name.result || "",
    symbol: symbol.result || "",
    decimals: BigInt(decimals.result || 18),
  };
}
