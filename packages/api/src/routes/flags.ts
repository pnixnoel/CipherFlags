import { Prisma } from ".prisma/client";
import { FastifyInstance } from "fastify";
import { zodToJsonSchema } from "zod-to-json-schema";
import { prismaClient } from "../utils/prisma";
import { createFlagSchema } from "../schemas/flag.schema";

export async function flagsRoutes(fastify: FastifyInstance) {
  // GET /flags → list all flags
  fastify.get("/flags", async () => {
    const flags = await prismaClient.flag.findMany();
    return flags;
  });

  // POST /flags → create a new flag
  fastify.post("/flags", {
    schema: {
      body: zodToJsonSchema(createFlagSchema),
    },
    handler: async (request, reply) => {
      const data = request.body as Prisma.FlagCreateInput; // already validated
      const newFlag = await prismaClient.flag.create({ data });
      reply.code(201).send(newFlag);
    },
  });
}
