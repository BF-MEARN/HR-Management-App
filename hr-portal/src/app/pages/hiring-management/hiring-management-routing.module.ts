import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HiringManagementComponent } from './hiring-management.component';

const routes: Routes = [{ path: '', component: HiringManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HiringManagementRoutingModule {}
