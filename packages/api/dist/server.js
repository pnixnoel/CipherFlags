"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// packages/api/src/server.ts
const fastify_1 = __importDefault(require("fastify"));
const flags_1 = require("./routes/flags");
const secrets_1 = require("./routes/secrets");
const app = (0, fastify_1.default)({
    logger: true, // optional: logs requests
});
async function start() {
    try {
        const app = (0, fastify_1.default)({ logger: true });
        // health check route
        app.get('/healthz', async () => {
            return { ok: true };
        });
        // register our flags endpoints
        await (0, flags_1.flagsRoutes)(app);
        await (0, secrets_1.secretsRoutes)(app);
        await app.listen({ port: 4000 });
    }
    catch (err) {
        app.log.error(err);
    }
}
start();
