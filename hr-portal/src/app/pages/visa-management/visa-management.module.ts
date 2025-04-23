import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { VisaManagementRoutingModule } from './visa-management-routing.module';
import { VisaManagementComponent } from './visa-management.component';


@NgModule({
  declarations: [
    VisaManagementComponent
  ],
  imports: [
    CommonModule,
    VisaManagementRoutingModule
  ]
})
export class VisaManagementModule { }
