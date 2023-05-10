import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { addWifiNetwork, checkWifiNetwork, toggleWifi, forgetWifi, getwificonnection } from '../../adb/wifi';

module.exports = async function (app : FastifyInstance) {

    app.get('/addwifi', async function (request : FastifyRequest, reply : FastifyReply) {
        const{deviceList, ssid, passwordType, password, username} = request.body as any;
        
        addWifiNetwork(deviceList, ssid, passwordType, password, username);

        const res = checkWifiNetwork(deviceList);
        
        reply.send(JSON.stringify(res));
    });

    app.get('/disablewifi', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = toggleWifi(deviceList, false);

        reply.send(JSON.stringify(res));
    });

    app.get('/enablewifi', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = toggleWifi(deviceList, true);

        reply.send(JSON.stringify(res));
    });

    app.get('/forgetallwifi', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = forgetWifi(deviceList);

        reply.send(JSON.stringify(res));
    });

    app.get('/getwificonnection', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = checkWifiNetwork(deviceList);

        reply.send(JSON.stringify(res));
    });
    
}