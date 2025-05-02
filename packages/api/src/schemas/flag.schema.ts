// packages/api/src/schemas/flag.schema.ts
import { z } from "zod";

export const createFlagSchema = z.object({
  key: z.string().min(1),
  type: z.enum(["percentage", "boolean"]).default("percentage"),
  percentage: z.number().min(0).max(100).default(0.0),
  rules: z.any().optional(),        // JSON blob for attribute targeting
  isActive: z.boolean().default(true),
});

export type CreateFlagInput = z.infer<typeof createFlagSchema>;
