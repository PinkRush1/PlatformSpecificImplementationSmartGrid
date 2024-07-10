import { Injectable } from '@angular/core';
import { interval } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import {ElectricityDataService} from "./electricityDataService";


@Injectable({
  providedIn: 'root'
})
export class ElectricitySimulationService {

  constructor(private electricityDataService: ElectricityDataService) { }

  startSimulation() {
    console.log("test");
    console.log(new Date().getTime() * 1000000);
    interval(1000*60)  // 15 minutes interval
      .pipe(
        switchMap(() => {
          console.log("Start");

          const simulatedConsumption = this.generateRandomConsumption();
          return this.electricityDataService.saveElectricityData(simulatedConsumption);
        })
      )
      .subscribe(
        () => console.log('Electricity data saved to InfluxDB.'),
        error => console.error('Error saving electricity data:', error)
      );
  }

  private generateRandomConsumption(): number {
    // Simulate random consumption between 0.0 and 1.0
    const nowUtc = new Date();
    const now = new Date(nowUtc.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));
    const hour = now.getHours();

    let minConsumption = 0;
    let maxConsumption = 0.4;

    if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 20)) {
      minConsumption = 0.4;
      maxConsumption = 1.0;
    }

    return Math.random() * (maxConsumption - minConsumption) + minConsumption;
  }

  starInitialSmartMeterData() {
    console.log("initial");
    // Get the current time in UTC
    const nowUtc = new Date();

    // Get the Berlin time using the 'Europe/Berlin' timezone
    const berlinTime = new Date(nowUtc.toLocaleString('en-US', { timeZone: 'Europe/Berlin' }));

    // Calculate 2 hours earlier
    var twoHoursEarlier = new Date(berlinTime.getTime() - (5 * 60 * 60 * 1000)); // Subtract 2 hours in milliseconds



    while (twoHoursEarlier <= berlinTime) {
      let minConsumption = 0;
      let maxConsumption = 0.4;
      const hour = twoHoursEarlier.getHours();
      if ((hour >= 7 && hour < 9) || (hour >= 18 && hour < 20)) {
        minConsumption = 0.4;
        maxConsumption = 1.0;
      }

      Math.random() * (maxConsumption - minConsumption) + minConsumption;
      const simulatedConsumption = this.generateRandomConsumption();
      this.electricityDataService.saveElectricityDataInitial(simulatedConsumption, twoHoursEarlier);
      console.log("Earlier:"+ twoHoursEarlier);
      twoHoursEarlier=new Date(twoHoursEarlier.getTime() + (15 * 60 * 1000));

    }

  }


}
