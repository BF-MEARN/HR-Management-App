import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApplicationReviewRoutingModule } from './application-review-routing.module';
import { ApplicationReviewComponent } from './application-review.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialogModule } from '@angular/material/dialog';
import { ProfileSectionModule } from 'src/app/components/profile-section/profile-section.module';
import { MatButtonModule } from '@angular/material/button';

@NgModule({
  declarations: [
    ApplicationReviewComponent,
    ConfirmationDialogComponent
  ],
  imports: [
    CommonModule,
    ApplicationReviewRoutingModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    MatDialogModule,
    MatButtonModule,
    ProfileSectionModule
  ],
})
export class ApplicationReviewModule {}