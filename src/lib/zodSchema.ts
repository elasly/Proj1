import * as z from "zod";

// First, define the schema for a single rule
const ruleSchema = z.object({
  strategyID: z.number(),
  ruleType: z.enum(["entryRule", "exitRule"]),
  ruleAction: z.enum(["long", "short", "hold"]),
  indicatorId: z.number(),
  operator: z.enum(["<", ">", "=", "<=", ">=", "crossOver", "crossUnder"]),
  value: z.number().optional(),
  sequence: z.number(),
  logicalOperator: z.string(),
  compareTo: z.enum(["indicator", "threshold", "slope", "price"]),
  compIndicatorId: z.number().optional(),
  slope: z.enum(["positive", "negative", "zero", "positiveOrZero", "negativeOrZero"]).optional(),
  priceAction: z.enum(["Close", "Open", "High", "Low"]).optional(),
});


const strategySchema = z.object({
  name: z.string().min(1, "Strategy name is required"),
  description: z.string(),
  entryRules: z.array(ruleSchema),
  exitRules: z.array(ruleSchema),
});
export type StrategyFormData = z.infer<typeof strategySchema>;

// Then, define the schema for the entire strategy rules
export const strategyRulesSchema = z.object({
  entryRules: z.array(ruleSchema),
  exitRules: z.array(ruleSchema),
});

// Infer the TypeScript type from the Zod schema
export type StrategyRulesFormData = z.infer<typeof strategyRulesSchema>;