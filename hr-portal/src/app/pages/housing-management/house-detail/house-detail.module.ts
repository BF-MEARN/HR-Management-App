import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { HouseDetailRoutingModule } from './house-detail-routing.module';
import { HouseDetailComponent } from './house-detail.component';


@NgModule({
  declarations: [
    HouseDetailComponent
  ],
  imports: [
    CommonModule,
    HouseDetailRoutingModule
  ]
})
export class HouseDetailModule { }
