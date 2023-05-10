import Fastify from 'fastify';
import fastifyAutoload from '@fastify/autoload';
import path from 'path';
import { config } from 'dotenv';

config();

const app = Fastify();
const port = (process.env.PORT || 3000) as number;

app.register(fastifyAutoload, {
    dir: path.join(__dirname, 'routes'),
    options: { prefix: 'api'}
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