import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import { deleteFile, pullFiles, pushFiles } from '../../adb/file';

module.exports = async function (app : FastifyInstance) {

/*
    Télécharge un fichier du front-end,
    Le pousse sur les machines,
    Puis supprime le fichier du serveur.
*/
    app.get('/pushfile', async function (request : FastifyRequest, reply : FastifyReply) {
        const {file} = request.files as any;

        if(file == undefined || file == null){
            reply.status(415).send("Pas de fichier uploadé");
        }

        const {deviceList} = JSON.parse(request.body as any);

        file.mv(file.name, function(error : any, message : any){
            if(error){
                reply.status(415).send("Erreur : Sauvegarde échouée.");
            } else {
                const res = pushFiles(deviceList, file.name, "/sdcard/");
                reply.send(JSON.stringify(res));
                fs.rm(file.name, () => {});
            }
        });
    });

//Supprimer un fichier des machines.
    app.get('/deletefile', async function (request : FastifyRequest, reply : FastifyReply) {
        const{deviceList, filePath} = request.body as any;
        const res = deleteFile(deviceList, filePath);

        reply.send(JSON.stringify(res));
    });

//Récupérer les fichiers des machines.
    app.get('/pullfile', async function (request : FastifyRequest, reply : FastifyReply) {
        const{deviceList, filePath} = request.body as any;
        const splitFilePath = filePath.split("/");
        const filename = splitFilePath[splitFilePath.length - 1];
        let res = {};

        for(var i in deviceList){
            let succes = pullFiles(deviceList[i], filePath);

            if(succes){
                let newFileName = deviceList[i] + "_" + filename;
                let data = fs.readFileSync(newFileName, {encoding : 'base64', flag : 'r' });

                // @ts-ignore
                res[deviceList[i]] = {succes : true, data : data, filename : newFileName};
                fs.rm(newFileName, () => {});
            } else {
                // @ts-ignore
                res[deviceList[i]] = { success: false, error: "File " + filePath + " does not exist on device " + deviceList[i] };
            }
        }

        reply.send(JSON.stringify(res));
    });
    
}