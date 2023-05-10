import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import { screenCap, recordScreen} from '../../adb/screen';

module.exports = async function (app : FastifyInstance) {

    app.get('/recordscreen', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList, secondes} = request.body as any;
        let filesRes = {};
        let filenames = [];
        
        for (var i in deviceList) {
            filenames.push(recordScreen(deviceList[i], secondes));
        }

        for(var i in filenames){
            let data = fs.readFileSync(filenames[i] as any, { encoding: 'base64', flag: 'r' });

            // @ts-ignore
            filesRes[filenames[i]] = data

            fs.rm(filenames[i] as any, () => {});
        }

        reply.send(JSON.stringify(filesRes));
    });

    app.get('/screencapture', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList, secondes} = request.body as any;
        let filesRes = {};
        let filenames = [];
        
        for (var i in deviceList) {
            filenames.push(screenCap(deviceList[i]));
        }

        for(var i in filenames){
            let data = fs.readFileSync(filenames[i] as any, { encoding: 'base64', flag: 'r' });

            // @ts-ignore
            filesRes[filenames[i]] = data

            fs.rm(filenames[i] as any, () => {});
        }

        reply.send(JSON.stringify(filesRes));
    });
    
}