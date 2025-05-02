import { z } from "zod";

export const SecretRequestType = z.object({
  name: z.string().min(3, "Name must be at least 3 chars"),
  plaintext: z.string().min(1, "Secret cannot be empty"),
  metadata: z.record(z.any()).optional(),
});

export const SecretResponseSchema = z.object({
  id: z.string(),
  name: z.string(),
  metadata: z.record(z.any()).nullable(),
  createdAt: z.string(),  // ISO
});
