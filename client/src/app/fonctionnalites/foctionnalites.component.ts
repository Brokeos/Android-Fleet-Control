import { Component, Input, OnInit, Output,EventEmitter, ViewChild } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { saveAs } from 'file-saver';
import { TopbarInfoComponent } from './../topbar-info/topbar-info.component';

@Component({
  selector: 'app-foctionnalites',
  templateUrl: './foctionnalites.component.html',
  styleUrls: ['./foctionnalites.component.css']
})
export class FoctionnalitesComponent implements OnInit {

  
  title = 'FleetControl';
  url = "http://localhost:4201/api/devices";

  successMSG:string = ""
  errorMSG:string = ""
  isOk:boolean = false
  @ViewChild(TopbarInfoComponent, {static : true})topbar_info: TopbarInfoComponent;
  httpOptions = {
    headers: new HttpHeaders({"Content-Type": "text/plain"})
  }

  @Input() devices: string[] = [];
  @Input() batteryLevels: number[] = [];
  @Input() devicesListSelection: string[] = [];
  @Input() deviceNames: string[] = [];

  @Output() refresh = new EventEmitter<string>();


  output: string[]=[];
  shellcmd : string = "";
  adbcmd: string = "";


  packageFormData = new FormData(); //used to transfer an apk to be installed
  timeoutSeconds: number = 10;
  timeoutTooltip: string = "Si la version de l'application n'est pas la bonne pour l'appareil, cela peut faire planter le serveur.\nIci vous pouvez définir\
 un temps après laquel le serveur va présumer que la version n'est pas la bonne et vous redonner la main.\nAttention: ce temps s'applique pour\
 chaque appareil selectionné, donc il serait bien de tester sur un seul appareil d'abord."

  packageSearch: string = ""; //search term for uninstalling packages
  allPackages: string[] = []; //list of all packages that appear on at least one selected device
  packagesToDisplay: string[] = []; //list of packages to display in the uninstall modal
  packagesToUninstall: string[] = [];

  fileFormData = new FormData(); //used to push files
  fileToDelete: string = "";
  fileToPull: string = "";

  wifissid: string = "";
  wifiusername: string = "";
  wifiPasswordType: string = "WPA";
  wifipassword: string = "";
  wifiUsername: string = "";

  recordTime: number = 5;
  
  constructor(private http: HttpClient) {
  }
  
  ngOnInit(): void {
  }
  
  /*
    PushFile (Button annuler)
  */
  nonDisplayAlertPushFile(){
      document.getElementById('alertSuccesspush').style.display="none";
      document.getElementById('alertFailedpush').style.display="none";
      var inputfile = document.getElementById("filePush") as HTMLInputElement; 
      inputfile.value="";
  }

  /*
    Alert PullFile (Button annuler)
  */
    nonDisplayAlertPullFile(){
      document.getElementById('alertSuccesspull').style.display="none";
      document.getElementById('alertFailedpull').style.display="none";
      var inputfile = document.getElementById("filePull") as HTMLInputElement; 
      inputfile.value="";
  }
  
 /*
    Alert DeleteFile (Button annuler)
  */
    nonDisplayAlertDeleteFile(){
      document.getElementById('alertSuccessdelete').style.display="none";
      document.getElementById('alertFaileddelete').style.display="none";
      var inputfile = document.getElementById("filedelete") as HTMLInputElement; 
      inputfile.value="";
  }

   /*
    Alert Install package (Button annuler)
  */
    nonDisplayAlertInstall(){
      document.getElementById('alertSuccessinstall').style.display="none";
      document.getElementById('alertFailedinstall').style.display="none";
      var inputfile = document.getElementById("install") as HTMLInputElement; 
      inputfile.value="";
  }

  /*
    Alert Uninstall package (Button annuler)
  */
    nonDisplayAlertUnInstall(){
      document.getElementById('alertSuccessuninstall').style.display="none";
      document.getElementById('alertFaileduninstall').style.display="none";
      var inputfile = document.getElementById("uninstall") as HTMLInputElement; 
      inputfile.value="";
  }


  /*
    Alert add wifi (Button annuler)
  */
    nonDisplayAlertAjoutwifi(){
      document.getElementById('alertSuccessajoutwifi').style.display="none";
      document.getElementById('alertFailedajoutwifi').style.display="none";
      var ssid = document.getElementById("ssid") as HTMLInputElement; 
      ssid.value="";
      var mdp = document.getElementById("mdp") as HTMLInputElement; 
      mdp.value="";
  }


    /*
    Alert nettoyer
  */
    nonDisplayAlertClean(){
      document.getElementById('alertSuccessclean').style.display="none";
      document.getElementById('alertFailedclean').style.display="none";
  }
  /*
    Callback used to display any errors when a request doesn't work
  */
  displayError(error: Error) {
    console.error(error.message); 
  }


