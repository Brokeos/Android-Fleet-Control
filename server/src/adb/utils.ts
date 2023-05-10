import child_process from 'child_process';

export function getDevices(){

    const adbProccess = child_process.spawnSync('adb', ["devices"]);

    let output = adbProccess.stdout.toString().split("\n");

    //remove the first few lines of the command output
    output.splice(0, 1);

    let devices = [];

    //retreive just the device ids
    for (var i in output) {
        if (output[i] != "") {
            devices.push(output[i].split("\t")[0])
        }
    }

    return devices;
    
};

export function getBatteryLevel(devices: any){

    return null;
};

export function getDevicesName(devices: any){

    return null;
};

