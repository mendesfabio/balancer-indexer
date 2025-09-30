import { addRemove, pool, user } from "ponder:schema";
import { Context } from "ponder:registry";

import { LiquidityAction } from "./types";

export async function handleLiquidityEvent(
  context: Context<"Vault:LiquidityAdded" | "Vault:LiquidityRemoved">,
  event: any,
  action: LiquidityAction,
  amounts: readonly bigint[]
) {
  const poolAddress = event.args.pool;
  const liquidityProvider = event.args.liquidityProvider;

  const existingPool = await context.db.find(pool, { id: poolAddress });
  if (!existingPool) return;

  await context.db
    .insert(user)
    .values({
      id: liquidityProvider,
    })
    .onConflictDoNothing();

  await context.db.insert(addRemove).values({
    id: event.id as `0x${string}`,
    type: action,
    sender: liquidityProvider,
    amounts: [...amounts],
    pool: poolAddress,
    chainId: context.chain.id,
    user: liquidityProvider,
    blockNumber: event.block.number,
    blockTimestamp: event.block.timestamp,
    transactionHash: event.transaction.hash,
    logIndex: BigInt(event.log.logIndex),
  });
}
