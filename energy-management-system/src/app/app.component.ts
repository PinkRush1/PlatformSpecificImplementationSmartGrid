import {Component, OnInit} from '@angular/core';
import {ElectricitySimulationService} from "./service/ElectricitySimulationService";
import {PriceCurveService} from "./service/priceCurveService";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
  title = 'energy-management-system';
  constructor(private electricitySimulationService: ElectricitySimulationService, private priceCurveService: PriceCurveService) {}

  ngOnInit() {
    this.priceCurveService.savePriceCurves();
    this.electricitySimulationService.starInitialSmartMeterData();
  }
}
