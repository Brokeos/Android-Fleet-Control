import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { startScrcpy } from '../../adb/stream';


module.exports = async function (app : FastifyInstance) {
    app.post('/stream', async function (request : FastifyRequest, reply : FastifyReply) {
        const { device } = request.body as any;

        startScrcpy(device);

        reply.send(JSON.stringify({status: "SUCCESS"}));
    });
}