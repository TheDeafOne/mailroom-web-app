import { Component, ViewChild } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MenuController } from '@ionic/angular';
import data from 'src/assets/data/test-data.json';


const dBuckets = [];
var createdOnData: any = {};
var signedOnData: any = {};
var chartDisplayDataOne = [];
var labelsG = [];

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

  // Visualizing data for one day
  oneDay(){
    let dayHours = {};
    labelsG = ["6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"];

    // get latest day
    let tmpKDates = Object.keys(createdOnData)
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

  oneWeek() {
    labelsG = [];
    chartDisplayDataOne = [];
    let tmpKDates = Object.keys(createdOnData)
    for (let i = 0; i < 7; i++){
      let date = tmpKDates[tmpKDates.length+i-8];
      labelsG.push(date);
      chartDisplayDataOne.push(createdOnData[date].length);
    }

    this.chart.destroy();
    this.createChart();
  }

  oneMonth(){
    labelsG = []
    chartDisplayDataOne = [];
    let tmpKDates = Object.keys(createdOnData);
    let dLen = tmpKDates.length;
    let today = new Date(tmpKDates[dLen-1]);
    let yesterday = new Date(tmpKDates[dLen-2]);
    
    let dayCount = 2;
    if (today.getDate() > 7){ 
      while(today.getMonth() == yesterday.getMonth()){
        labelsG.splice(0,0,today.toDateString());
        chartDisplayDataOne.splice(0,0,createdOnData[today.toDateString()].length);

        today = new Date(tmpKDates[dLen-dayCount]);
        yesterday = new Date(tmpKDates[dLen-dayCount-1]);
        dayCount++;
      }
    } else if (today.getDate() > 1) {
      this.oneWeek();
    } else {
      this.oneDay();
    }

    this.chart.destroy();
    this.createChart();
  }

  threeMonth(){
    labelsG = [];
    chartDisplayDataOne = [];
    let tmpKDates = Object.keys(signedOnData);
    let date = new Date(tmpKDates[tmpKDates.length-1]);
    
    
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