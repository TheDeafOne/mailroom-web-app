import { Component, ViewChild, OnInit } from '@angular/core';
import { Chart, DatasetController, registerables } from 'chart.js';
import { MenuController, AlertController } from '@ionic/angular';
import { filters } from './dashboard.filters';

import data from 'src/assets/data/test-data.json';
var createdOnData: any = {};
var signedOnData: any = {};
var chartDisplayDataOne = [];
var labelsG = [];
var enteredValue = 0;
var signedValue = 0;
function sortStudData() {
  for(const inEl of data){
    enteredValue++;
    let cDate: string = new Date(inEl["CreatedOn"]).toDateString();
    let sDate: string = new Date(inEl["SignedOn"]).toDateString();
    // adding created on data
    if (cDate in createdOnData){
      createdOnData[cDate].push(inEl);
    } else {
      createdOnData[cDate] = [inEl];
    }
    
    // adding signed on data
    if (sDate != "NA"){
      signedValue++;
      if (sDate in signedOnData){
        signedOnData[sDate].push(inEl);
      } else {
        signedOnData[sDate] = [inEl];
      }
    }
  }
}

function clearChartXY(){
  labelsG = [];
  chartDisplayDataOne = [];
}


function defaultChartDisplay(){
  let dayHours = {};
    chartDisplayDataOne = [];
    labelsG = ["6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"];

    // get latest day
    let tmpKDates = Object.keys(createdOnData);
    let tDay = createdOnData[tmpKDates[tmpKDates.length-1]];
    // extract data from 
    for (const val in tDay){
      let time = new Date(tDay[val]["CreatedOn"]).getHours();
      if (time in dayHours){
        dayHours[time].push(tDay[val]);
      } else {
        dayHours[time] = [tDay[val]];
      }
    }
    // change display data
    for (const val in labelsG){
      let time = (Number(val.substring(0,2))+6);
      if (time in dayHours){
        chartDisplayDataOne.push(dayHours[time].length)
      } else {
        chartDisplayDataOne.push(0);
      }
    }
}

sortStudData();
defaultChartDisplay();

Chart.register(...registerables)


@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss']
})

export class dashboard implements OnInit {
  chartType: any = 'bar';
  @ViewChild('barChart') barChart;
  chart: any;
  colorArray: any;
  constructor(private menu: MenuController) {}

  filtersC = new filters(new AlertController());


  ngOnInit() {
    document.getElementById("entered").innerText = enteredValue.toString();
    document.getElementById("signed").innerText = signedValue.toString();
    document.getElementById("inSystem").innerText = (enteredValue-signedValue).toString();
    // console.log(document.getElementById("dayFilter").children);
  }
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

 
  dayFilter(){
    this.filtersC.dayFilter();
    
    for (let day in labelsG){
      console.log(day);
    }
  }

  packageFilter(){
    this.filtersC.packageFilter();
  }
  
  courierFilter(){
    this.filtersC.courierFilter();
  }

  recipientFilter(){
    this.filtersC.recipientFilter();
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
    (<HTMLInputElement> document.getElementById("one-day-filter")).disabled = true;
    clearChartXY();
    defaultChartDisplay();
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

    this.replaceChart();
  }

  currentYear(){
    let tmpKDates = Object.keys(createdOnData);
    let month = new Date(tmpKDates[tmpKDates.length-1]).getMonth();
    this.nMonths(month+1);
  }

  maxData(){
    clearChartXY();
    for (const val in createdOnData){
      labelsG.push(val);
      chartDisplayDataOne.push(createdOnData[val].length);
    }
    this.replaceChart();
  }

  yearToDate(){
    this.nMonths(12);
    let tmpKDates = Object.keys(createdOnData);
    let latestDate = new Date(tmpKDates[tmpKDates.length-1]);
    let currDate = new Date(labelsG[0]);
    
    if (currDate.getMonth() === latestDate.getMonth()){
      while (currDate.getDate() < latestDate.getDate()){
        labelsG.splice(0,1);
        chartDisplayDataOne.splice(0,1);
        currDate = new Date(labelsG[0]);
      }

      this.replaceChart();
    }
  }
  nMonths(monthNum){
    clearChartXY();
    let tmpKDates = Object.keys(createdOnData);
    let latestDate = new Date(tmpKDates[tmpKDates.length-1]);
    let yearCorrection = 0;
    let monthCorrection = 0;
    for (let i = 0; i < monthNum; i++){
      let date = new Date(latestDate.getFullYear()-yearCorrection, latestDate.getMonth()-monthNum+monthCorrection+i+2, 0);
      for (const val in tmpKDates){
        let currDate = new Date(tmpKDates[val]);
        if (currDate.getMonth() == date.getMonth()){
          labelsG.push(currDate.toDateString());
          chartDisplayDataOne.push(createdOnData[currDate.toDateString()].length);
        }
      }

      if(latestDate.getMonth()-i == 1){
        yearCorrection = 1;
        monthCorrection = 12;
      }
    }


    this.replaceChart();
  }

  replaceChart(){
    (<HTMLInputElement> document.getElementById("one-day-filter")).disabled = false;
    this.chart.destroy();
    for (let i = 0; i < labelsG.length; i++){
      labelsG[i] = labelsG[i];
    }
    this.createChart();
  }

  createChart() {
    if(this.chart!=null){
      this.chart.destroy();
    }
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
        plugins: {
          legend: {
            display: false,
          }
        },
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