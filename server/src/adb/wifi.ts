import child_process from 'child_process';
import { shellCmd,syncDelay } from './utils';
import { checkPackageInstalled, installPackage } from './package';
import { getLogger } from './logger';

const wifiManagerPackage = "com.steinwurf.adbjoinwifi"
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
                output[device] = shellCmd(device, ["am", "start", "-n", "com.steinwurf.adbjoinwifi/.MainActivity", "-e", "ssid", ssid, "-e", "password_type", passwordType, "-e", "password", password]);
            } else if (passwordType == "EAP") {
                output[device] = shellCmd(device, ["am", "start", "-n", "com.steinwurf.adbjoinwifi/.MainActivity", "-e", "ssid", ssid, "-e", "password_type", "EAP", "-e", "password", password, "-e", "username", username]);
            } else {
                output[device] = shellCmd(device, ["am", "start", "-n", "com.steinwurf.adbjoinwifi/.MainActivity", "-e", "ssid", ssid]);
            }
        } catch (e) {
            output[device] = e;
            logger.log("error", device+": "+e);
        }
    }
    syncDelay(3 * 1000);
    return output;
};

function checkWifiManagerInstalled(device: any) {
    if (!checkPackageInstalled(device, wifiManagerPackage)) {
        installPackage([device], "wifiManager.apk",10);
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
        logger.log("info", device+": résultat de "+(bool ? "l'activation ":"la désactivation ")+" du wifi: "+checkWifiEnabled(devices)[device]);
    }

    syncDelay(3 * 1000);
    return checkWifiEnabled(devices);
};

function checkWifiEnabled(devices: any) {

    let output: { [key: string]: boolean } = {};

    for (const device of devices) {
        var res: string = shellCmd(device, ["dumpsys", "wifi"]);
        let temp: string[] = res.split("\n");

        output[device] = (temp[0] == "Wi-Fi is enabled");
        logger.log("info", device+": Wifi activé ? "+(temp[0] == "Wi-Fi is enabled"));
    }
    return output;
}

export function forgetWifi(devices: any){

    return null;
};

