import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';


import { HiringManagementRoutingModule } from './hiring-management-routing.module';
import { HiringManagementComponent } from './hiring-management.component';
import { InviteFormModalComponent } from './components/invite-form-modal/invite-form-modal.component';
import { TokenHistoryComponent } from './components/token-history/token-history.component';

@NgModule({
  declarations: [HiringManagementComponent, InviteFormModalComponent, TokenHistoryComponent],
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
    MatTableModule,
    
  ],
})
export class HiringManagementModule {}
