import { z } from 'zod';

export const OHLCVSchema = z.tuple([
  z.number(), // Open time
  z.string(), // Open
  z.string(), // High
  z.string(), // Low
  z.string(), // Close
  z.string(), // Volume
  z.number(), // Close time
  z.string(), // Quote asset volume
  z.number(), // Number of trades
  z.string(), // Taker buy base asset volume
  z.string(), // Taker buy quote asset volume
  z.string(), // Ignore
]);

export type OHLCV = z.infer<typeof OHLCVSchema>;

export interface Pattern {
  startIndex: number;
  endIndex: number;
  confidence: number;
}