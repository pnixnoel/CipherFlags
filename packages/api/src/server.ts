// packages/api/src/server.ts

import Fastify from 'fastify'
import { FastifyInstance, FastifyRequest, FastifyReply } from 'fastify'

const app = Fastify({
  logger: true, // optional: logs requests
})

// health check route
app.get('/healthz', async (req: FastifyRequest, reply: FastifyReply) => {
  return { ok: true }
})

// start server
const start = async () => {
  try {
    await app.listen({ port: 3000, host: '0.0.0.0' })
    console.log('🚀 API server ready at http://localhost:3000')
  } catch (err) {
    app.log.error(err)
    process.exit(1)
  }
}

start()
