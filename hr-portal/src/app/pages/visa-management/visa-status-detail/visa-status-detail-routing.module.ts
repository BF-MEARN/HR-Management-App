import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisaStatusDetailComponent } from './visa-status-detail.component';

const routes: Routes = [{ path: '', component: VisaStatusDetailComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class VisaStatusDetailRoutingModule { }
