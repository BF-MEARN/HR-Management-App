import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Housing } from 'src/app/interfaces/housing';
import { AddHouseDialogComponent } from './components/add-house-dialog/add-house-dialog.component';
import { ConfirmationDialogComponent } from 'src/app/components/confirmation-dialog/confirmation-dialog.component';
import { Store } from '@ngrx/store';
import { loadHouses } from 'src/app/store/housing/housing.actions';
import { selectAllHouses } from 'src/app/store/housing/housing.selectors';
import { HousingManagementService } from 'src/app/services/housing-management.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-housing-management',
  templateUrl: './housing-management.component.html',
  styleUrls: ['./housing-management.component.scss']
})
export class HousingManagementComponent implements OnInit {
  houses$ = this.store.select(selectAllHouses);

  constructor(
    private store: Store,
    private housingService: HousingManagementService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.store.dispatch(loadHouses());
  }

  openAddHouseDialog(): void {
    const dialogRef = this.dialog.open(AddHouseDialogComponent);
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.store.dispatch(loadHouses());
      }
    });
  }

  openDetailsDialog(house: Housing): void {
    this.router.navigate(['/housing', house._id]);
  }

  deleteHouse(houseId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      data: {
        title: 'Delete House',
        message: 'Are you sure you want to delete this house?',
        cancelText: 'Cancel',
        confirmText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.housingService.deleteHouse(houseId).subscribe({
          next: () => this.store.dispatch(loadHouses()),
          error: () => alert('Failed to delete house. Try again.')
        });
      }
    });
  }
}
