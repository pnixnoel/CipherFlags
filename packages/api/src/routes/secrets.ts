import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

import { prismaClient } from "../utils/prisma";
import { SecretCreateSchema, SecretResponseSchema } from "../schemas/secret.schema";
import { getEncryptionProvider } from "../services/encryptionFactory";
// import { parsePagination } from "../services/pagination";

const provider = getEncryptionProvider();


type CreateSecretBody = z.infer<typeof SecretCreateSchema>;

export async function secretsRoutes(fastify: FastifyInstance) {
  // GET /secrets
  fastify.get(
    "/secrets",
    {
      schema: {
        querystring: {
          type: "object",
          properties: {
            page: { type: "number", default: 1 },
            perPage: { type: "number", default: 20 },
          },
        },
        response: {
          200: z.object({
            data: z.array(SecretResponseSchema),
            total: z.number(),
          }).required(),
        },
      },
    },
    async () => {
    //   const { skip, take } = parsePagination(request.query as any);
    //   const [data, total] = await Promise.all([
    //     prismaClient.secret.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
    //     prismaClient.secret.count(),
    //   ]);
    //   // strip ciphertext: Zod schema only returns id,name,metadata,createdAt
    //   return { data, total };

        return {}
    }
  );

  // POST /secrets
  fastify.post(
    "/secrets",
    {
      schema: {
        body: SecretCreateSchema,
        response: { 201: SecretResponseSchema },
      },
    },
    async (request: FastifyRequest<{ Body: CreateSecretBody }>, reply) => {
      const { name, plaintext, metadata } = request.body;
      const ciphertextBuf = await provider.encrypt(Buffer.from(plaintext, "utf8"));
      const ciphertext = ciphertextBuf.toString("base64");
      const secret = await prismaClient.secret.create({
        data: { name, ciphertext, metadata },
      });
      return reply.status(201).send(secret);
    }
  );
}
