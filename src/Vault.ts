import { ponder } from "ponder:registry";
import { pool, poolToken, swap, token } from "ponder:schema";

import { getTokenInfo } from "./utils/erc20";
import { LiquidityAction } from "./utils/types";
import { handleLiquidityEvent } from "./utils/handlers";

ponder.on("Vault:PoolRegistered", async ({ context, event }) => {
  const poolAddress = event.args.pool;
  const tokenConfigs = event.args.tokenConfig;

  const bpt = await getTokenInfo(context, poolAddress);

  await context.db.insert(pool).values({
    id: event.args.pool,
    chainId: context.chain.id,
    name: bpt.name,
    symbol: bpt.symbol,
    swapFee: event.args.swapFeePercentage,
  });

  for (const tokenConfig of tokenConfigs) {
    const tokenAddress = tokenConfig.token;

    let tokenExists = await context.db.find(token, { id: tokenAddress });
    if (!tokenExists) {
      const tokenInfo = await getTokenInfo(context, tokenAddress);

      await context.db.insert(token).values({
        id: tokenAddress,
        chainId: context.chain.id,
        name: tokenInfo.name,
        symbol: tokenInfo.symbol,
        decimals: tokenInfo.decimals,
      });
    }

    await context.db.insert(poolToken).values({
      pool: poolAddress,
      token: tokenAddress,
      chainId: context.chain.id,
      balance: 0n,
    });
  }
});

ponder.on("Vault:SwapFeePercentageChanged", async ({ context, event }) => {
  const poolAddress = event.args.pool;
  const swapFeePercentage = event.args.swapFeePercentage;

  const existingPool = await context.db.find(pool, { id: poolAddress });
  if (!existingPool) {
    return;
  }

  await context.db.update(pool, { id: poolAddress }).set({
    swapFee: swapFeePercentage,
  });
});

ponder.on("Vault:Swap", async ({ context, event }) => {
  const poolDb = await context.db.find(pool, {
    id: event.args.pool,
  });

  const tokenIn = await context.db.find(token, {
    id: event.args.tokenIn,
  });

  const tokenOut = await context.db.find(token, {
    id: event.args.tokenOut,
  });

  if (!poolDb || !tokenIn || !tokenOut) return;

  await context.db.insert(swap).values({
    id: event.id as `0x${string}`,
    chainId: context.chain.id,
    pool: poolDb.id,
    tokenIn: tokenIn.id,
    tokenOut: tokenOut.id,
    tokenInSymbol: tokenIn.symbol,
    tokenOutSymbol: tokenOut.symbol,
    tokenAmountIn: event.args.amountIn,
    tokenAmountOut: event.args.amountOut,
    swapFeeToken: event.args.tokenIn,
    swapFeeAmount: event.args.swapFeeAmount,
    user: event.args.pool,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: BigInt(event.log.logIndex),
  });
});

ponder.on("Vault:LiquidityAdded", async ({ context, event }) => {
  await handleLiquidityEvent(
    context,
    event,
    LiquidityAction.Add,
    event.args.amountsAddedRaw
  );
});

ponder.on("Vault:LiquidityRemoved", async ({ context, event }) => {
  await handleLiquidityEvent(
    context,
    event,
    LiquidityAction.Remove,
    event.args.amountsRemovedRaw
  );
});
