import { InfluxDB, Point, WriteApi } from '@influxdata/influxdb-client';
import {ElectricityData} from "../dto/ElectricityData";

export class InfluxDbClient {
  private url: string;
  private token: string;
  private org: string;
  private bucket: string;
  private writeApi: WriteApi;

  constructor(url: string, token: string, org: string, bucket: string) {
    this.url = url;
    this.token = token;
    this.org = org;
    this.bucket = bucket;
    this.writeApi = new InfluxDB({ url: this.url, token: this.token }).getWriteApi(this.org, this.bucket);
    this.writeApi.useDefaultTags({ source: 'typescript-client' });
  }

  public async writeElectricityData(electricityData:ElectricityData): Promise<void> {
    const point = new Point(electricityData.meterId)
      .timestamp(electricityData.time);

    // Add tags to the point
      point.tag('consumption', String(electricityData.consumption));


    try {
      this.writeApi.writePoint(point);
      await this.writeApi.flush();
      console.log('Data written successfully');
    } catch (error) {
      console.error('Error writing data to InfluxDB:', error);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.writeApi.close();
    } catch (error) {
      console.error('Error closing InfluxDB client:', error);
    }
  }
}
