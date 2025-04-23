import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { EmployeeProfilesComponent } from './employee-profiles.component';

const routes: Routes = [{ path: '', component: EmployeeProfilesComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class EmployeeProfilesRoutingModule { }
