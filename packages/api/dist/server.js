// packages/api/src/server.ts
import Fastify from 'fastify';
const app = Fastify({
    logger: true, // optional: logs requests
});
// health check route
app.get('/healthz', async () => {
    return { ok: true };
});
// start server
const start = async () => {
    try {
        await app.listen({ port: 3000, host: '0.0.0.0' });
    }
    catch (err) {
        app.log.error(err);
        process.exit(1);
    }
};
start();
