import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HousingManagementRoutingModule } from './housing-management-routing.module';
import { HousingManagementComponent } from './housing-management.component';


@NgModule({
  declarations: [
    HousingManagementComponent
  ],
  imports: [
    CommonModule,
    HousingManagementRoutingModule
  ]
})
export class HousingManagementModule { }
