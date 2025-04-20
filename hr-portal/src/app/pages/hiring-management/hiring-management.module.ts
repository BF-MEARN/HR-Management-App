import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { HiringManagementRoutingModule } from './hiring-management-routing.module';
import { HiringManagementComponent } from './hiring-management.component';
import { InviteFormModalComponent } from './components/invite-form-modal/invite-form-modal.component';

@NgModule({
  declarations: [HiringManagementComponent, InviteFormModalComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    HttpClientModule,
    HiringManagementRoutingModule,

    // Angular Material modules used in dialog
    MatFormFieldModule,
    MatInputModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
  ],
})
export class HiringManagementModule {}