  /*
    Convert {a: 10, b: 20, c: 30} to [a: 10, b: 20, c: 30]
  */
  objectToArray(object: Object){

    var array = [];

    for(var i in object){
      array[i] = object[i];
    }
    return array;
  }

  
  /*
    Converts a 64bit data string into a blob used to download files
  */
  base64ToBlob(b64Data: string, contentType='', sliceSize=512) {
    b64Data = b64Data.replace(/\s/g, ''); //IE compatibility...
    let byteCharacters = atob(b64Data);
    let byteArrays = [];
    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
        let slice = byteCharacters.slice(offset, offset + sliceSize);

        let byteNumbers = new Array(slice.length);
        for (var i = 0; i < slice.length; i++) {
            byteNumbers[i] = slice.charCodeAt(i);
        }
        let byteArray = new Uint8Array(byteNumbers);
        byteArrays.push(byteArray);
    }
    return new Blob(byteArrays, {type: contentType});
  }
  
  
  /*
    Download a file from a filename + data
  */
  downloadFile(filename: string, b64encodedString: string) {
    if (b64encodedString) {
      var blob = this.base64ToBlob(b64encodedString, 'text/plain');
      saveAs(blob, filename);
    }
  }


  downloadCommandOutput(filename, text) {
    var element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
  
    element.style.display = 'none';
    document.body.appendChild(element);
  
    element.click();
  
    document.body.removeChild(element);
  }


  /*
    Send an adb shell command to selected devices
  */
  shellCommand(devices: string[], cmd: string){
    if(cmd != "") {
      this.http.post<any>(this.url+'/shellcmd', {deviceList: devices, cmd: cmd}).subscribe(
        (response) => {
          console.log(response);
          this.output=JSON.stringify(response).split(',');
          this.downloadCommandOutput("sortie_Shell_commande.txt", this.output);
          this.successMSG = "La commande a été exécutée !"
          this.isOk = true;
          this.topbar_info.printInfo(this.successMSG, this.isOk);
  
        },
        (error) => { this.displayError(error)
          this.errorMSG = "La commande n'a pas été exécutée ! Erreur : " + error.message + ".";
          this.isOk = false;
          this.topbar_info.printInfo(this.errorMSG, this.isOk);
        });
    } else {
        this.errorMSG = "La commande ne doit pas être vide !";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
    }
  }


  /*
    Send an adb command to selected devices
  */
  adbCommand(devices: string[], cmd: string){

    if(cmd != ""){
      this.http.post<any>(this.url+'/adbcmd', {deviceList: devices, cmd: cmd}).subscribe(
        (response) => {
          console.log(response);
          this.output=JSON.stringify(response).split(',');
          this.downloadCommandOutput("sortie_ADB_commande.txt", this.output);
          this.successMSG = "La commande a été exécutée !"
          this.isOk = true;
          this.topbar_info.printInfo(this.successMSG, this.isOk);
  
        },
        (error) => { this.displayError(error)
          this.errorMSG = "La commande n'a pas été exécutée ! Erreur : " + error.message + ".";
          this.isOk = false;
          this.topbar_info.printInfo(this.errorMSG, this.isOk);
        });
    } else {
      this.errorMSG = "La commande ne doit pas être vide !";
      this.isOk = false;
      this.topbar_info.printInfo(this.errorMSG, this.isOk);
    }
    
  }
  
  
  /*
    Adds the apk (to be installed) to the package form data to be sent later
  */
  handlePackage(target) {
    var files = target.files;
    this.packageFormData.delete('package');
    this.packageFormData.append('package', files[0]);
  }
  /*
    Sends the apk to the server to be installed
  */
  installPackage(devices: string[], timeout: number){

    this.packageFormData.delete('extras');
    this.packageFormData.append('extras', JSON.stringify({deviceList: devices, timeout: timeout})); //formData can't accept array or numbers, must be stringified and parsed at other end


    return this.http.post<any>(this.url+'/installpackage', this.packageFormData).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Package installé avec succès !";
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
        var inputfile = document.getElementById("install") as HTMLInputElement; 
        inputfile.value="";
      },
      (error) => { 
        this.displayError(error);
        this.errorMSG = "Attention votre package n'a pas été installé ! Erreur : " + error.message + ".";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }


  /*
    Check if a package (com.example.appname) is installed on selected devices
  */
  checkPackageInstalled(devices: string[], packageName: string){
    this.http.post<any>(this.url+'/checkpackageinstalled', {deviceList: devices, packageName: packageName}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Recherche de paquet exécuté avec succés !";
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { this.displayError(error)
        this.errorMSG = "Recherche de paquet non exécuté ! Erreur : " + error.message + "." ;
        this.isOk = true;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }
  

  /*
    Get all packages that are installed on each device
  */
  getInstalledPackages(devices: string[]){
    this.http.post<any[]>(this.url+'/installedpackages', {deviceList: devices}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Recherche de tous les paquets exécuté avec succés !";
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { this.displayError(error)
        this.errorMSG = "Recherche de tous les paquets non exécuté ! Erreur : " + error.message + "." ;
        this.isOk = true;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }

  
  /*
    Updates allPackages: a list of all the packages installed on at least one selected device
  */
  getAllPackages(devices: string[]){
    this.http.post<any[]>(this.url+'/installedpackages', {deviceList: devices}).subscribe(
      (response) => {
        console.log(response);

        this.allPackages = [];
        this.packagesToDisplay = [];
        
        for (var device in response){
          for (var packageName in response[device]){
            //console.log(response[device][packageName]);
            if(!this.allPackages.includes(response[device][packageName])){
              this.allPackages.push(response[device][packageName]);
              this.allPackages = [...this.allPackages];
              this.updatePackagesToDisplay(this.allPackages, this.packageSearch)
            }
          }
        }
      },
      (error) => { this.displayError(error)});
  }


  /*
    Update packagesToDisplay: the list that is displayed in the uninstall modal
  */
  updatePackagesToDisplay(allPackages: string[], searchTerm: string){

    this.packagesToDisplay = [];

    for(var i in allPackages){
      if(allPackages[i].includes(searchTerm)){
        this.packagesToDisplay.push(allPackages[i]);
        this.packagesToDisplay = [...this.packagesToDisplay];
      }
    }
  }


  /*
    Adds or removes a package to be uninstalled
  */
  togglePackageToBeUninstalled(packageName: string, event){

    var toggle = event.target.checked

    if(toggle){
      this.packagesToUninstall.push(packageName);
    }
    else{
      this.packagesToUninstall.splice(this.packagesToUninstall.indexOf(packageName), 1);
    }
  }


  /*
    Uninstall one package on all selected devices
  */
  uninstallPackage(devices: string[], packageName: string){
    this.http.post<any>(this.url+'/uninstallpackage', {deviceList: devices, packageName: packageName}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Désinstallation du package exécuté avec succés !";
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { this.displayError(error)
        this.errorMSG = "Désinstallation du package exécuté avec ERREUR ! Erreur : " + error.message;
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }


  /*
    Uninstall multiple packages on all selected devices
  */
  uninstallMultiplePackages(devices: string[], packageList: string[]){
    this.http.post<any>(this.url+'/uninstallmuliplepackages', {deviceList: devices, packageList: packageList}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Désinstallation des packages exécuté avec succés !";
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
        var inputfile = document.getElementById("uninstall") as HTMLInputElement; 
        inputfile.value="";

      },
      (error) => { 
        this.displayError(error);
        this.errorMSG = "Désinstallation des packages exécuté avec ERREUR ! Erreur : " + error.message;
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });

    this.packagesToUninstall = [];
  }
  
  
  /*
    Adds the file (to be pushed) to the file form data to be sent later
  */
  handleFile(target) {
    var files = target.files;
    this.fileFormData.delete('file');
    this.fileFormData.append('file', files[0]);
  }
  /*
    Sends the file to the server
  */
  pushFile(devices: string[]){
    this.fileFormData.delete('deviceList');
    this.fileFormData.append('deviceList', JSON.stringify(devices)); //formData can't accept array, must be stringified and parsed at other end
     console.log(this.fileFormData.get("file"));
    return this.http.post<any>(this.url+'/pushfile', this.fileFormData.get("file"), this.httpOptions).subscribe(
      (response) => {
        console.log(response)
        this.successMSG = "Fichier envoyé avec succès !"
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { this.displayError(error)  
        this.errorMSG = "Attention votre fichier n'a pas été envoyé ! Erreur : " + error.message + ".";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);   
      });
  }
  
  
  /*

  */
  deleteFile(devices: string[], filePath: string){

    if(filePath != ""){
      this.http.post<any>(this.url+'/deletefile', {deviceList: devices, filePath: filePath}).subscribe(
        (response) => {
          console.log(response);
          this.successMSG = "Fichier supprimé avec succès !"
          this.isOk = true;
          this.topbar_info.printInfo(this.successMSG, this.isOk);
        },
        (error) => { 
          this.displayError(error);
          this.errorMSG = "Attention votre fichier n'a pas été supprimé ! Erreur : " + error.message + ".";
          this.isOk = false;
          this.topbar_info.printInfo(this.errorMSG, this.isOk);   
        });
    } else {
        this.errorMSG = "Attention votre fichier n'a pas été téléchargé ! Erreur : Chemin du fichier vide.";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
    }
  }
  
  
  /*
    Get array with shape [filename1 : 64bit_data1, filename2, 64bit_data2, ...]
    for each file, save file.
    Tested for upto 15Mo so far...
  */
  pullFile(devices: string[], filePath: string){

    if(filePath != ""){
      this.http.post<any>(this.url+'/pullfile', {deviceList: devices, filePath: filePath}).subscribe(
        (response) => {
          console.log(response);
          this.successMSG = "Fichier téléchargé avec succès !"
          this.isOk = true;
          this.topbar_info.printInfo(this.successMSG, this.isOk);
          for(var i in response){
            if(response[i].success == true){
              this.downloadFile(response[i].filename, response[i].data);
            }
            else{
              console.log(response[i].error);
            }
          }
        },
        (error) => { 
          this.displayError(error);
          this.errorMSG = "Attention votre fichier n'a pas été téléchargé ! Erreur : " + error.message + ".";
          this.isOk = false;
          this.topbar_info.printInfo(this.errorMSG, this.isOk);
        });
    } else {
        this.errorMSG = "Attention votre fichier n'a pas été téléchargé ! Erreur : Chemin du fichier vide.";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
    }
  }
  
  
  /*
    
  */
  addWifi(devices: string[], ssid: string, password: string, passwordType: string, username: string){

    //var passwordType = "WPA"; //WPA/WEP/none (if none password will not be taken into account)

    this.http.post<any>(this.url+'/addwifi', {deviceList: devices, ssid: ssid, passwordType: passwordType, password: password, username: username}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Le Wi-Fi a été ajouté avec succès !"
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);

        this.refresh.emit("");
      },
      (error) => { 
        this.displayError(error);
        this.errorMSG = "Attention le Wi-Fi n'a pas été ajouté ! Erreur : " + error.message + ".";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }


  /*

  */
  disableWifi(devices: string[]){
    this.http.post<any>(this.url+'/disablewifi', {deviceList: devices, toggle: false}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Le Wi-Fi a bien été désactivé avec succès !"
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { this.displayError(error)
        this.errorMSG = "Attention le Wi-Fi n'a pas été désactivé ! Erreur : " + error.message + ".";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
      
  }
  
  
  /*

  */
  enableWifi(devices: string[]){
    this.http.post<any>(this.url+'/enablewifi', {deviceList: devices, toggle: true}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Le Wi-Fi a bien été activé avec succès !"
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { this.displayError(error)
        this.errorMSG = "Attention le Wi-Fi n'a pas été activé ! Erreur : " + error.message + ".";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }


    /*

  */
  forgetAllWifi(devices: string[]){
    this.http.post<any>(this.url+'/forgetallwifi', {deviceList: devices}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Les connexion Wi-Fi ont bien été oubliés !"
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { this.displayError(error)
        this.errorMSG = "Attention les connexion Wi-Fi n'ont pas été oubliés ! Erreur : " + error.message + ".";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }

  /*
  Record the screen of selected devices for n seconds then download the files
*/
recordScreen(devices: string[], seconds: number){
  this.http.post<any>(this.url+'/recordscreen', {deviceList: devices, seconds: seconds}).subscribe(
    (response) => {
      console.log(response);

      var files = this.objectToArray(response);

      for(var i in files){
        this.downloadFile(i, files[i]);
      }
      this.successMSG = "La capture c'est bien passé !"
      this.isOk = true;
      this.topbar_info.printInfo(this.successMSG, this.isOk);
    },
    (error) => { this.displayError(error)
      this.errorMSG = "Attention la capture ne c'est pas bien passé ! Erreur : " + error.message + ".";
      this.isOk = false;
      this.topbar_info.printInfo(this.errorMSG, this.isOk);
    });
  }


  /*
    Get a screen capture of selected devices and download then download the files
  */
  screenCapture(devices: string[]){

    this.http.post<any>(this.url+'/screencapture', {deviceList: devices}).subscribe(
      (response) => {
        console.log(response);

        var files = this.objectToArray(response);

        for(var i in files){
          this.downloadFile(i, files[i]);
        }
        this.successMSG = "La capture d'écran s'est bien passé !"
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { this.displayError(error)
        this.errorMSG = "Attention la capture d'écran ne s'est pas bien passé ! Erreur : " + error.message + ".";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }


  /*
    Nettoyer
  */
  cleanDevices(devices: string[]){
    this.http.post<any>(this.url+'/clean', {deviceList: devices}).subscribe(
      (response) => {
        console.log(response);
        this.successMSG = "Les applications non système des appareils sont supprimées avec succès!"
        this.isOk = true;
        this.topbar_info.printInfo(this.successMSG, this.isOk);
      },
      (error) => { 
        this.displayError(error);
        this.errorMSG = "Attention une erreur est survenue lors de la suppression ! Erreur : " + error.message + ".";
        this.isOk = false;
        this.topbar_info.printInfo(this.errorMSG, this.isOk);
      });
  }

}
  
