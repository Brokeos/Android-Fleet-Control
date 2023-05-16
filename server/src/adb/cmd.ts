import child_process from 'child_process';
import { shellCmd, adbCmd } from './utils';



export function groupShellCmd(devices: any, cmd: any){

    var output: any[] = [];

    for (const device in devices) {
        let temp = shellCmd(device, cmd);
        output.push(temp);
    }

    return output;
};

export function groupAdbCmd(devices: any, cmd: any){

    var output: any[] = [];

    for (const device in devices) {
        let temp = adbCmd(device, cmd)
        output.push(temp);
    }

    console.log(output);

    return output;

};


