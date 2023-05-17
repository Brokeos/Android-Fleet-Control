import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import { currentDateFormat } from '../../adb/utils';

import * as fs from 'fs';
import path from 'path';

var index: number = 0;
const nomFichier = path.resolve(__dirname, '../../log') +"/"+currentDateFormat()+"-logs.log";
module.exports = async function (app : FastifyInstance) {
    app.get('/getlog', async function (request : FastifyRequest, reply : FastifyReply) {
          const contenuFichier = fs.readFileSync(nomFichier.replace("dist/",''), 'utf-8');
          const lignes = contenuFichier.split('\n');
          reply.send(lignes.slice(index == 0 ? 0 : index - 1 ));
          index = lignes.length;
    });
}