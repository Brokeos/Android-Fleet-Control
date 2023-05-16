import child_process, {execSync} from 'child_process';
import { echapSpaces, getDevices } from './utils';

export function installPackage(devices: any, packageName: any, timout: any){

    packageName = echapSpaces(packageName);

    console.log("Installing " + packageName + " on the following devices: " + devices);

    var output: { [key: string]: any } = {};

    for (const device of devices) {
        if (getDevices().includes(device)) {

            const adbProcess = child_process.spawnSync('adb', ["-s", device, "install","-r -t", packageName], { timeout: timout });
            output[device] = adbProcess.stdout.toString();

        } else {
            output[device] = device + " is not connected";
        }
    }
    return output;
}; //a tester avec front

export function checkPackageInstalled(device: any, packageName: string){
    const packagesList = execSync(`adb -s ${device} shell pm list packages`).toString();
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
          } catch (error) {
            output[device] = "ERROR:"+` package inconnu sur ${device}`;
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