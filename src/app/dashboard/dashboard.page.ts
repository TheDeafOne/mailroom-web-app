import { Component, ViewChild, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MenuController, AlertController } from '@ionic/angular';
import zoomPlugin from 'chartjs-plugin-zoom';
import data from 'src/assets/data/test-data.json';

Chart.register(zoomPlugin);
Chart.register(...registerables)

var daysLong = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var createdOnData: any = {};
var signedOnData: any = {};
var enteredVolume = 0;
var signedVolume = 0;
var chartDisplayDataOne = [];
var labelsG = [];
// filter dictionaries
var dayFilters = {"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": true};
var packageFilters = {"box": true, "flat": true, "shelf": true, "tube": true};
var courierFilters = {"amazon": true, "ups": true, "fedex": true, "usps": true, "lasership": true, "other": true};
var recipientFilters = {"student": true, "faculty": true, "box-range": true};


function sortStudData() {
  enteredVolume = 0;
  signedVolume = 0;
  createdOnData = {};

  for(const inEl of data){
    // volume data
    enteredVolume += 1;
    if (inEl["SignedOn"] != null){
      signedVolume += 1;
    }
    let cDate: string = new Date(inEl["CreatedOn"]).toDateString();
    let day = daysLong[new Date(inEl["CreatedOn"]).getDay()];

    let pckg = "box";
    if (inEl["ContainerType"] !== "NA"){
      if (inEl["ContainerType"] === "Tube"){
        pckg = "tube"
      } else {
        pckg = "flat";
      }
    } else if (inEl["Shelf"] != null){
      pckg = "shelf"
    } 

    let courier = "other";
    let barcode = inEl["Barcode"];

    if (barcode != null){
      // check tracking numbers via regex testing
      //ups
      if (/\b(1Z ?[0-9A-Z]{3} ?[0-9A-Z]{3} ?[0-9A-Z]{2} ?[0-9A-Z]{4} ?[0-9A-Z]{3} ?[0-9A-Z]|[\dT]\d\d\d ?\d\d\d\d ?\d\d\d)\b/.test(barcode)){
        courier = "ups";
        //fedex
      } else if (/(\b96\d{20}\b)|(\b\d{15}\b)|(\b\d{12}\b)/.test(barcode) ||
      /\b((98\d\d\d\d\d?\d\d\d\d|98\d\d) ?\d\d\d\d ?\d\d\d\d( ?\d\d\d)?)\b/.test(barcode) ||
      /^[0-9]{15}$/.test(barcode)){
        courier = "fedex";
        //usps
      } else if (/(\b\d{30}\b)|(\b91\d+\b)|(\b\d{20}\b)/.test(barcode) ||
      /^E\D{1}\d{9}\D{2}$|^9\d{15,21}$/.test(barcode) ||
      /^91[0-9]+$/.test(barcode) ||
      /^[A-Za-z]{2}[0-9]+US$/.test(barcode)) {
        courier = "usps";
        //amazon
      } else if (barcode.substring(0,3) === "TBA" || barcode.substring(0,3) === "tba"){
        courier = "amazon";
        //lasership
      } else if ((/[a-zA-Z]{2}\d{8}/.test(barcode)
      || /\d{1}[a-zA-Z]{2}\d{17}/.test(barcode)) && barcode !== "amazon"){
        courier = "lasership";
      } 

    }

    let recipient = "student"
    if (inEl["Package"] === "FAC" || inEl["Package"] === "fac"){
      recipient = "faculty";
    }

    let filterFlag = true;

    if (!dayFilters[day]){
      filterFlag = false;
    }
    if (!packageFilters[pckg]){
      filterFlag = false;
    }
    if (!courierFilters[courier]){
      filterFlag = false;
    }
    if (!recipientFilters[recipient]){
      filterFlag = false;
    }


    
    if (filterFlag){
      if (cDate in createdOnData){
        createdOnData[cDate].push(inEl);
      } else {
        createdOnData[cDate] = [inEl];
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
  constructor(private menu: MenuController, public alertController: AlertController) {}
  currentChartTimeRange: () => void = defaultChartDisplay;



  ngOnInit() {
    this.htmlChanges();
    
    // console.log(document.getElementById("dayFilter").children);
  }
  htmlChanges(){
    document.getElementById("entered").innerText = enteredVolume.toString();
    document.getElementById("signed").innerText = signedVolume.toString();
    document.getElementById("inSystem").innerText = (enteredVolume-signedVolume).toString();
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

    async dayFilter() {

        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          inputs: [
            {
              name: 'monday',
              type: 'checkbox',
              label: 'Monday',
              value: 'monday',
              handler: () => {
                dayFilters["monday"] = !dayFilters["monday"];
              },
              checked: dayFilters["monday"]
            },
    
            {
              name: 'tuesday',
              type: 'checkbox',
              label: 'Tuesday',
              value: 'tuesday',
              handler: () => {
                dayFilters["tuesday"] = !dayFilters["tuesday"];
              },
              checked: dayFilters["tuesday"]
            },
    
            {
              name: 'wednesday',
              type: 'checkbox',
              label: 'Wednesday',
              value: 'wednesday',
              handler: () => {
                dayFilters["wednesday"] = !dayFilters["wednesday"];
              },
              checked: dayFilters["wednesday"]
            },
    
            {
              name: 'thursday',
              type: 'checkbox',
              label: 'Thursday',
              value: 'thursday',
              handler: () => {
                dayFilters["thursday"] = !dayFilters["thursday"];
              },
              checked: dayFilters["thursday"]
            },
    
            {
              name: 'friday',
              type: 'checkbox',
              label: 'Friday',
              value: 'thursday',
              handler: () => {
                dayFilters["friday"] = !dayFilters["friday"];
              },
              checked: dayFilters["friday"]
            },
    
            {
              name: 'saturday',
              type: 'checkbox',
              label: 'Saturday',
              value: 'saturday',
              handler: (blah) => {
                dayFilters["saturday"] = !dayFilters["saturday"];
              },
              checked: dayFilters["saturday"]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i in dayFilters){
                  dayFilters[i] = true;
                }
                this.applyFilterOptions();
              }
            },
            {
              text: 'Ok',
              cssClass: 'filter-button',
              handler: (blah) => {
                this.applyFilterOptions();
              }
            }, 
            
          ]
        });
        await alert.present();
      }
    
    async packageFilter() {
    
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          inputs: [
            {
              name: 'box',
              type: 'checkbox',
              label: 'Box',
              value: 'box',
              handler: () => {
                packageFilters["box"] = !packageFilters["box"];
              },
              checked: packageFilters["box"]
            },
    
            {
              name: 'flat',
              type: 'checkbox',
              label: 'Flat',
              value: 'flat',
              handler: () => {
                packageFilters["flat"] = !packageFilters["flat"];
              },
              checked: packageFilters["flat"]
            },
    
            {
              name: 'shelf',
              type: 'checkbox',
              label: 'Shelf',
              value: 'shelf',
              handler: () => {
                packageFilters["shelf"] = !packageFilters["shelf"];
              },
              checked: packageFilters["shelf"]
            },
    
            {
              name: 'tube',
              type: 'checkbox',
              label: 'Tube',
              value: 'tube',
              handler: () => {
                packageFilters["tube"] = !packageFilters["tube"];
              },
              checked: packageFilters["tube"]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i in packageFilters){
                  packageFilters[i] = true;
                }
                this.applyFilterOptions();
              }
            },
            {
              text: 'Ok',
              cssClass: 'filter-button',
              handler: (blah) => {
                this.applyFilterOptions();
              }
            }, 
            
          ]
        });
    
        await alert.present();
      }

   
      async courierFilter() {
    
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          inputs: [
            {
              name: 'amazon',
              type: 'checkbox',
              label: 'Amazon',
              value: 'amazon',
              handler: () => {
                courierFilters["amazon"] = !courierFilters["amazon"];
              },
              checked: courierFilters["amazon"]
            },
    
            {
              name: 'ups',
              type: 'checkbox',
              label: 'UPS',
              value: 'ups',
              handler: () => {
                courierFilters["ups"] = !courierFilters["ups"];
              },
              checked: courierFilters["ups"]
            },
    
            {
              name: 'usps',
              type: 'checkbox',
              label: 'USPS',
              value: 'usps',
              handler: () => {
                courierFilters["usps"] = !courierFilters["usps"];
              },
              checked: courierFilters["usps"]
            },
            {
              name: 'fedex',
              type: 'checkbox',
              label: 'FedEx',
              value: 'fedex',
              handler: () => {
                courierFilters["fedex"] = !courierFilters["fedex"];
              },
              checked: courierFilters["fedex"]
            },

            {
              name: 'lasership',
              type: 'checkbox',
              label: 'LaserShip',
              value: 'lasership',
              handler: () => {
                courierFilters["lasership"] = !courierFilters["lasership"];
              },
              checked: courierFilters["lasership"]
            },
            {
              name: 'other',
              type: 'checkbox',
              label: 'Other',
              value: 'other',
              handler: () => {
                courierFilters["other"] = !courierFilters["other"];
              },
              checked: courierFilters["other"]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i in courierFilters){
                  courierFilters[i] = true;
                }
                this.applyFilterOptions();
              }
            },
            {
              text: 'Ok',
              cssClass: 'filter-button',
              handler: (blah) => {
                this.applyFilterOptions();
              }
            }, 
            
          ]
        });
    
        await alert.present();
      }

      async recipientFilter() {
    
        const alert = await this.alertController.create({
          cssClass: 'my-custom-class',
          header: 'Alert',
          inputs: [
            {
              name: 'student',
              type: 'checkbox',
              label: 'Student',
              value: 'student',
              handler: () => {
                recipientFilters["student"] = !recipientFilters["student"];
              },
              checked: recipientFilters["student"]
            },
    
            {
              name: 'faculty',
              type: 'checkbox',
              label: 'Faculty and Staff',
              value: 'faculty',
              handler: () => {
                recipientFilters["faculty"] = !recipientFilters["faculty"];
              },
              checked: recipientFilters["faculty"]
            },
    
            {
              name: 'box-range',
              type: 'checkbox',
              label: 'Box Range',
              value: 'box-range',
              handler: () => {
                recipientFilters["box-range"] = !recipientFilters["box-range"];
              },
              checked: recipientFilters["box-range"]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i in recipientFilters){
                  recipientFilters[i] = true;
                }
                this.applyFilterOptions();
              }
            },
            {
              text: 'Ok',
              cssClass: 'filter-button',
              handler: (blah) => {
                this.applyFilterOptions();
              }
            }, 
            
          ]
        });
    
        await alert.present();
      }
  

  applyFilterOptions(){
    sortStudData();
    clearChartXY();
    this.htmlChanges;
    this.currentChartTimeRange();
    this.createChart();
  }


  changeChartType(event){
    this.chartType = event["detail"]["value"];
    console.log(this.chartType);
    this.chart.type = this.chartType;
    this.chart.update();
  }

  ionViewDidEnter() {
    this.createChart();
  }

  

  // Visualizing data for one day
  oneDay(){
    this.currentChartTimeRange = this.oneDay;
    (<HTMLInputElement> document.getElementById("one-day-filter")).disabled = true;
    clearChartXY();
    defaultChartDisplay();
    this.chart.destroy();
    this.createChart();
  }

  oneWeek() {
    this.currentChartTimeRange = this.oneWeek;
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

  oneMonth(){
    this.currentChartTimeRange = this.oneMonth;
    this.nMonths(1);
  }

  threeMonths(){
    this.currentChartTimeRange = this.threeMonths;
    this.nMonths(3);
  }

  currentYear(){
    this.currentChartTimeRange = this.currentYear;
    let tmpKDates = Object.keys(createdOnData);
    let month = new Date(tmpKDates[tmpKDates.length-1]).getMonth();
    this.nMonths(month+1);
  }

  maxData(){
    this.currentChartTimeRange = this.maxData;
    clearChartXY();
    for (const val in createdOnData){
      labelsG.push(val);
      chartDisplayDataOne.push(createdOnData[val].length);
    }
    this.replaceChart();
  }

  yearToDate(){
    this.currentChartTimeRange = this.yearToDate;
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
    this.htmlChanges();
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
          zoom: {
            pan: {
              enabled: true,
              mode: 'x',
              modifierKey: 'ctrl',
            },
            zoom: {
              drag: {
                enabled: true
              },
              mode: 'x'
            }
          },
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