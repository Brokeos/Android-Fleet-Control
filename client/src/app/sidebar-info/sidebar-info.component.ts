import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-sidebar-info',
  templateUrl: './sidebar-info.component.html',
  styleUrls: ['./sidebar-info.component.css']
})
export class SidebarInfoComponent implements OnInit{

  url = "http://localhost:4201/api/log";
  logs!:String[]

  constructor(private http: HttpClient) { 
    this.logs = [];
    this.readLogs();
    setInterval(() => this.readLog(), 5000);
   }

  ngOnInit(): void { }
  
  readLogs(){
    this.http.get(this.url+'/getlogs', { responseType: 'text' }).subscribe((data: string) => {
      const parsedData: string[] = JSON.parse(data) as string[];
      
      parsedData.forEach((element,index) => {
        if(element=="") parsedData.splice(index,1);
      });
      this.logs = this.logs.concat(parsedData);

      //console.log(this.logs);
      
    }, (error) => {
      console.error('Erreur lors de la lecture du fichier :', error);
    });
  }

  readLog(){
    this.http.get(this.url+'/getlog', { responseType: 'text' }).subscribe((data: string) => {
      const parsedData: string[] = JSON.parse(data) as string[];
      
      parsedData.forEach((element,index) => {
        if(element=="") parsedData.splice(index,1);
      });
      this.logs = this.logs.concat(parsedData);

      //console.log(this.logs);
      
    }, (error) => {
      console.error('Erreur lors de la lecture du fichier :', error);
    });
  }
}
