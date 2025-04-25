import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';

import { VisaAllComponent } from './components/visa-all/visa-all.component';
import { VisaInProgressComponent } from './components/visa-in-progress/visa-in-progress.component';
import { VisaManagementRoutingModule } from './visa-management-routing.module';
import { VisaManagementComponent } from './visa-management.component';
import { FormsModule } from '@angular/forms';
import { RejectDialogComponent } from './components/reject-dialog/reject-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';


@NgModule({
  declarations: [
    VisaManagementComponent,
    VisaInProgressComponent,
    VisaAllComponent,
    RejectDialogComponent,
  ],
  imports: [
    CommonModule,
    VisaManagementRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatTableModule,
    MatCardModule,
    MatTabsModule,
    MatIconModule,
    MatProgressSpinnerModule,
  ]
})
export class VisaManagementModule { }
