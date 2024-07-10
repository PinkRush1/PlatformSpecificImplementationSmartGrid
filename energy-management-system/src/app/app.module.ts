import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import {ElectricityDataService} from "./service/electricityDataService";
// Import the date adapter for Chart.js
import 'chartjs-adapter-date-fns';

@NgModule({
  declarations: [
    AppComponent,
    DashboardComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule  // Ensure HttpClientModule is imported here
  ],
  providers: [ElectricityDataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
