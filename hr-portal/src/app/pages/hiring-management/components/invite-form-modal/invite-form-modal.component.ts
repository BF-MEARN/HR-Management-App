import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invite-form-modal',
  templateUrl: './invite-form-modal.component.html',
  styleUrls: ['./invite-form-modal.component.scss'],
})
export class InviteFormModalComponent implements OnInit {
  inviteForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<InviteFormModalComponent>,
    private snackbar: MatSnackBar,
    private http: HttpClient
  ) {}

  ngOnInit(): void {
    this.inviteForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
    });
  }

  onSubmit(): void {
    if (this.inviteForm.valid) {
      const payload = this.inviteForm.value;

      this.http
        .post(`${environment.apiUrl}/invite/generate`, payload)
        .subscribe({
          next: () => {
            this.snackbar.open('Invitation sent!', 'Close', { duration: 3000 });
            this.dialogRef.close();
          },
          error: (err) => {
            console.error(err);
            this.snackbar.open('Failed to send invite. Try again.', 'Close', {
              duration: 3000,
            });
          },
        });
    }
  }
}
