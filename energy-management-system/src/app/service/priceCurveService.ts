import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class PriceCurveService {

  private readonly influxDbUrl = 'http://localhost:8086/write?db=PriceData';
  private readonly authToken = 'duTFtmQG7UBP7JUTCpeBBOAWppK4tsPlawpvZXSM4fPyMvRGEsRJ7QeJoUYyyQRlejX407yeOEUCyXxaAVpzHw==';

  private workdayPriceCurve: { time: string, price: number }[] = [];
  private sundayHolidayPriceCurve: { time: string, price: number }[] = [];

  constructor(private http: HttpClient) {}

  savePriceCurves() {
    this.workdayPriceCurve = this.getPriceCurve();
    this.sundayHolidayPriceCurve = this.getPriceCurve();

    const workdayDataPoints = this.workdayPriceCurve.map(point => this.createDataPoint(point.time, point.price, false));
    const sundayHolidayDataPoints = this.sundayHolidayPriceCurve.map(point => this.createDataPoint(point.time, point.price, true));

    const allDataPoints = [...workdayDataPoints, ...sundayHolidayDataPoints];
    const dataToSave = allDataPoints.join('\n');

    console.log("Data being sent to InfluxDB:", dataToSave);

    return this.http.post(this.influxDbUrl, dataToSave, { headers: this.createHeaders() })
      .subscribe(
        () => console.log('PriceData successfully saved to InfluxDB.'),
        error => console.error('Error saving data to InfluxDB:', error)
      );
  }

  private createDataPoint(time: string, price: number, isSundayOrHoliday: boolean): string {
    // Get current date and time
    let currentDate = new Date();

// Subtract one day to get yesterday's date
    let yesterdayDate = new Date(currentDate);
    yesterdayDate.setDate(currentDate.getDate() - 1);

// Combine yesterday's date with the time from timeString
    let [hours, minutes] = time.split(":");
    yesterdayDate.setHours(Number(hours));
    yesterdayDate.setMinutes(Number(minutes));

// Convert the date to nanoseconds timestamp
    let nanosecondsTimestamp = yesterdayDate.getTime() * 1e6;

    // Determine the tag2 value based on whether it's Sunday/holiday or weekday
    const tag2 = isSundayOrHoliday ? 'sunday_holiday' : 'weekday';


    this.http.post(this.influxDbUrl, `price_curve,tag1=${tag2} price=${price} ${nanosecondsTimestamp}`, { headers: this.createHeaders() })
      .subscribe(

      );
    return `price_curve,tag1=${tag2} price=${price} ${nanosecondsTimestamp}`;
  }

  private createHeaders() {
    return {
      'Authorization': `Token ${this.authToken}`,
      'Content-Type': 'application/x-www-form-urlencoded'
    };
  }

  getWorkdayPriceCurve(): { time: string, price: number }[] {
    return this.workdayPriceCurve;
  }

  getSundayHolidayPriceCurve(): { time: string, price: number }[] {
    return this.sundayHolidayPriceCurve;
  }

  getPriceCurve(): { time: string, price: number }[] {
    const priceCurve: { time: string, price: number }[] = [];

    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += 15) {
        const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        let price: number;

        // Define price based on time
        if ((hour >= 11 && hour < 17) || (hour >= 0 && hour < 6)) {
          price = this.randomBetween(0.10, 0.15); // Lower price range
        } else {
          price = this.randomBetween(0.15, 0.25); // Higher price range
        }

        priceCurve.push({ time, price });
      }
    }

    return priceCurve;
  }

  private randomBetween(min: number, max: number): number {
    return Math.random() * (max - min) + min;
  }
}
