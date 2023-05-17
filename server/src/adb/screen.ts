import { pullFiles, deleteFile } from './file';
import { shellCmd, syncDelay } from './utils';
import { getLogger } from './logger';

var logger = getLogger();


export function recordScreen(device: any, seconds: any){
    /* Important ! 
    if (passwordType == "") {
        passwordType = "none"
    }
    */

    let timestamp = Date.now();

    let filename = "recording_" + timestamp.toString() + ".mp4"; //define name of file as recording_timestamp.mp4
    shellCmd(device, ["screenrecord", "/sdcard/" + filename, "--time-limit=" + seconds.toString()]); //perform recording
    syncDelay((seconds + 1) * 1000); //wait for recording to be finished
    pullFiles([device], "/sdcard/" + filename); //pull video file
    deleteFile([device], "/sdcard/" + filename); //delete video file on device
    logger.log("info", "Enregistrement de l'écran de "+device+": "+device + "_" + filename);
    return device + "_" + filename; //new filename
};

export function screenCap(device: any){

    let timestamp = Date.now();

    let filename = "screencap_" + timestamp.toString() + ".png"; //define name of file as screepcap_timestamp.png
    shellCmd(device, ["screencap", "/sdcard/" + filename]); //perform screenshot
    syncDelay(3 * 1000); //wait for image to be saved
    pullFiles([device], "/sdcard/" + filename) //pull image file
    deleteFile([device], "/sdcard/" + filename); //delete image file on device

    logger.log("info", "capture d'écran de "+device+": "+device + "_" + filename);
    return device + "_" + filename;
};


