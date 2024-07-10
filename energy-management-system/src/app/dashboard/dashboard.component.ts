import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';
import {ElectricityData} from "../dto/ElectricityData";
import {TariffData} from "../dto/TariffData";
import {ElectricitySimulationService} from "../service/ElectricitySimulationService";
import {ElectricityDataService} from "../service/electricityDataService";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  @ViewChild('priceChart', { static: true }) priceChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('electricityChart', { static: true }) electricityChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('tariffChart', { static: true }) tariffChart!: ElementRef<HTMLCanvasElement>;

  private electricityChartInstance?: Chart;
  private tariffChartInstance?: Chart;
  public showWarning = false;
  public tariffData: TariffData[] = [
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 00:00`, EndTime: '23.04.2024 00:00', PreisLow: 0.15, PreisHigh: 0.18 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 01:00`, EndTime: '23.04.2024 01:00', PreisLow: 0.18, PreisHigh: 0.19 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 02:00`, EndTime: '23.04.2024 02:00', PreisLow: 0.18, PreisHigh: 0.21 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 03:00`, EndTime: '23.04.2024 03:00', PreisLow: 0.14, PreisHigh: 0.17 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 04:00`, EndTime: '23.04.2024 04:00', PreisLow: 0.14, PreisHigh: 0.19 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 05:00`, EndTime: '23.04.2024 05:00', PreisLow: 0.20, PreisHigh: 0.23 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 06:00`, EndTime: '23.04.2024 06:00', PreisLow: 0.24, PreisHigh: 0.27 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 07:00`, EndTime: '23.04.2024 07:00', PreisLow: 0.28, PreisHigh: 0.34 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 08:00`, EndTime: '23.04.2024 08:00', PreisLow: 0.32, PreisHigh: 0.38 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 09:00`, EndTime: '23.04.2024 09:00', PreisLow: 0.36, PreisHigh: 0.42 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 10:00`, EndTime: '23.04.2024 10:00', PreisLow: 0.32, PreisHigh: 0.38 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 11:00`, EndTime: '23.04.2024 11:00', PreisLow: 0.28, PreisHigh: 0.34 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 12:00`, EndTime: '23.04.2024 12:00', PreisLow: 0.24, PreisHigh: 0.27 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 13:00`, EndTime: '23.04.2024 13:00', PreisLow: 0.20, PreisHigh: 0.23 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 14:00`, EndTime: '23.04.2024 14:00', PreisLow: 0.16, PreisHigh: 0.19 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 15:00`, EndTime: '23.04.2024 15:00', PreisLow: 0.16, PreisHigh: 0.19 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 16:00`, EndTime: '23.04.2024 16:00', PreisLow: 0.20, PreisHigh: 0.23 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 17:00`, EndTime: '23.04.2024 17:00', PreisLow: 0.24, PreisHigh: 0.27 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 18:00`, EndTime: '23.04.2024 18:00', PreisLow: 0.28, PreisHigh: 0.31 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 19:00`, EndTime: '23.04.2024 19:00', PreisLow: 0.32, PreisHigh: 0.38 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 20:00`, EndTime: '23.04.2024 20:00', PreisLow: 0.36, PreisHigh: 0.42 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 21:00`, EndTime: '23.04.2024 21:00', PreisLow: 0.35, PreisHigh: 0.41 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 22:00`, EndTime: '23.04.2024 22:00', PreisLow: 0.32, PreisHigh: 0.38 },
    { TariffID: 123, StartTime: `${new Date().toISOString().slice(0, 10)} 23:00`, EndTime: '23.04.2024 23:00', PreisLow: 0.27, PreisHigh: 0.30 }
  ];

  public electricityData: any[] = [];

  constructor(private electricityDataService: ElectricityDataService) {}

  ngOnInit() {
    this.createElectricityChart();
    this.createTariffChart();
    console.log();
    this.fetchElectricityData();
  }
  fetchElectricityData() {
    const currentDate = new Date().toISOString().slice(0, 10);
    const startTime = `${currentDate} 00:00`;
    const endTime = `${currentDate} 23:45`;
    this.electricityDataService.getElectricityData(startTime, endTime).subscribe(
      data => {
        this.electricityData = this.processElectricityData(data);
        this.destroyCharts();
        this.createElectricityChart();
        this.createTariffChart();
      },
      error => {
        console.error('Error fetching electricity data:', error);
      }
    );
  }
  processElectricityData(data: any): any[] {
    const processedData: any[] = [];
    if (data && data.results && data.results.length > 0) {
      data.results[0].series[0].values.forEach((value: any) => {
        processedData.push({
          time: new Date(value[0]).toLocaleString(),
          consumption: value[1]
        });
      });
    }
    return processedData;
  }
  createElectricityChart() {
    // Extract time and consumption data
    const electricityTimes = this.electricityData.map(data => {
      // Example format: '2024-07-10 04:50:00 GMT+20,23'
      const timeString = data.time;
      const dateTimeParts = timeString.split(' ');
      const timePart = dateTimeParts[1]; // Extract '04:50:00'
      return timePart.substr(0, 5); // Return '04:50'
    });

    const electricityValues = this.electricityData.map(data => data.consumption);

    // Create or update the Chart.js instance
    this.electricityChartInstance = new Chart(this.electricityChart.nativeElement, {
      type: 'line',
      data: {
        labels: electricityTimes,
        datasets: [{
          label: 'Electricity Consumption',
          data: electricityValues,
          borderColor: 'blue',
          backgroundColor: 'transparent',
          yAxisID: 'y'
        }]
      },
      options: {
        scales: {
          x: {
            type: 'time',
            time: {
              parser: 'HH:mm',
              unit: 'hour',
              displayFormats: {
                hour: 'HH:mm'
              },
              tooltipFormat: 'HH:mm'
            },
            title: {
              display: true,
              text: 'Time'
            }
          },
          y: {
            type: 'linear',
            position: 'left',
            title: {
              display: true,
              text: 'KWh'
            },
          }
        }
      }
    });
  }

  createTariffChart() {
    const priceTimes = this.tariffData.map(data => data.StartTime);
    const priceValues = this.tariffData.map(data => data.PreisHigh);

    this.tariffChartInstance = new Chart(this.tariffChart.nativeElement, {
      type: 'bar',
      data: {
        labels: priceTimes,
        datasets: [{
          label: 'Electricity Price',
          data: priceValues,
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1,
          yAxisID: 'y1'
        }]
      },
      options: {
        scales: {
          y1: {
            type: 'linear',
            position: 'right',
            title: {
              display: true,
              text: '€'
            },
            grid: {
              drawOnChartArea: false
            }
          }
        }
      }
    });
  }

  private destroyCharts() {
    if (this.electricityChartInstance) {
      this.electricityChartInstance.destroy();
      this.electricityChartInstance = undefined;
    }
    if (this.tariffChartInstance) {
      this.tariffChartInstance.destroy();
      this.tariffChartInstance = undefined;
    }
  }
}
