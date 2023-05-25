import child_process from 'child_process';
import { getLogger } from './logger';

var logger = getLogger();


export function getDevices(){

    const adbProccess = child_process.spawnSync('adb', ["devices"]);

    let output = adbProccess.stdout.toString().split("\n");

    //remove the first few lines of the command output
    output.splice(0, 1);

    let devices: string[] = [];

    //retreive just the device ids
    for (var i in output) {
        if (output[i] != "") {
            devices.push(output[i].split("\t")[0]);
        }
    }
    return devices;
    
};

export function getBatteryLevel(devices: any[]){

    let output: { [key: string]: number } = {};

    for (const device of devices) {
        var temp = shellCmd(device, ["dumpsys", "battery"]);
        let res: string[] = temp.split("\n");

        var level: number = 0;

        for (var j in res) {
            res[j] = res[j].trim();
            if (res[j].startsWith("level")) {
                level = parseInt(res[j].substring(7));
                break;
            }
        }
        output[device] = level;
    }
    return output;

};

export function getDevicesName(devices: any){

    let output: { [key: string]: string } = {};

    for (const device of devices) {
        var temp = shellCmd(device, ["dumpsys", "bluetooth_manager"]);
        let res: string[] = temp.split("\n");

        var name: string = "";

        for (var j in res) {
            res[j] = res[j].trim();
            if (res[j].startsWith("name")) {
                name = res[j].substring(6);
                break;
            }
        }

        output[device] = name;
    }

    return output;

};

export function removeAll(source: any, searchval: any) {
    while (source.includes(searchval)) {
        var index = source.indexOf(searchval);
        if (index !== -1) {
            source = source.splice(index, 1);
        }
    }
    return source
}

export function shellCmd(device: string, cmds: string[]) {

    if (!getDevices().includes(device)) {
        logger.log("info", device + " is not connected");
        return (device + " is not connected")
    }


    //try to format commands properly / remove excess commands
    cmds = removeAll(cmds, "adb");
    cmds = removeAll(cmds, "shell");
    cmds = removeAll(cmds, "exit");

    cmds = ["-s", device, "shell"].concat(cmds)

    const adbProccess = child_process.spawnSync('adb', cmds);

    var output = adbProccess.stdout.toString();

    return adbProccess.stdout.toString();
}

export function syncDelay(milliseconds: number) {
    var start = new Date().getTime();
    var end = 0;
    while ((end - start) < milliseconds) {
        end = new Date().getTime();
    }
}

export function echapSpaces(source : any) {

    var newVal = "";

    for (let i in source) {
        if (source[i] != " ") {
            newVal += source[i];
        } else {
            newVal += "\\\ ";
        }
    }

    return newVal;
}

export function adbCmd(device: any, cmd: any) {

    if (!getDevices().includes(device)) {
        return (device + " is not connected")
    }

    //remove excess
    if (cmd.startsWith("adb")) {
        cmd = cmd.substring(4);
    }

    //target one specific device
    let args = ["-s", device].concat(cmd.split(" "))

    const adbProcess = child_process.spawnSync('adb', args);

    return adbProcess.stdout.toString();
}

export function currentDateFormat(): string {
  const date = new Date();
  const annee = date.getFullYear().toString().padStart(4, '0');
  const mois = (date.getMonth() + 1).toString().padStart(2, '0');
  const jour = date.getDate().toString().padStart(2, '0');
  const dateDuJour = `${annee}-${mois}-${jour}`;
  return dateDuJour;
}

