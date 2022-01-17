import { AlertController } from '@ionic/angular';

export class filters{
    constructor(public alertController: AlertController) { }

    dayFilters = new Array(6).fill(true);
    packageFilters = new Array(4).fill(true);
    courierFilters = new Array(3).fill(true);

  
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
                this.dayFilters[0] = !this.dayFilters[0];
              },
              checked: this.dayFilters[0]
            },
    
            {
              name: 'tuesday',
              type: 'checkbox',
              label: 'Tuesday',
              value: 'tuesday',
              handler: () => {
                this.dayFilters[1] = !this.dayFilters[1];
              },
              checked: this.dayFilters[1]
            },
    
            {
              name: 'wednesday',
              type: 'checkbox',
              label: 'Wednesday',
              value: 'wednesday',
              handler: () => {
                this.dayFilters[2] = !this.dayFilters[2];
              },
              checked: this.dayFilters[2]
            },
    
            {
              name: 'thursday',
              type: 'checkbox',
              label: 'Thursday',
              value: 'thursday',
              handler: () => {
                this.dayFilters[3] = !this.dayFilters[3];
              },
              checked: this.dayFilters[3]
            },
    
            {
              name: 'friday',
              type: 'checkbox',
              label: 'Friday',
              value: 'thursday',
              handler: () => {
                this.dayFilters[4] = !this.dayFilters[4];
              },
              checked: this.dayFilters[4]
            },
    
            {
              name: 'saturday',
              type: 'checkbox',
              label: 'Saturday',
              value: 'saturday',
              handler: (blah) => {
                this.dayFilters[5] = !this.dayFilters[5];
              },
              checked: this.dayFilters[5]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i = 0; i < this.dayFilters.length; i++){
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
                this.packageFilters[0] = !this.packageFilters[0];
              },
              checked: this.packageFilters[0]
            },
    
            {
              name: 'flat',
              type: 'checkbox',
              label: 'Flat',
              value: 'flat',
              handler: () => {
                this.packageFilters[1] = !this.packageFilters[1];
              },
              checked: this.packageFilters[1]
            },
    
            {
              name: 'shelf',
              type: 'checkbox',
              label: 'Shelf',
              value: 'shelf',
              handler: () => {
                this.packageFilters[2] = !this.packageFilters[2];
              },
              checked: this.packageFilters[2]
            },
    
            {
              name: 'tube',
              type: 'checkbox',
              label: 'Tube',
              value: 'tube',
              handler: () => {
                this.packageFilters[3] = !this.packageFilters[3];
              },
              checked: this.packageFilters[3]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i = 0; i < this.packageFilters.length; i++){
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
                this.courierFilters[0] = !this.courierFilters[0];
              },
              checked: this.courierFilters[0]
            },
    
            {
              name: 'ups',
              type: 'checkbox',
              label: 'UPS',
              value: 'ups',
              handler: () => {
                this.courierFilters[1] = !this.courierFilters[1];
              },
              checked: this.courierFilters[1]
            },
    
            {
              name: 'other',
              type: 'checkbox',
              label: 'Other',
              value: 'other',
              handler: () => {
                this.courierFilters[2] = !this.courierFilters[2];
              },
              checked: this.courierFilters[2]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i = 0; i < this.courierFilters.length; i++){
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
                this.courierFilters[0] = !this.courierFilters[0];
              },
              checked: this.courierFilters[0]
            },
    
            {
              name: 'faculty',
              type: 'checkbox',
              label: 'Faculty',
              value: 'faculty',
              handler: () => {
                this.courierFilters[1] = !this.courierFilters[1];
              },
              checked: this.courierFilters[1]
            },
    
            {
              name: 'box-range',
              type: 'checkbox',
              label: 'Box Range',
              value: 'box-range',
              handler: () => {
                this.courierFilters[2] = !this.courierFilters[2];
              },
              checked: this.courierFilters[2]
            }
          ],
          buttons: [
            {
              text: 'Select All',
              cssClass: 'filter-button',
              handler: (blah) => {
                for (let i = 0; i < this.courierFilters.length; i++){
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