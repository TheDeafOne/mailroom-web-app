import { Component, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import data from 'src/assets/data/test-data.json';

Chart.register(...registerables)
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('barChart') barChart;

  bars: any;
  colorArray: any;
  constructor() { }

  ionViewDidEnter() {
    this.createChart();
  }

  createChart() {
    this.bars = new Chart(this.barChart.nativeElement, {
      type: 'line',
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [
          {
          label: 'One',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
          backgroundColor: '#ddee44', // array should have same number of elements as number of dataset
          borderColor: '#ddee44',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'Two',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17].reverse(),
          backgroundColor: '#dd1144', // array should have same number of elements as number of dataset
          borderColor: '#dd1144',// array should have same number of elements as number of dataset
          borderWidth: 1
        }
      ]
      },
      options: {
        scales: {
          yAxes: {
            beginAtZero: true
          }
        }
      }
    });
  }
}