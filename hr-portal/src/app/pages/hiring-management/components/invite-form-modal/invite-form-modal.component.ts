import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Store } from '@ngrx/store';
import { TokenService } from 'src/app/services/token.service';
import { addNewToken } from 'src/app/store/token/token.actions';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-invite-form-modal',
  templateUrl: './invite-form-modal.component.html',
  styleUrls: ['./invite-form-modal.component.scss'],
})
export class InviteFormModalComponent implements OnInit {
  inviteForm!: FormGroup;

  constructor(
    private store: Store,
    private fb: FormBuilder,
    private tokenService: TokenService,
    private dialogRef: MatDialogRef<InviteFormModalComponent>,
    private snackbar: MatSnackBar,
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
  
      this.tokenService.sendInvite(payload).subscribe({
        next: (res) => {
          this.store.dispatch(addNewToken({ token: res.token }));
          this.snackbar.open('Invite sent successfully', 'Close', { duration: 3000 });
          this.dialogRef.close();
        },
        error: (err) => {
          console.error('Failed to send invite', err);
          this.snackbar.open('Failed to send invite', 'Close', { duration: 3000 });
        },
      });
      
    }
  }
}
