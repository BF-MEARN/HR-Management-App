import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HousingManagementService } from 'src/app/services/housing-management.service';

@Component({
  selector: 'app-add-house-dialog',
  templateUrl: './add-house-dialog.component.html',
  styleUrls: ['./add-house-dialog.component.scss'],
})
export class AddHouseDialogComponent {
  houseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AddHouseDialogComponent>,
    private housingService: HousingManagementService,
    private snackBar: MatSnackBar
  ) {
    this.houseForm = this.fb.group({
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zip: ['', Validators.required],
      fullName: [''],
      phone: [''],
      email: [''],
      beds: [0],
      mattresses: [0],
      tables: [0],
      chairs: [0],
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    const form = this.houseForm.value;

    const payload = {
      address: {
        street: form.street,
        city: form.city,
        state: form.state,
        zip: form.zip,
      },
      landlord: {
        fullName: form.fullName,
        phone: form.phone,
        email: form.email,
      },
      facility: {
        beds: form.beds,
        mattresses: form.mattresses,
        tables: form.tables,
        chairs: form.chairs,
      },
    };

    this.housingService.createHouse(payload).subscribe({
      next: () => {
        this.snackBar.open('House added successfully!', 'Close', { duration: 3000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error(err);
        this.snackBar.open('Failed to add house. Try again.', 'Dismiss', { duration: 3000 });
      }
    });
    
  }
}
