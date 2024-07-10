import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import {InfluxDbClient} from "../persistance/influxDbClient";
import {ElectricityData} from "../dto/ElectricityData";
import {TariffData} from "../dto/TariffData";

class ElectricityService {
  private messageBaseUri: string;
  private influxDbClient: InfluxDbClient;

  constructor(private httpClient: HttpClient, influxDbClient: InfluxDbClient) {
    this.messageBaseUri = 'http://your.api.endpoint';
    this.influxDbClient = influxDbClient;
  }

  async getElectricityConsumptionHeatPump(): Promise<ElectricityData> {
    console.log("Fetching ElectricityData");

    try {
      // Fetch the data from the API
      const electricityDataHeatPumpObservable: Observable<ElectricityData> = this.httpClient.get<ElectricityData>(`${this.messageBaseUri}/getElectricityHeatPumpData`);

      // Convert Observable to Promise
      const electricityDataHeatPump: ElectricityData = await firstValueFrom(electricityDataHeatPumpObservable);

      // Write the data to InfluxDB
      await this.influxDbClient.writeElectricityData(electricityDataHeatPump);
      await this.influxDbClient.close();

      // Return the fetched data
      return electricityDataHeatPump;
    } catch (error) {
      console.error('Error fetching or writing data:', error);
      throw error;
    }
  }

  getTariff(): Observable<TariffData[]> {
    console.log("TariffData");

    return this.httpClient.get<TariffData[]>(this.messageBaseUri+"/getTariffdata");
  }
}




