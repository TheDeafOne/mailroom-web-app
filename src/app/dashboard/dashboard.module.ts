import { IonicModule } from '@ionic/angular';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { dashboard } from './dashboard.page';
import { ExploreContainerComponentModule } from '../explore-container/explore-container.module';

import { dashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    ExploreContainerComponentModule,
    dashboardRoutingModule
  ],
  declarations: [dashboard]
})
export class dashboardModule {}
