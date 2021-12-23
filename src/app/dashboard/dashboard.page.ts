import { Component, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MenuController } from '@ionic/angular';
import data from 'src/assets/data/test-data.json';


const sData: any = [];
const dBuckets: any = [];
const labelsG: any = [];

function sortStudData() {
  for(const inEl of data){
    sData.push(inEl);
  }

}

sortStudData();
console.log("this is the data in array form")
console.log(sData);


Chart.register(...registerables)


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})

export class dashboard {
  chartType: any = 'bar';
  @ViewChild('barChart') barChart;
  chart: any;
  colorArray: any;
  constructor(private menu: MenuController) { }
  openFirst(){
    this.menu.enable(true,'first');
    this.menu.open('first');
  }
  openEnd(){
    this.menu.open('end')
  }
  openCustom(){
    this.menu.enable(true,'custom');
    this.menu.open('custom');
  }
  

  shouldShow(){
    console.log("value")
  }

  showChartData(event){
    var value = event["detail"]["value"]
    this.chart.destroy();
    this.chartType = value;
    this.createChart();
  }
  ionViewDidEnter() {
    this.createChart();
  }
  
  createChart() {
    this.chart = new Chart(this.barChart.nativeElement, {
      type: this.chartType,
      data: {
        labels: ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'],
        datasets: [
          {
          label: 'One',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17],
          backgroundColor: 'skyblue', // array should have same number of elements as number of dataset
          borderColor: 'skyblue',// array should have same number of elements as number of dataset
          borderWidth: 1
        },
        {
          label: 'Two',
          data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17].reverse(),
          backgroundColor: 'skyblue', // array should have same number of elements as number of dataset
          borderColor: 'skyblue',// array should have same number of elements as number of dataset
          borderWidth: 1
        } 
      ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          yAxes: {
            beginAtZero: true
          }
        }
      }
    });
  }
}