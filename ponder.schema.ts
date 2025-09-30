import { onchainTable, primaryKey, relations } from "ponder";

export const user = onchainTable("user", (t) => ({
  id: t.hex().primaryKey(),
}));

export const pool = onchainTable("pool", (t) => ({
  id: t.hex().primaryKey(),
  chainId: t.integer().notNull(),
  name: t.text().notNull(),
  symbol: t.text().notNull(),
  swapFee: t.bigint().notNull(),
}));

export const token = onchainTable("token", (t) => ({
  id: t.hex().primaryKey(),
  chainId: t.integer().notNull(),
  name: t.text().notNull(),
  symbol: t.text().notNull(),
  decimals: t.bigint().notNull(),
}));

export const poolToken = onchainTable(
  "poolToken",
  (t) => ({
    pool: t.hex().notNull(),
    token: t.hex().notNull(),
    chainId: t.integer().notNull(),
    balance: t.bigint().notNull(),
  }),
  (table) => ({
    pk: primaryKey({ columns: [table.pool, table.token, table.chainId] }),
  })
);

export const swap = onchainTable("swap", (t) => ({
  id: t.hex().primaryKey(),
  pool: t.hex().notNull(),
  chainId: t.integer().notNull(),
  tokenIn: t.hex().notNull(),
  tokenInSymbol: t.text().notNull(),
  tokenOutSymbol: t.text().notNull(),
  tokenAmountOut: t.bigint().notNull(),
  tokenOut: t.hex().notNull(),
  tokenAmountIn: t.bigint().notNull(),
  swapFeeToken: t.hex().notNull(),
  swapFeeAmount: t.bigint().notNull(),
  user: t.hex().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.bigint().notNull(),
}));

export const addRemove = onchainTable("addRemove", (t) => ({
  id: t.hex().primaryKey(),
  type: t.text().notNull(),
  sender: t.hex().notNull(),
  amounts: t.bigint().array().notNull(),
  pool: t.hex().notNull(),
  chainId: t.integer().notNull(),
  user: t.hex().notNull(),
  blockNumber: t.bigint().notNull(),
  blockTimestamp: t.bigint().notNull(),
  transactionHash: t.hex().notNull(),
  logIndex: t.bigint().notNull(),
}));

export const swapRelations = relations(swap, ({ one }) => ({
  pool: one(pool, {
    fields: [swap.pool, swap.chainId],
    references: [pool.id, pool.chainId],
  }),
  user: one(user, {
    fields: [swap.user],
    references: [user.id],
  }),
}));

export const addRemoveRelations = relations(addRemove, ({ one }) => ({
  pool: one(pool, {
    fields: [addRemove.pool, addRemove.chainId],
    references: [pool.id, pool.chainId],
  }),
  user: one(user, {
    fields: [addRemove.user],
    references: [user.id],
  }),
}));
