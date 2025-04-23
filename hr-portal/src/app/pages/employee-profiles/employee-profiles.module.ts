import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';

import { EmployeeProfilesRoutingModule } from './employee-profiles-routing.module';
import { EmployeeProfilesComponent } from './employee-profiles.component';

@NgModule({
  declarations: [EmployeeProfilesComponent],
  imports: [
    CommonModule,
    EmployeeProfilesRoutingModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatTableModule,
    MatProgressSpinnerModule,
    MatButtonModule,
    MatTooltipModule,
  ],
})
export class EmployeeProfilesModule {}