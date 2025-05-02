import { FastifyInstance, FastifyRequest } from "fastify";
import { z } from "zod";

import { prismaClient } from "../utils/prisma";
import { SecretRequestType } from "../schemas/secret.schema";
import { getEncryptionProvider } from "../services/encryptionFactory";
import { PaginationQuery, parsePagination } from "../services/pagination";

const provider = getEncryptionProvider();


type CreateSecretBody = z.infer<typeof SecretRequestType>;

export async function secretsRoutes(fastify: FastifyInstance) {
  // GET /secrets
  fastify.get(
    "/secrets",
    {
        schema: {
          querystring: {
            type: "object",
            properties: {
              page:    { type: "integer", default: 1, minimum: 1 },
              perPage: { type: "integer", default: 20, minimum: 1, maximum: 100 },
            },
            additionalProperties: false
          },
          response: {
            200: {
              type: "object",
              properties: {
                data: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      id:        { type: "string" },
                      name:      { type: "string" },
                      metadata:  { type: ["object", "null"] },
                      createdAt: { type: "string", format: "date-time" }
                    },
                    required: ["id","name","createdAt"],
                    additionalProperties: false
                  }
                },
                total: { type: "integer" }
              },
              required: ["data","total"],
              additionalProperties: false
            }
          }
        }
    },
    async (request) => {
        const { skip, take } = parsePagination(request.query as PaginationQuery);
        const [data, total] = await Promise.all([
            prismaClient.secret.findMany({ skip, take, orderBy: { createdAt: "desc" } }),
            prismaClient.secret.count(),
          ]);
          return { data, total };
    }
  );

  // POST /secrets
  fastify.post(
    "/secrets",
    {
        schema: {
          body: {
            type: "object",
            properties: {
              name:      { type: "string", minLength: 3 },
              plaintext: { type: "string", minLength: 1 },
              metadata:  { type: ["object","null"] },
            },
            required: ["name","plaintext"],
            additionalProperties: false
          },
          response: {
            201: {
              type: "object",
              properties: {
                id:        { type: "string" },
                name:      { type: "string" },
                metadata:  { type: ["object","null"] },
                createdAt: { type: "string", format: "date-time" }
              },
              required: ["id","name","createdAt"],
              additionalProperties: false
            }
          }
        }
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
