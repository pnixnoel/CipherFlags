// packages/api/src/utils/prisma.ts
import { PrismaClient } from "@prisma/client";

// single shared instance across the app
export const prismaClient = new PrismaClient();
