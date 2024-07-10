import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import Chart from 'chart.js/auto';
import {ElectricityData} from "../dto/electricity-data";
import {Heatpump} from "../dto/heatpump";
@Component({
  selector: 'app-electricity-monitoring',
  templateUrl: './electricity-monitoring.component.html',
  styleUrls: ['./electricity-monitoring.component.scss']
})
export class ElectricityMonitoringComponent implements OnInit {
  @ViewChild('lineChart', { static: true }) lineChart!: ElementRef<HTMLCanvasElement>;
  private chart!: Chart;
  public showWarning = false;

  public electricityData: ElectricityData[] = [
    { time: '23.04.2024 00:00', generation: 832.7, consumption: 597.00 },
    { time: '23.04.2024 01:00', generation: 786.1, consumption: 568.32 },
    { time: '23.04.2024 02:00', generation: 790.6, consumption: 558.55 },
    { time: '23.04.2024 03:00', generation: 791.1, consumption: 554.44 },
    { time: '23.04.2024 04:00', generation: 797.9, consumption: 570.69 },
    { time: '23.04.2024 05:00', generation: 884.4, consumption: 644.36 },
    { time: '23.04.2024 06:00', generation: 946.8, consumption: 753.79 },
    { time: '23.04.2024 07:00', generation: 904.7, consumption: 824.60 },
    { time: '23.04.2024 08:00', generation: 882.8, consumption: 853.32 },
    { time: '23.04.2024 09:00', generation: 749.7, consumption: 857.22 }

  ];

  public heatpumps: Heatpump[] = [
    { name: 'Wärmepumpe 1', consumption: 7.0, isOn: true },
    { name: 'Wärmepumpe 2', consumption: 8.5, isOn: true },
    { name: 'Wärmepumpe 3', consumption: 9.2, isOn: true },
    { name: 'Wärmepumpe 4', consumption: 12.6, isOn: true },
    { name: 'Wärmepumpe 5', consumption: 18.0, isOn: true },
    { name: 'Wärmepumpe 6', consumption: 20.8, isOn: true },
    { name: 'Wärmepumpe 7', consumption: 25.0, isOn: true },
    { name: 'Wärmepumpe 8', consumption: 29.0, isOn: true }

  ];


  constructor() { }

  ngOnInit(): void {
    this.createChart();
    this.checkForWarning();
  }

  createChart(): void {
    const labels = this.electricityData.map(item => item.time);
    const erzeugungData = this.electricityData.map(item => item.generation);
    const stromverbrauchData = this.electricityData.map(item => item.consumption);

    this.chart = new Chart(this.lineChart.nativeElement, {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Erzeugung',
            data: erzeugungData,
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1,
            fill: false,
          },
          {
            label: 'Stromverbrauch',
            data: stromverbrauchData,
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1,
            fill: false,
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          x: {
            display: true,
            title: {
              display: true,
              text: 'Zeit'
            }
          },
          y: {
            display: true,
            title: {
              display: true,
              text: 'KW'
            },
            beginAtZero: true // Ensures y-axis starts at 0
          }
        }
      }
    });
  }
  checkForWarning(): void {
    const lastEntry = this.electricityData[this.electricityData.length - 1];
    const generationConsumptionDifference = lastEntry.generation - lastEntry.consumption;
    this.showWarning = generationConsumptionDifference < 0;
  }

  toggleHeatpump(index: number): void {
    const heatpump = this.heatpumps[index];
    heatpump.isOn = !heatpump.isOn;

    // Update the Consumption in electricityData
    const consumptionChange = heatpump.isOn ? heatpump.consumption : -heatpump.consumption;
    this.electricityData.forEach(data => {
      data.consumption += consumptionChange;
    });

    // Update the chart
    this.chart.data.datasets![1].data = this.electricityData.map(item => item.consumption);
    this.chart.update();

    // Check if the warning should be displayed
    this.checkForWarning();
  }
}
