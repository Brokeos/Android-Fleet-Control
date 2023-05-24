import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { addWifiNetwork, checkWifiNetwork, toggleWifi, forgetWifi } from '../../adb/wifi';

module.exports = async function (app : FastifyInstance) {

    app.post('/addwifi', async function (request : FastifyRequest, reply : FastifyReply) {
        const{deviceList, ssid, passwordType, password, username} = request.body as any;
        
        const res = addWifiNetwork(deviceList, ssid, passwordType, password, username);

        checkWifiNetwork(deviceList);
        
        reply.send(JSON.stringify(res));
    });

    app.post('/disablewifi', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = toggleWifi(deviceList, false);

        reply.send(JSON.stringify(res));
    });

    app.post('/enablewifi', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = toggleWifi(deviceList, true);

        reply.send(JSON.stringify(res));
    });

    app.post('/forgetallwifi', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = forgetWifi(deviceList);

        reply.send(JSON.stringify(res));
    });

    app.post('/getwificonnection', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = checkWifiNetwork(deviceList);

        reply.send(JSON.stringify(res));
    });
    
}