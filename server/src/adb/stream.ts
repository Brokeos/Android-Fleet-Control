import { pushFiles } from './file';
import { shellCmd, adbCmd } from './utils';
import { getLogger } from './logger';
import net from 'net';
import path from 'path';

var logger = getLogger();

const scrcpyServerPath = path.resolve(__dirname, '../../scrcpy') +"/"+"scrcpy-server-v2.0";

function uploadScrcpyServer(device : any){
    pushFiles([device], scrcpyServerPath, "/data/local/tmp/scrcpy-server.jar");
}

function createReverseTcp(device : any){
    adbCmd(device, "reverse localabstract:scrcpy tcp:27183");
}

export function startScrcpy(device : any){
    createReverseTcp(device);
    uploadScrcpyServer(device);

    let server = net.createServer(function(socket) {
        socket.on('data', function(data) {
            logger.log("info", "Scrcpy : "+data.toString());
            //Ouvrir un WS et envoyer tout vers le client
        });
    });
    server.listen(27183, '127.0.0.1');

    shellCmd(device, ["CLASSPATH=/data/local/tmp/scrcpy-server.jar", "app_process", "/", "com.genymobile.scrcpy.Server", "2.0", "max_size=1024", "audio=false", "video_codec=h264", "stay_awake=true"]);
    logger.log("info", "Scrcpy démarré sur "+device);
}