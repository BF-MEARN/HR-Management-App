import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HouseDetailComponent } from './house-detail.component';

const routes: Routes = [{ path: '', component: HouseDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class HouseDetailRoutingModule { }
