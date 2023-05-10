import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';

module.exports = async function (app : FastifyInstance) {
    app.get('/', async function (request : FastifyRequest, reply : FastifyReply) {
        return { hello: 'world' }
    })
}