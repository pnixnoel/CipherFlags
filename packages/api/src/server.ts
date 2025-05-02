// packages/api/src/server.ts
import Fastify from 'fastify';

import { flagsRoutes } from "./routes/flags";
import { secretsRoutes } from "./routes/secrets";

const app = Fastify({
  logger: true, // optional: logs requests
})

async function start() {
  try {
    const app = Fastify({ logger: true });


    // health check route
    app.get('/healthz', async () => {
      return { ok: true }
    })

    // register our flags endpoints
    await flagsRoutes(app);

    await secretsRoutes(app);


    await app.listen({ port: 4000 });
  }
  catch (err) {
    app.log.error(err)
  }
}

start()
