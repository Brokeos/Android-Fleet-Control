import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { getDevices, getBatteryLevel, getDevicesName } from '../../adb/utils';

module.exports = async function (app : FastifyInstance) {

//Récupération des toutes les machines connectées.
    app.get('/', async function (request : FastifyRequest, reply : FastifyReply) {
        reply.send(getDevices());
    });

//Récupération de tous les niveaux de batteries des machines.
    app.post('/batterylevels', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        reply.send(getBatteryLevel(deviceList));        
    });

//Récupération du nom des machines. 
    app.post('/devicesname', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        reply.send(getDevicesName(deviceList));
    });
}

