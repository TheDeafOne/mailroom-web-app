import { Component, ViewChild, OnInit } from '@angular/core';
import { Chart, registerables } from 'chart.js';
import { MenuController, AlertController } from '@ionic/angular';
import zoomPlugin from 'chartjs-plugin-zoom';
import data from 'src/assets/data/test-data.json';

Chart.register(zoomPlugin);
Chart.register(...registerables)


//TODO: time range comments
//TODO: CSS updates
//TODO: trends
//TODO: class splitting and optimization

const daysLong = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
var createdOnData: any = {};
var signedOnData: any = {};
var chartDisplayDataOne = [];
var chartDisplayDataTwo = [];
var CDLS = []
var SDLS = []
var enteredVolume = 0;
var signedVolume = 0;

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
  signedOnData = {};
  chartDisplayDataOne = [];
  chartDisplayDataTwo = [];
  CDLS = [];
  SDLS = [];

  for(const inEl of data){
    // volume data
    enteredVolume += 1;
    
    let cDate: string = new Date(inEl["CreatedOn"]).toDateString();
    let sDate: string = new Date(inEl["SignedOn"]).toDateString();
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
      // push created on data
      if (cDate in createdOnData){
        createdOnData[cDate].push(inEl);
      } else {
        CDLS.push(cDate);
        createdOnData[cDate] = [inEl];
      }

      // push signed on data
      if (inEl["SignedOn"] != null){
        signedVolume += 1;

        if (sDate in signedOnData){
          signedOnData[sDate].push(inEl);
        } else {
          SDLS.push(sDate);
          signedOnData[sDate] = [inEl];
        }
      }

    }
  }
}

function clearChartXY(){
  labelsG = [];
  chartDisplayDataOne = [];
  chartDisplayDataTwo = [];
}


function defaultChartDisplay(){
  let dayHours = {"created": {}, "signed": {}};
  chartDisplayDataOne = []
  chartDisplayDataTwo = []
  labelsG = ["6am", "7am", "8am", "9am", "10am", "11am", "12pm", "1pm", "2pm", "3pm", "4pm", "5pm", "6pm"];

  
  // get latest day
  let tcDay = createdOnData[CDLS[CDLS.length-1]];
  let tsDay = signedOnData[SDLS[SDLS.length-1]];
  // extract data from 
  for (const val in tcDay){
    let time = new Date(tcDay[val]["CreatedOn"]).getHours();
    if (time in dayHours["created"]){
      dayHours["created"][time].push(tcDay[val]);
    } else {
      dayHours["created"][time] = [tcDay[val]];
    }
  }
  for(const val in tsDay){
    let time = new Date(tsDay[val]["SignedOn"]).getHours();
    if (time in dayHours["signed"]){
      dayHours["signed"][time].push(tsDay[val]);
    } else {
      dayHours["signed"][time] = [tsDay[val]];
    }
  }
 
  // change display data
  for (const val in labelsG){
    let time = (Number(val.substring(0,2))+6);
    
    if (time in dayHours["created"]){
      chartDisplayDataOne.push(dayHours["created"][time].length);
    } else {
      chartDisplayDataOne.push(0);
    }

    if (time in dayHours["signed"]){
      chartDisplayDataTwo.push(dayHours["signed"][time].length);
    } else {
      chartDisplayDataTwo.push(0);
    }
  }

}


let timer;
function startFetch({chart}) {
  const {min, max} = chart.scales.x;
  clearTimeout(timer);
  timer = setTimeout(() => {
    console.log('Fetched data between ' + min + ' and ' + max);
    htmlChanges(true, min, max);
    console.log(`lg[${min}]: ${labelsG[min]}\nlg[${max}]: ${labelsG[max]}`);
    console.log(`ccdo[${min}]: ${chartDisplayDataOne[min]}\ncddo[${max}]: ${chartDisplayDataOne[max]}`);
  }, 80);
}

  /**
   * dynamically visualize html changes
   */
  function htmlChanges(endpoints = false, b = 0, e = 0) {
    let begin = 0;
    let end = chartDisplayDataOne.length-1;
    if (endpoints){
      begin = b;
      end = e;
    }
    var max = chartDisplayDataOne[begin];
    var min = chartDisplayDataOne[begin];
    var avg;
    var mxDate = labelsG[begin];
    var mnDate = labelsG[begin];
    var total = 0;

    for (let i = begin; i <= end; i++){
      let value = chartDisplayDataOne[i];
      total += value;
      if (value > max){
        max = value;
        mxDate = labelsG[i];
      } else if (value < min) {
        min = value;
        mnDate = labelsG[i];
      }
    }


    if (end-begin == 0){
      avg = max;
    } else {
      avg = Math.round(total/(end-begin));
    }
    document.getElementById("high").innerText = max.toString();
    document.getElementById("low").innerText = min.toString();
    document.getElementById("average").innerText = avg.toString();

  }


sortStudData();
defaultChartDisplay();




@Component({
  selector: 'app-dashboard',
  templateUrl: 'dashboard.page.html',
  styleUrls: ['dashboard.page.scss'],
})

export class dashboard implements OnInit {
  chartType: any = 'bar';
  @ViewChild('barChart') barChart;
  
  chart: any;
  colorArray: any;
  constructor(private menu: MenuController, public alertController: AlertController) {}
  currentChartTimeRange: () => void = defaultChartDisplay;

  ngOnInit() {
    htmlChanges();
  }
  
  ionViewDidEnter() {
    this.createChart();
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

  
  /**
   * Alert sheet for day filter options
   */
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

  /**
   * Alert sheet for package filter options
   */
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


  /**
   * Alert sheet for courier filter options
   */
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

  /**
   * Alert sheet for recipient filter options
   */
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
  

  /**
   * Function that applies currently selected filter options
   */
  applyFilterOptions(){
    sortStudData(); // sorts data according to set filters
    clearChartXY(); // clears current chart
    this.currentChartTimeRange(); // calls current time range so chart isn't reset to daily
    this.createChart();
  }

  /**
   * Function that changes chart type.
   * @param event given html event holding requested chart type
   */
  changeChartType(event){
    this.chartType = event["detail"]["value"];
    this.chart.type = this.chartType;
    this.createChart();  
  }

  
  /**
   * Function that displays current day's data
   */
  oneDay(){
    this.currentChartTimeRange = this.oneDay;
    clearChartXY();
    defaultChartDisplay();
    this.createChart();
  }


  /**
   * Function that displays latest week of data
   */
  oneWeek() {
    this.currentChartTimeRange = this.oneWeek;
    clearChartXY();
    // check for past seven daily inputs
    for (let i = 0; i < 7; i++){

      // get the ith date within the 7 day range and add to x labels
      let date = CDLS[CDLS.length+i-8];
      labelsG.push(date);

      // pulling date from CDLS, so the date will always be in createdOnData
      chartDisplayDataOne.push(createdOnData[date].length);
    
      // check if date is in signedOnData as well and add to display 
      if (date in signedOnData){
        chartDisplayDataTwo.push(signedOnData[date].length);
      } else {
        chartDisplayDataTwo.push(0);
      }
    }
    this.createChart();
  }


  /**
   * Function that displays the current month'ss data
   */
  oneMonth(){
    this.currentChartTimeRange = this.oneMonth;
    this.nMonths(1);
  }


  /**
   * Function that displays the past three months of data
   */
  threeMonths(){
    this.currentChartTimeRange = this.threeMonths;
    this.nMonths(3);
  }


  /**
   * Function that displays all data within the current year
   */
  currentYear(){
    this.currentChartTimeRange = this.currentYear;
    // get current month
    let month = new Date(CDLS[CDLS.length-1]).getMonth();
    this.nMonths(month+1);
  }


  /**
   * Function that displays all data
   */
  maxData(){
    this.currentChartTimeRange = this.maxData;
    clearChartXY();

    // cycle through days where packages were entered, include created and signed on data for those days
    for (const val in createdOnData){
      // set up x labels
      labelsG.push(val);

      // push created on data
      chartDisplayDataOne.push(createdOnData[val].length);
      
      // check to see if any packages have been signed in that day and push to display data accordingly
      if (val in signedOnData){
        chartDisplayDataTwo.push(signedOnData[val].length);
      } else {
        chartDisplayDataTwo.push(0);
      }
    }
    this.createChart();
  }


  /**
   * Function that gets the past 12 months of data
   */
  yearToDate(){
    this.currentChartTimeRange = this.yearToDate;
    this.nMonths(12);
    this.createChart();
  }


  /**
   * A function that displays the given number of months
   * @param monthNum number of months to display
   */
  nMonths(monthNum){
    // clear any currently displayed data
    clearChartXY();
    // get the most recent date
    let latestDate = new Date(CDLS[CDLS.length-1]);
    let yearCorrection = 0;
    let monthCorrection = 0;

    // cycle through and get the data for each required month
    for (let i = 0; i < monthNum; i++){
      
      // get current month/year in loop
      let currMonth = new Date(latestDate.getFullYear()-yearCorrection, latestDate.getMonth()-monthNum+monthCorrection+i+2, 0);

      // cycle through all the created on data
      for (const val in CDLS){
        // get current date
        let currDate = new Date(CDLS[val]);

        // check if current date is in current month
        if (currDate.getMonth() == currMonth.getMonth()){
          
          // push created and signed date to chart display
          labelsG.push(currDate.toDateString());
          if (currDate.toDateString() in createdOnData){
            chartDisplayDataOne.push(createdOnData[currDate.toDateString()].length);
          } else {
            chartDisplayDataOne.push(0);
          }
          if (currDate.toDateString() in signedOnData) {
            chartDisplayDataTwo.push(signedOnData[currDate.toDateString()].length)
          } else {
            chartDisplayDataTwo.push(0);
          }
        }
      }

      // date correction for time ranges going into past years
      if (latestDate.getMonth()-i == 1){
        yearCorrection = 1;
        monthCorrection = 12;
      }
    }
    this.createChart();
  }


  /**
   * Display data from start date to end date. For example:
   * begin: 1-1-2021, end: 1-2-2021
   * would show all the signed on/created on data for the two days January 1st 2021 through January 2nd 2021, including no-enter days
   * no-enter days are sundays, holidays, etc. where no packages will be entered or signed.
   * @param begin date to start displaying data on
   * @param end date to stop displaying data on
   */
  // begin and end date variables to maintain custom value changes
  beginCDate: string;
  endCDate: string;
  applyCustomDates(){
    this.currentChartTimeRange = this.applyCustomDates;
    clearChartXY();

    let currDate = new Date(this.beginCDate);
    let endDate = new Date(this.endCDate);


    // check that currDate is before endDate
    if (currDate.toISOString() < endDate.toISOString()){

      // update display data for every day between currDate and endDate
      while (currDate.toISOString() <= endDate.toISOString()){

        // update currDateStr
        let currDateStr = currDate.toDateString();

        // add to labels
        labelsG.push(currDateStr);

        // push created/signed date to lists
        if (currDateStr in createdOnData){
          chartDisplayDataOne.push(createdOnData[currDateStr].length);
        } else {
          chartDisplayDataOne.push(0);
        }
        if (currDateStr in signedOnData){
          chartDisplayDataTwo.push(signedOnData[currDateStr].length)
        } else {
          chartDisplayDataTwo.push(0);
        }
        // update currDate
        currDate.setDate(currDate.getDate() + 1);
      }
    // } else if (currDate.toISOString() == endDate.toISOString()){
    //   if (!(currDateStr in createdOnData)){
    //     createdOnData[currDateStr] = [];
    //     signedOnData[currDateStr] = [];
    //   }
    //   let tmpc = createdOnData[CDLS[CDLS.length-1]];
    //   let tmps = signedOnData[SDLS[SDLS.length-1]];
    //   createdOnData[CDLS[CDLS.length-1]] = createdOnData[currDateStr];
    //   signedOnData[CDLS[CDLS.length-1]] = signedOnData[currDateStr];

    //   this.oneDay();

    //   createdOnData[CDLS[CDLS.length-1]] = tmpc;
    //   signedOnData[SDLS[SDLS.length-1]] = tmps;

    } else {
      console.log("handle error message");
    }
    
    // visualize chart
    this.createChart();
  }

  


  
  /**
   * Custom date range option
   * make prettier and figure out why signature data is on for sundays somehow??
   */
  async customDates(){
    // today to maintain max date value
    let today = new Date().toISOString().split('T')[0];

    // alert sheet
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'Custom Range',

      inputs: [
        {
          name: 'begin',
          type: 'date',
          min: '2020-01-01',
          max: today,
          label: 'Begin',
          value: this.beginCDate
        },
        {
          name: 'end',
          type: 'date',
          min: '2020-01-01',
          max: today,
          label: 'End',
          value: this.endCDate
        }
      ],
      buttons: [
        {
          text: 'Cancel'
        },
        {
          text: 'Ok',
          // set current begin and end date values and call to display data
          handler: (inputs) => {
            this.beginCDate = inputs["begin"];
            this.endCDate = inputs["end"];    
            this.applyCustomDates();
          }
        }, 
      ]
    });

    await alert.present();
  
  }

  // /**
  //  * 
  //  */
  // replaceChart(){
  //   // (<HTMLInputElement> document.getElementById("one-day-filter")).disabled = false;
  //   this.createChart();
  // }

  /**
   * Generate chart for two data sets: signed on and created on data
   */
  createChart() {
    // check for previously made chart
    if(this.chart != null){
      // handle one day filter disabling
      // required to keep user from using mon-sat filters on a one day chart
      let odFilter = (<HTMLInputElement> document.getElementById("one-day-filter"));
      if(this.currentChartTimeRange == this.oneDay){
        odFilter.disabled = true;
      } else {
        odFilter.disabled = false;
      }
      htmlChanges();
      this.chart.destroy();
    }

    this.chart = new Chart(this.barChart.nativeElement, {
      // variable chart types: bar, line, and scatter
      // TODO: get scatter chart working
      type: this.chartType,

        data: {
        labels: labelsG,

        // TODO: allow data color changing
        datasets: [
          {
          label: 'Entered',
          data: chartDisplayDataOne,
          backgroundColor: 'skyblue', 
          borderColor: 'skyblue',
          borderWidth: 1
        },
        {
          label: 'Signed',
          data: chartDisplayDataTwo,
          backgroundColor: 'palegoldenrod', 
          borderColor: 'palegoldenrod',
          borderWidth: 1
        } 
      ]
      },
      options: {
        plugins: {
          // zoom plugin for wheel and drag
          // TODO: possibly get pan working
          zoom: {
            limits: {
              x: {min: 'original', max: 'original'},
            },
            zoom: {
              wheel: {
                enabled: true,
              },
              drag: {
                enabled: true
              },
              mode: 'x',
              onZoomComplete: startFetch
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