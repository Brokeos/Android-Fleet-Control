import child_process from 'child_process';
import { shellCmd,syncDelay } from './utils';
import { checkPackageInstalled, installPackage } from './package';
import { getLogger } from './logger';
import path from 'path';


const wifiManagerPackage = "com.steinwurf.adbjoinwifi";
const wifiManagerPackagePath = path.resolve(__dirname, '../../wifiManager') +"/"+"wifiManager.apk";
var logger = getLogger();

export function addWifiNetwork(devices: any, ssid: any, passwordType: any, password: any, username: any){
    if (passwordType == "") {
        passwordType = "none"
    }

    let output: { [key: string]: any } = {};

    for (const device of devices) {
        checkWifiManagerInstalled(device); //make sure wifi manager is installed
        try {
            if (passwordType != "none" && passwordType != "EAP") {
                shellCmd(device, ["am", "start", "-n", "com.steinwurf.adbjoinwifi/.MainActivity", "-e", "ssid", ssid, "-e", "password_type", passwordType, "-e", "password", password]);
                output[device] = { status : "SUCCESS", msg : `Le réseau wifi ${ssid} a été ajouté`};
            } else if (passwordType == "EAP") {
                shellCmd(device, ["am", "start", "-n", "com.steinwurf.adbjoinwifi/.MainActivity", "-e", "ssid", ssid, "-e", "password_type", "EAP", "-e", "password", password, "-e", "username", username]);
                output[device] = { status : "SUCCESS", msg : `Le réseau wifi ${ssid} a été ajouté`};
            } else {
                shellCmd(device, ["am", "start", "-n", "com.steinwurf.adbjoinwifi/.MainActivity", "-e", "ssid", ssid]);
                output[device] = { status : "SUCCESS", msg : `Le réseau wifi ${ssid} a été ajouté`};
            }
             logger.log("info", device+`: Le réseau wifi ${ssid} a été ajouté`);
        } catch (e) {
            output[device] = { status : "ERROR", msg : e };
            logger.log("error", device+": "+e);
        }
    }
    syncDelay(3 * 1000);
    return output;
};

function checkWifiManagerInstalled(device: any) {
    if (!checkPackageInstalled(device, wifiManagerPackage)) {
        installPackage([device], wifiManagerPackagePath.replace("dist/",''),10);
    }
}

export function checkWifiNetwork(devices: any){

    let output: { [key: string]: string } = {};

    for (const device of devices) {
        let temp: string[] = shellCmd(device, ["dumpsys", "connectivity"]).split("\n");
        let wifiConnections = [];

        for (var line of temp) {
            line = line.trim();

            if (line.startsWith("NetworkAgentInfo")) {
                let res = line.split(", ");

                for (var element in res) {
                    if (res[element].startsWith("extra")) {
                        res[element] = res[element].slice(8);
                        wifiConnections.push(res[element].substring(0, res[element].length - 1));
                        break;
                    }
                }
            }
        }

        //add any connection that is not "none" to output (unless there isn't one, in which case add "none")
        output[device] = "none";
        console.log(device+" = "+wifiConnections);
        for (var connection in wifiConnections) {
            if (wifiConnections[connection] != "none") {
                output[device] = wifiConnections[connection];
                break;
            }
        }
        logger.log("info", device+": nom du réseau wifi: "+output[device]);

    }

    return output;
};

export function toggleWifi(devices: any, bool: boolean){

    let output: { [key: string]: string } = {};

    for (const device of devices) {
        if (bool) {
            output[device] = shellCmd(device, ["svc", "wifi", "enable"]);
        } else {
            output[device] = shellCmd(device, ["svc", "wifi", "disable"]);
        }
        syncDelay(3 * 1000);
        logger.log("info", device+": résultat de "+(bool ? "l'activation ":"la désactivation ")+" du wifi: "+checkWifiEnabled(devices)[device].status);
    }
    syncDelay(3 * 1000);
    return checkWifiEnabled(devices);
};

function checkWifiEnabled(devices: any) {

    let output: { [key: string]: any } = {};

    for (const device of devices) {
        try{
            var res: string = shellCmd(device, ["dumpsys", "wifi"]);
            let temp: string[] = res.split("\n");

            output[device] = (temp[0] == "Wi-Fi is enabled") ? { status : "SUCCESS", msg : "le wifi est activé " } : { status : "SUCCESS", msg : "le wifi n'est pas activé " };
            logger.log("info", device+": Wifi activé ? "+(temp[0] == "Wi-Fi is enabled"));
        }
        catch(error){
            output[device] = { status : "ERROR", msg : error };
            logger.log("error", "une erreur est survenue "+error);
        }

    }
    return output;
}

export function forgetWifi(devices: any){

    return null;
};

