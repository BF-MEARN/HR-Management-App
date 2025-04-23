import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisaManagementComponent } from './visa-management.component';

const routes: Routes = [{ path: '', component: VisaManagementComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisaManagementRoutingModule { }
