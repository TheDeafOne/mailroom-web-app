import { AlertController } from '@ionic/angular';

export class filters{
    constructor(public alertController: AlertController) { }

    dayFilters = {"monday": true, "tuesday": true, "wednesday": true, "thursday": true, "friday": true, "saturday": true};
    packageFilters = {"box": true, "flat": true, "shelf": true, "tube": true};
    courierFilters = {"amazon": true, "ups": true, "other": true};
    recipientFilters = {"student": true, "faculty": true, "box-range": true};
  
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
                this.dayFilters["monday"] = !this.dayFilters["monday"];
              },
              checked: this.dayFilters["monday"]
            },
    
            {
              name: 'tuesday',
              type: 'checkbox',
              label: 'Tuesday',
              value: 'tuesday',
              handler: () => {
                this.dayFilters["tuesday"] = !this.dayFilters["tuesday"];
              },
              checked: this.dayFilters["tuesday"]
            },
    
            {
              name: 'wednesday',
              type: 'checkbox',
              label: 'Wednesday',
              value: 'wednesday',
              handler: () => {
                this.dayFilters["wednesday"] = !this.dayFilters["wednesday"];
              },
              checked: this.dayFilters["wednesday"]
            },
    
            {
              name: 'thursday',
              type: 'checkbox',
              label: 'Thursday',
              value: 'thursday',
              handler: () => {
                this.dayFilters["thursday"] = !this.dayFilters["thursday"];
              },
              checked: this.dayFilters["thursday"]
            },
    
            {
              name: 'friday',
              type: 'checkbox',
              label: 'Friday',
              value: 'thursday',
              handler: () => {
                this.dayFilters["friday"] = !this.dayFilters["friday"];
              },
              checked: this.dayFilters["friday"]
            },
    
            {
              name: 'saturday',
              type: 'checkbox',
              label: 'Saturday',
              value: 'saturday',
              handler: (blah) => {
                this.dayFilters["saturday"] = !this.dayFilters["saturday"];
              },
              checked: this.dayFilters["saturday"]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i in this.dayFilters){
                  this.dayFilters[i] = true;
                }
              }
            },
            {
              text: 'Ok'
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
                this.packageFilters["box"] = !this.packageFilters["box"];
              },
              checked: this.packageFilters["box"]
            },
    
            {
              name: 'flat',
              type: 'checkbox',
              label: 'Flat',
              value: 'flat',
              handler: () => {
                this.packageFilters["flat"] = !this.packageFilters["flat"];
              },
              checked: this.packageFilters["flat"]
            },
    
            {
              name: 'shelf',
              type: 'checkbox',
              label: 'Shelf',
              value: 'shelf',
              handler: () => {
                this.packageFilters["shelf"] = !this.packageFilters["shelf"];
              },
              checked: this.packageFilters["shelf"]
            },
    
            {
              name: 'tube',
              type: 'checkbox',
              label: 'Tube',
              value: 'tube',
              handler: () => {
                this.packageFilters["tube"] = !this.packageFilters["tube"];
              },
              checked: this.packageFilters["tube"]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i in this.packageFilters){
                  this.packageFilters[i] = true;
                }
              }
            },
            {
              text: 'Ok'
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
                this.courierFilters["amazon"] = !this.courierFilters["amazon"];
              },
              checked: this.courierFilters["amazon"]
            },
    
            {
              name: 'ups',
              type: 'checkbox',
              label: 'UPS',
              value: 'ups',
              handler: () => {
                this.courierFilters["ups"] = !this.courierFilters["ups"];
              },
              checked: this.courierFilters["ups"]
            },
    
            {
              name: 'other',
              type: 'checkbox',
              label: 'Other',
              value: 'other',
              handler: () => {
                this.courierFilters["other"] = !this.courierFilters["other"];
              },
              checked: this.courierFilters["other"]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i in this.courierFilters){
                  this.courierFilters[i] = true;
                }
              }
            },
            {
              text: 'Ok'
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
                this.courierFilters["student"] = !this.courierFilters["student"];
              },
              checked: this.courierFilters["student"]
            },
    
            {
              name: 'faculty',
              type: 'checkbox',
              label: 'Faculty',
              value: 'faculty',
              handler: () => {
                this.courierFilters["faculty"] = !this.courierFilters["faculty"];
              },
              checked: this.courierFilters["faculty"]
            },
    
            {
              name: 'box-range',
              type: 'checkbox',
              label: 'Box Range',
              value: 'box-range',
              handler: () => {
                this.courierFilters["box-range"] = !this.courierFilters["box-range"];
              },
              checked: this.courierFilters["box-range"]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i in this.courierFilters){
                  this.courierFilters[i] = true;
                }
              }
            },
            {
              text: 'Ok'
            }, 
            
          ]
        });
    
        await alert.present();
      }
}