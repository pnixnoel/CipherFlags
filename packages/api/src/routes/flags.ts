import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";
import { zodToJsonSchema } from "zod-to-json-schema";
import { prismaClient } from "../utils/prisma";
import { createFlagSchema } from "../schemas/flag.schema";

type CreateFlagBody = z.infer<typeof createFlagSchema>;

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
    handler: async (request: FastifyRequest<{ Body: CreateFlagBody }>, reply) => {
      const data = request.body; // already validated
      const newFlag = await prismaClient.flag.create({ data });
      reply.code(201).send(newFlag);
    },
  });
}
