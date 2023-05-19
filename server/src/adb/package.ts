import child_process, {execSync} from 'child_process';
import { echapSpaces, getDevices } from './utils';
import { getLogger } from './logger';

var logger = getLogger();

export function installPackage(devices: any, packageName: any, timout: any){

    packageName = echapSpaces(packageName);

    logger.log("info", "Installing " + packageName + " on the following devices: " + devices);

    var output: { [key: string]: any } = {};

    for (const device of devices) {
        if (getDevices().includes(device)) {

             try {
                output[device] = execSync(`adb -s ${device} install -r -t ${packageName}`);
             } catch (error) {
                 logger.log("error", "Une erreur est survennue lors de l'installation du "+ packageName+" sur "+device);
             }

        } else {
            output[device] = device + " is not connected";
        }
    }

    return output;
};

export function checkPackageInstalled(device: any, packageName: string){
    const packagesList = execSync(`adb -s ${device} shell pm list packages`).toString();
    logger.log("info", "le package "+packageName+ (packagesList.includes(`package:${packageName}`)) ? "existe sur "+device : "n'existe pas sur "+device  );
    return  packagesList.includes(`package:${packageName}`);
};

export function getPackages(devices: any){

      let packagesByDevice: { [key: string]: any } = {};
      for (const device of devices) {
        const packagesOutput = execSync(`adb -s ${device} shell pm list packages -3`).toString();
        const packages = packagesOutput
          .split("\n")
          .filter((line: string) => line.startsWith("package:"))
          .map((line: string) => line.slice(8));
        packagesByDevice[device] = packages;
      }
      return packagesByDevice;
};

export function uninstallPackage(devices: any, packageName: any){

    let output: { [key: string]: string } = {};
    for (const device of devices) {
          try {
              execSync(`adb -s ${device} uninstall ${packageName}`);
              output[device] = "SUCCES";
              logger.log("info", "le package "+packageName+" a été désinstaller de l'appareil "+device);
          } catch (error) {
            output[device] = "ERROR:"+` package inconnu sur ${device}`;
            logger.log("info", "le package "+packageName+"est inconnu de l'appareil "+device);
          }
    }

    return output;

};

export function uninstallMuliplePackages(devices: any, packageList: any){

    let output: { [key: string]: any } = {};
    for (const pack of packageList) {
        output[pack] = uninstallPackage(devices, pack);
    }
    return output;
}