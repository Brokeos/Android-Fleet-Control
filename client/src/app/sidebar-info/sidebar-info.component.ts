import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Observable, interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar-info',
  templateUrl: './sidebar-info.component.html',
  styleUrls: ['./sidebar-info.component.css']
})
export class SidebarInfoComponent implements OnInit{

  url = "http://localhost:4201";

  constructor(private http: HttpClient) { 
    setInterval(() => this.readFile(), 5000);
   }

  ngOnInit(): void { }
  
  readFile(){
    const url = '';
    this.http.get(url, { responseType: 'text' }).subscribe((data: string) => {
      console.log('Contenu du fichier :', data);
    }, (error) => {
      console.error('Erreur lors de la lecture du fichier :', error);
    });
  }

  getLogs(){
    this.http.post<any>(this.url+'/getLogs', {}).subscribe(
      (response) => {
        console.log(response);
      },
      (error) => { });
  }

}
