import { execSync } from 'child_process';
import fs from 'fs';

export function pushFiles(devices: any, name: any, path: String){

    let status: { [key: string]: string } = {};
    for (const device of devices) {
        try {
            execSync(`adb -s ${device} push ${name} ${path}`);
          } catch (error) {
            status[device] = "KO: problème avec l'appareil ";
          }
    }

    return status;
};// à tester avec le front

export function deleteFile(devices: any, filePath:String){

    let status: { [key: string]: string } = {};
    for (const device of devices) {
        try {
            const fileExists = execSync(`adb -s ${device} shell ls ${filePath}`).toString();
            if(fileExists == filePath){ //le fichier existe bien sur l'appareil
                execSync(`adb -s ${device} shell rm ${filePath}`);
                status[device] = "SUCCES";
            }
            else {
                console.log(`Le fichier ${filePath} n'existe pas sur l'appareil ${device}`);
                status[device] = "KO: "+`Le fichier ${filePath} n'existe pas sur l'appareil ${device}`;
            }
          } catch (error) {
            status[device] = "KO: problème avec l'appareil ";
          }
    }

    return status;
};// à tester avec le front

export function pullFiles(device: any, filePath:String){

    let splitpath = filePath.split("/");
    let fileName = splitpath[splitpath.length - 1];
    let dstPath = ".";

    try {
        execSync(`adb -s ${device} pull ${filePath} ${dstPath}`);
        fs.renameSync("./" + fileName, "./" + device + "_" + fileName);
        return true;
    } catch (error) {
        return false;
    }

    return false;
};// à tester avec le front

