import { relations, sql } from "drizzle-orm";
import {
  index,
  integer,
  pgTableCreator,
  primaryKey,
  serial,
  text,
  boolean,
  doublePrecision,
  timestamp,
  varchar,
  jsonb,
} from "drizzle-orm/pg-core";
import { type AdapterAccount } from "next-auth/adapters";

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `strattrader_${name}`);

export const posts = createTable(
  "post",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 256 }),
    createdById: varchar("created_by", { length: 255 })
      .notNull()
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (example) => ({
    createdByIdIdx: index("created_by_idx").on(example.createdById),
    nameIndex: index("name_idx").on(example.name),
  })
);

export const users = createTable("user", {
  id: varchar("id", { length: 255 })
    .notNull()
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: varchar("name", { length: 255 }),
  email: varchar("email", { length: 255 }).notNull(),
  emailVerified: timestamp("email_verified", {
    mode: "date",
    withTimezone: true,
  }).default(sql`CURRENT_TIMESTAMP`),
  image: varchar("image", { length: 255 }),
  role: varchar("role", { length: 255 }),
  subLevel: varchar("sub_level", { length: 25 }),
});

export const usersRelations = relations(users, ({ many }) => ({
  accounts: many(accounts),
}));

export const accounts = createTable(
  "account",
  {
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    type: varchar("type", { length: 255 })
      .$type<AdapterAccount["type"]>()
      .notNull(),
    provider: varchar("provider", { length: 255 }).notNull(),
    providerAccountId: varchar("provider_account_id", {
      length: 255,
    }).notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: varchar("token_type", { length: 255 }),
    scope: varchar("scope", { length: 255 }),
    id_token: text("id_token"),
    session_state: varchar("session_state", { length: 255 }),
  },
  (account) => ({
    compoundKey: primaryKey({
      columns: [account.provider, account.providerAccountId],
    }),
    userIdIdx: index("account_user_id_idx").on(account.userId),
  })
);

export const accountsRelations = relations(accounts, ({ one }) => ({
  user: one(users, { fields: [accounts.userId], references: [users.id] }),
}));

export const sessions = createTable(
  "session",
  {
    sessionToken: varchar("session_token", { length: 255 })
      .notNull()
      .primaryKey(),
    userId: varchar("user_id", { length: 255 })
      .notNull()
      .references(() => users.id),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (session) => ({
    userIdIdx: index("session_user_id_idx").on(session.userId),
  })
);

export const sessionsRelations = relations(sessions, ({ one }) => ({
  user: one(users, { fields: [sessions.userId], references: [users.id] }),
}));

export const verificationTokens = createTable(
  "verification_token",
  {
    identifier: varchar("identifier", { length: 255 }).notNull(),
    token: varchar("token", { length: 255 }).notNull(),
    expires: timestamp("expires", {
      mode: "date",
      withTimezone: true,
    }).notNull(),
  },
  (vt) => ({
    compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }),
  })
);

export const authenticators = createTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => ({
    compositePK: primaryKey({
      columns: [authenticator.userId, authenticator.credentialID],
    }),
  })
)

