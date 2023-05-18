import { Component, Input, OnInit } from '@angular/core';


@Component({
  selector: 'app-topbar-info',
  templateUrl: './topbar-info.component.html',
  styleUrls: ['./topbar-info.component.css']
})
export class TopbarInfoComponent implements OnInit {

  successErrorMSG = "";
  isOk = false;
  
  constructor() { }

  ngOnInit(): void {
  }

  printInfo(msg: string, ok:boolean){
    this.isOk = ok;
    this.successErrorMSG = msg;

    console.log("Success : " + this.successErrorMSG + " bool :" + this.isOk)
    if(this.isOk && this.successErrorMSG != ""){
      document.getElementById('alertSuccess').style.display="block";
      document.getElementById('alertError').style.display="none";

    } else if (!this.isOk && this.successErrorMSG != ""){
      document.getElementById('alertSuccess').style.display="none";
      document.getElementById('alertError').style.display="block";

    }
  }

}
