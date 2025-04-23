import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HousingManagementComponent } from './housing-management.component';

const routes: Routes = [{ path: '', component: HousingManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HousingManagementRoutingModule { }
