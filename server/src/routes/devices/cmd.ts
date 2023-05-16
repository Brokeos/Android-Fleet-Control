import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { groupShellCmd, groupAdbCmd } from '../../adb/cmd';

module.exports = async function (app : FastifyInstance) {

//Execution d'une cmd shell sur des machines et retourne le res aux machines.
    app.post('/shellcmd', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList, cmd} = request.body as any;
        const res = groupShellCmd(deviceList, cmd);

        reply.send(JSON.stringify(res));
    });
    
//Execution d'une cmd shell sur des machines et retourne le res aux machines.
    app.post('/adbcmd', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList, cmd} = request.body as any;
        const res = groupAdbCmd(deviceList, cmd);

        reply.send(JSON.stringify(res));
    });
}