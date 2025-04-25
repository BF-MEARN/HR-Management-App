import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ViewProfileRoutingModule } from './view-profile-routing.module';
import { ViewProfileComponent } from './view-profile.component';

import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ProfileSectionModule } from 'src/app/components/profile-section/profile-section.module';
import { S3DocumentService } from 'src/app/services/s3-document.service';

@NgModule({
  declarations: [ViewProfileComponent],
  imports: [
    CommonModule,
    ViewProfileRoutingModule,
    MatProgressSpinnerModule,
    MatIconModule,
    MatSnackBarModule,
    ProfileSectionModule
  ],
  providers: [
    S3DocumentService
  ]
})
export class ViewProfileModule { }