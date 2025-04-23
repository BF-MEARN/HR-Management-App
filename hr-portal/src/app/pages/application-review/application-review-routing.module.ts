import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ApplicationReviewComponent } from './application-review.component';

const routes: Routes = [{ path: '', component: ApplicationReviewComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ApplicationReviewRoutingModule { }
