import { FastifyInstance, FastifyReply, FastifyRequest } from 'fastify';
import fs from 'fs';
import fastifyMultipart from '@fastify/multipart'; //Pour le request.files.
import { installPackage, checkPackageInstalled, getPackages, uninstallPackage, uninstallMuliplePackages } from '../../adb/package';

module.exports = async function (app : FastifyInstance) {

/*
    Télécharge un paquet du front-end,
    Installe le paquet sur les machines
    Supprime les fichier paquet sur le serveur
*/
    app.get('/installpackage', async function (request : FastifyRequest, reply : FastifyReply) {
        const packageapk = (request.files as any).package
        
        if(packageapk == undefined || packageapk == null){
            reply.status(415).send("Erreur : paquet introuvable.");
        } else if(packageapk.minetype == 'application/vnd.android.package-archive') {
            reply.status(415).send("Mauvais type de fichier (Type attendu APK).");
        }

        const {extras} = JSON.parse(request.body as any);
        const devices = extras.deviceList;
        const timeout = extras.timeout;

        //Sauvegarde le fichier 
        packageapk.mv(packageapk.name, function(error: any, response: any){
            if(error){
                reply.status(415).send("Erreur : Sauvegarde échouée.")
            } else {
                const res = installPackage(devices, packageapk.name, timeout);
                reply.send(JSON.stringify(res));
                //Suppression du fichier
                fs.rm(packageapk.name, () => {});
            }
        });
    });

//Recherche si le paquet est installé. 
    app.get('/checkpackageinstalled', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList, packageName} = request.body as any;
        const res = {};

        for(var i in deviceList){
            // @ts-ignore
            res[deviceList[i]] = checkPackageInstalled(deviceList[i], packageName);
        }

        reply.send(JSON.stringify(res));
    });

//Rercherche les paquets installé sur la machine
    app.get('/installedpackages', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        const res = getPackages(deviceList);

        reply.send(JSON.stringify(res));
    });

//Désintaller un paquet
    app.get('/uninstallpackage', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList, packageName} = request.body as any;
        const res = uninstallPackage(deviceList, packageName);

        reply.send(JSON.stringify(res));
    });

//Désinstaller plusieurs paquets.
    app.get('/uninstallpackage', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList, packageList} = request.body as any;
        const res = uninstallMuliplePackages(deviceList, packageList);

        reply.send(JSON.stringify(res));
    });

//Nettoie les machines. 
    app.get('/devicesname', async function (request : FastifyRequest, reply : FastifyReply) {
        const {deviceList} = request.body as any;
        let res = {}; 
        const packages = getPackages(deviceList);

        for(var i in deviceList){

            // @ts-ignore
            res[deviceList[i]] = uninstallMuliplePackages(deviceList, packages);
        }

        reply.send(JSON.stringify(res));
    });
    
}