import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BackPagePage } from './back-page.page';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'test-page',
    pathMatch: 'full'
  },
  {
    path: '',
    component: BackPagePage,
    children: [
      {
        path: 'test-page',
        loadChildren: () => import('../test-page/test-page.module').then(m => m.TestPagePageModule)
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../dashboard/dashboard.module').then(m => m.dashboardModule)
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackPagePageRoutingModule {}
