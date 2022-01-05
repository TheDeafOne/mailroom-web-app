import { Component, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MenuController } from '@ionic/angular';
import data from 'src/assets/data/test-data.json';


const dBuckets = [];
var createdOnData: any = {};
var signedOnData: any = {};
var chartDisplayDataOne = [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17];
var labelsG = ['S1', 'S2', 'S3', 'S4', 'S5', 'S6', 'S7', 'S8'];

function sortStudData() {
  for(const inEl of data){
    let cDate: string = new Date(inEl["CreatedOn"]).toDateString();
    let sDate: string = new Date(inEl["SignedOn"]).toDateString();
    // adding created on data
    if (cDate in createdOnData){
      createdOnData[cDate].push(inEl);
    } else {
      createdOnData[cDate] = [inEl];
    }
    
    // adding signed on data
    if (sDate in signedOnData){
      signedOnData[sDate].push(inEl);
    } else{
      signedOnData[sDate] = [inEl];
    }
  }

}

sortStudData();

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

  oneDay(){
    // set element for individual day
    let dayHours = {};

    // change x label data
    labelsG = [];
    for (let i = 5; i < 18; i++){
      dayHours[i] = [];
      labelsG.push(String(i+1));
    }

    // get latest day
    let tmpKDates = Object.keys(signedOnData)
    let tDay = createdOnData[tmpKDates[tmpKDates.length-1]];
    // extract data from 
    for (const val in tDay){
      let time = new Date(tDay[val]["CreatedOn"]).getHours();
      dayHours[time].push(tDay[val]);
    }

    // change display data
    chartDisplayDataOne = [];
    for (const val in dayHours){
      chartDisplayDataOne.push(dayHours[val].length);
    }

    this.chart.destroy();
    this.createChart();
  }

  fiveDay() {
    labelsG = [];
    chartDisplayDataOne = [];
    let tmpKDates = Object.keys(signedOnData)
    for (let i = 0; i < 5; i++){
      let date = tmpKDates[tmpKDates.length+i-6];
      labelsG.push(date);
      chartDisplayDataOne.push(createdOnData[date].length);
    }

    this.chart.destroy();
    this.createChart();
  }

  
  createChart() {
    this.chart = new Chart(this.barChart.nativeElement, {
      type: this.chartType,
      data: {
        labels: labelsG,
        datasets: [
          {
          label: 'One',
          data: chartDisplayDataOne,
          backgroundColor: 'skyblue', // array should have same number of elements as number of dataset
          borderColor: 'skyblue',// array should have same number of elements as number of dataset
          borderWidth: 1
        }
        // {
        //   label: 'Two',
        //   data: [2.5, 3.8, 5, 6.9, 6.9, 7.5, 10, 17].reverse(),
        //   backgroundColor: 'skyblue', // array should have same number of elements as number of dataset
        //   borderColor: 'skyblue',// array should have same number of elements as number of dataset
        //   borderWidth: 1
        // } 
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