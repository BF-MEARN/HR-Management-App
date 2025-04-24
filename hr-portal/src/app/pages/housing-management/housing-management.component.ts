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
import { Observable, BehaviorSubject, combineLatest } from 'rxjs';
import { map } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-housing-management',
  templateUrl: './housing-management.component.html',
  styleUrls: ['./housing-management.component.scss']
})
export class HousingManagementComponent implements OnInit {
  houses$ = this.store.select(selectAllHouses);
  searchQuery: string = '';
  searchSubject = new BehaviorSubject<string>('');
  filteredHouses$: Observable<Housing[]>;
  
  // Track newly added houses to highlight them
  newlyAddedHouseId: string | null = null;

  constructor(
    private store: Store,
    private housingService: HousingManagementService,
    private dialog: MatDialog,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    // Setup filtered houses observable
    this.filteredHouses$ = combineLatest([
      this.houses$,
      this.searchSubject
    ]).pipe(
      map(([houses, searchTerm]) => {
        if (!searchTerm.trim()) {
          return houses;
        }
        const searchLower = searchTerm.toLowerCase();
        return houses.filter(house => 
          house.address.street.toLowerCase().includes(searchLower) ||
          house.address.city.toLowerCase().includes(searchLower) ||
          house.address.state.toLowerCase().includes(searchLower) ||
          house.address.zip.toLowerCase().includes(searchLower) ||
          house.landlord.fullName.toLowerCase().includes(searchLower)
        );
      })
    );
  }

  ngOnInit(): void {
    this.store.dispatch(loadHouses());
  }

  filterHouses(): void {
    this.searchSubject.next(this.searchQuery);
  }

  openAddHouseDialog(): void {
    const dialogRef = this.dialog.open(AddHouseDialogComponent, {
      width: '600px',
      disableClose: true
    });
    
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        // Store the newly added house ID to highlight it
        this.newlyAddedHouseId = result.houseId;
        
        // Refresh houses list
        this.store.dispatch(loadHouses());
        
        // Show success message
        this.snackBar.open('House added successfully!', 'Close', {
          duration: 3000,
          panelClass: ['success-snackbar']
        });
        
        // Clear the highlight after 3 seconds
        setTimeout(() => {
          this.newlyAddedHouseId = null;
        }, 3000);
      }
    });
  }

  openDetailsDialog(house: Housing): void {
    this.router.navigate(['/housing', house._id]);
  }

  deleteHouse(houseId: string): void {
    const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
      width: '400px',
      data: {
        title: 'Delete House',
        message: 'Are you sure you want to delete this house? This action cannot be undone.',
        cancelText: 'Cancel',
        confirmText: 'Delete'
      }
    });

    dialogRef.afterClosed().subscribe((confirmed: boolean) => {
      if (confirmed) {
        this.housingService.deleteHouse(houseId).subscribe({
          next: () => {
            this.store.dispatch(loadHouses());
            this.snackBar.open('House deleted successfully', 'Close', {
              duration: 3000,
              panelClass: ['success-snackbar']
            });
          },
          error: (err) => {
            console.error('Error deleting house:', err);
            this.snackBar.open('Failed to delete house. Please try again.', 'Close', {
              duration: 5000,
              panelClass: ['error-snackbar']
            });
          }
        });
      }
    });
  }
  
  // Check if a house was just added to apply highlight animation
  isNewlyAdded(houseId: string): boolean {
    return this.newlyAddedHouseId === houseId;
  }
}