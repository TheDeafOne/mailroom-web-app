import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { BackPagePageRoutingModule } from './back-page-routing.module';

import { BackPagePage } from './back-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    BackPagePageRoutingModule
  ],
  declarations: [BackPagePage]
})
export class BackPagePageModule {}
