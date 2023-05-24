import { execSync } from 'child_process';
import fs from 'fs';
import { getLogger } from './logger';

var logger = getLogger();

export function pushFiles(devices: any, name: any, path: String){

    let status: { [key: string]: any } = {};
    for (const device of devices) {
        try {
            execSync(`adb -s ${device} push ${name} ${path}`);
            status[device] = { status : "SUCCESS", msg : "le fichier  a été uploadé" };
          } catch (error) {
            status[device] = { status : "ERROR", msg : "le fichier  n'a pas été uploadé: "+error };
            logger.log("error", device+": problème avec l'appareil "+error  );
          }
    }

    return status;
};// à tester avec le front

export function deleteFile(devices: any, filePath:string){

    let status: { [key: string]: any } = {};
    for (const device of devices) {
        try {
            const fileExists: string = execSync(`adb -s ${device} shell ls ${filePath}`).toString().replace("\n",'');
            if(fileExists === filePath){ //le fichier existe bien sur l'appareil
                execSync(`adb -s ${device} shell rm ${filePath}`);
                status[device] = { status : "SUCCESS", msg : "le fichier  a été spprimé" };
                logger.log("info",device+`: Le fichier ${filePath} a été supprimé de l'appareil pas de l'appareil `);
            }
            else {
                status[device]  = { status : "ERROR", msg : `Le fichier ${filePath} n'existe pas sur l'appareil ${device}` };
                logger.log("warn",device+`: Le fichier ${filePath} n'existe pas sur l'appareil `);
            }
          } catch (error) {
            status[device] = { status : "ERROR", msg : `problème avec l'appareil ${error}` };
            logger.log("error", device+": problème avec l'appareil "  );
          }
    }

    return status;
};

export function pullFiles(device: any, filePath:String){

    let splitpath = filePath.split("/");
    let fileName = splitpath[splitpath.length - 1];
    let dstPath = ".";
    try {
        execSync(`adb -s ${device} pull ${filePath} ${dstPath}`);
        fs.renameSync("./" + fileName, "./" + device + "_" + fileName);
        logger.log("info", device+`:Le fichier ${filePath} a bien été télécharger` );
        return { status : "SUCCESS", msg : `Le fichier ${filePath} a bien été télécharger` };
    } catch (error) {
        logger.log("error", device+`: Le fichier ${filePath} n'a pas été télécharger` );
        return { status : "ERROR", msg : `Le fichier ${filePath} n'a pas été télécharger` };
    }

    return { status : "ERROR", msg : `Le fichier ${filePath} n'a pas été télécharger` };
};

