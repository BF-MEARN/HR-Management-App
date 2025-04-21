import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InviteFormModalComponent } from './components/invite-form-modal/invite-form-modal.component';

@Component({
  selector: 'app-hiring-management',
  templateUrl: './hiring-management.component.html',
  styleUrls: ['./hiring-management.component.scss'],
})
export class HiringManagementComponent {
  constructor(private dialog: MatDialog) {}

  openDialog() {
    this.dialog.open(InviteFormModalComponent, {
      width: '450px',
      disableClose: true,
    });
  }
}