export const extra_data = createTable("user_extra_data", {
  userId: varchar("user_id", { length: 255 })
    .notNull()
    .references(() => users.id)
    .primaryKey(),
  phoneNumber: varchar("phone_number", { length: 20 }),
  birthdate: timestamp("birthdate", { mode: "date" }),
  occupation: varchar("occupation", { length: 100 }),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

export const subscriptionTiers = createTable('subscription_tiers', {
  id: varchar('id', { length: 255 }).primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  price: integer('price').notNull(),
  features: jsonb('features').notNull(),
});

export const userSubscriptions = createTable('user_subscriptions', {
  userId: varchar('user_id', { length: 255 }).notNull().references(() => users.id),
  tierId: varchar('tier_id', { length: 255 }).notNull().references(() => subscriptionTiers.id),
  isActive: boolean('is_active').notNull().default(true),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
});

export const userExtraDataRelations = relations(extra_data, ({ one }) => ({
  user: one(users, { fields: [extra_data.userId], references: [users.id] }),
}));

export const indicator = createTable("indicator", {
	id: serial("id").primaryKey().notNull(),
	name: varchar("name"),
	group: varchar("group"),
	description: varchar("description"),
	inputs: varchar("inputs"),
	outputs: varchar("outputs"),
});

export const assetData = createTable("asset_data", {
	id: serial("id").primaryKey().notNull(),
	timestamp: timestamp("timestamp", { mode: 'string' }),
	assetName: varchar("asset_name"),
	open: doublePrecision("open"),
	high: doublePrecision("high"),
	low: doublePrecision("low"),
	close: doublePrecision("close"),
	volume: doublePrecision("volume"),
	timeframe: varchar("timeframe", { length: 10 }),
	exchange: varchar("exchange", { length: 16 }),
});

export const strategies = createTable("strategies", {
	id: serial("id").primaryKey().notNull(),
  user_id: varchar("user_id", { length: 255 }).notNull(),
	strat_name: varchar("name").notNull().unique(),
	description: varchar("description").notNull(),
  entryRules: jsonb("entryRules").array(),
  exitRules: jsonb("exitRules").array(),
  riskManagement: jsonb("riskManagement").array(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true }).notNull(),
});

export const exitRules = createTable("exit_rules", {
	id: serial("id").primaryKey().notNull(),
	strategyId: integer("strategy_id").references(() => strategies.id).notNull(),
	ruleType: varchar("rule_type").notNull(), // e.g., "buy", "sell"
	indicatorId: integer("indicator_id").references(() => indicator.id),
	// patternId: integer("pattern_id").references(() => patterns.id),
	operator: varchar("operator", { length: 10 }), // e.g., "greater", "less", "crossAbove", "crossBelow"
  value: doublePrecision("value"), // threshold value for the rule
  sequence: integer("sequence"), // order of rule execution
  logicalOperator: varchar("logical_operator", { length: 3 }), // "AND" or "OR"
  compareTo: varchar("compare_to", { length: 10 }), // e.g., "value", "slope", "price", "indicator"
  compIndicatorId: integer("comp_indicator_id").references(() => indicator.id), // id of the indicator to compare to
  slope:varchar("slope", { length: 25 }), // e.g., "positive", "negative", "neutral"
  priceAction: varchar("price_action", { length: 10 }), // e.g., "Close", "Open"
});


export const entryRules = createTable("entry_rules", {
	id: serial("id").primaryKey().notNull(),
	strategyId: integer("strategy_id").references(() => strategies.id).notNull(),
	ruleType: varchar("rule_type").notNull(), // e.g., "buy", "sell"
	indicatorId: integer("indicator_id").references(() => indicator.id),
	// patternId: integer("pattern_id").references(() => patterns.id),
	operator: varchar("operator", { length: 10 }), // e.g., "greater", "less", "crossAbove", "crossBelow"
  value: doublePrecision("value"), // threshold value for the rule
  sequence: integer("sequence"), // order of rule execution
  logicalOperator: varchar("logical_operator", { length: 3 }), // "AND" or "OR"
  compareTo: varchar("compare_to", { length: 10 }), // e.g., "value", "slope", "price", "indicator"
  compIndicatorId: integer("comp_indicator_id").references(() => indicator.id), // id of the indicator to compare to
  slope:varchar("slope", { length: 25 }), // e.g., "positive", "negative", "neutral"
  priceAction: varchar("price_action", { length: 10 }), // e.g., "Close", "Open"
});

export const riskManagement = createTable("risk_management", {
	id: serial("id").primaryKey().notNull(),
	strategyId: integer("strategy_id").references(() => strategies.id),
	maxDrawdown: doublePrecision("max_drawdown"),
	stopLossType: varchar("stop_loss_type"),
	stopLossValue: doublePrecision("stop_loss_value"),
	stopLossRuleId: integer("stop_loss_rule_id"),
});
