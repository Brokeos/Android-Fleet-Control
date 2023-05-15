import Fastify from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import cors from '@fastify/cors'
import path from 'path';
import { config } from 'dotenv';

config();

const app = Fastify();
const port = (process.env.PORT || 4201) as number;
console.log(path.join(__dirname, 'routes'));
app.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: 'api'}
});
app.register(cors);
app.register(require('@fastify/multipart'));
app.addHook('onRoute', routeOptions => {
    console.log(`Route ${routeOptions.method} ${routeOptions.url}`);
});

const start = async () => {
    try {
        await app.listen({ port: port, host: '::' });
        console.log(`Server listening on port ${port}`);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

start();