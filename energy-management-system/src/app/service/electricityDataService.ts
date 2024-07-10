import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ElectricityDataService {

  private influxDbUrl = 'http://localhost:8086/write?db=ElectricityData';
  private influxDbUrlQuery = 'http://localhost:8086/query?db=ElectricityData';
  private authToken = 'duTFtmQG7UBP7JUTCpeBBOAWppK4tsPlawpvZXSM4fPyMvRGEsRJ7QeJoUYyyQRlejX407yeOEUCyXxaAVpzHw==';

  constructor(private http: HttpClient) { }

  saveElectricityData(consumption: number) {
    const timestamp = new Date().getTime() * 1000000; // Convert to nanoseconds
    const meterId = '1234567890';
    const dataPoint = `electricity_consumption value=${consumption} ${timestamp}`;

    const headers = new HttpHeaders()
      .set('Authorization', 'Token ' + this.authToken)
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.influxDbUrl, dataPoint, { headers });
  }

  saveElectricityDataInitial(consumption: number, twoHoursEarlier: Date) {
    // Get the current time in Berlin timezone

    // Convert to nanoseconds
    const berlinTimestampNanoseconds = twoHoursEarlier.getTime() * 1000000;

    const dataPoint = `electricity_consumption value=${consumption.toFixed(2)} ${berlinTimestampNanoseconds}`;

    const headers = new HttpHeaders()
      .set('Authorization', 'Token ' + this.authToken)
      .set('Content-Type', 'application/x-www-form-urlencoded');

    return this.http.post(this.influxDbUrl, dataPoint, { headers });
  }
  getElectricityData(startTime: string, endTime: string): Observable<any> {
    var formatedStarTime = this.toRFC3339(startTime);
    const query = `SELECT * FROM electricity_consumption WHERE time >= '${formatedStarTime}'`;
    console.log(query);
    const headers = new HttpHeaders()
      .set('Authorization', 'Token ' + this.authToken);

    return this.http.get(this.influxDbUrlQuery + `&q=${encodeURIComponent(query)}`, { headers });
  }

  toRFC3339(dateTimeStr: string): string {
    // Parse the input date string
    const date = new Date(dateTimeStr);

    // Get individual date components
    const year = date.getUTCFullYear();
    const month = String(date.getUTCMonth() + 1).padStart(2, '0');
    const day = String(date.getUTCDate()).padStart(2, '0');
    const hours = String(date.getUTCHours()).padStart(2, '0');
    const minutes = String(date.getUTCMinutes()).padStart(2, '0');
    const seconds = String(date.getUTCSeconds()).padStart(2, '0');

    // Construct the RFC3339 formatted date-time string
    const rfc3339DateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}Z`;

    return rfc3339DateTime;
  }


}
