import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AuthActions } from 'src/app/store/auth/auth.actions';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  loginForm: FormGroup;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private store: Store,
  ) {
    this.loginForm = this.fb.group({
      username: ['', [Validators.required]],
      password: ['', [Validators.required]],
      rememberMe: [false],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;

      this.authService.login({ username, password }).subscribe({
        next: (response) => {
          const user = response.user;

          if (user.role !=='hr') {
            alert('You are not authorized to access this portal.');
            return;
          }

          localStorage.setItem('user', JSON.stringify(response.user));
          this.store.dispatch(AuthActions.loginSuccess({ user }));
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Login failed', error);
          alert('Invalid username or password. Please try again.');
        },
      });
    }
  }
}
