import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { TabletteComponent } from './tablette/tablette.component';
import { FoctionnalitesComponent } from './fonctionnalites/foctionnalites.component';
import { HeaderComponent } from './header/header.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { SidebarInfoComponent } from './sidebar-info/sidebar-info.component';
import { TopbarInfoComponent } from './topbar-info/topbar-info.component';


@NgModule({
  declarations: [
    AppComponent,
    TabletteComponent,
    FoctionnalitesComponent,
    HeaderComponent,
    SidebarInfoComponent,
    TopbarInfoComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    FontAwesomeModule,
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
