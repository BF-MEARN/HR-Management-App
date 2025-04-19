import { Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { AuthService } from 'src/app/services/auth.service';
import { AuthActions } from './auth.actions';
import { catchError, map, mergeMap, of, tap } from 'rxjs';
import { Router } from '@angular/router';

@Injectable()
export class AuthEffects {
  constructor(
    private actions$: Actions,
    private authService: AuthService,
    private router: Router
  ) {}

  login$ = createEffect(() =>
    this.actions$.pipe(
      ofType(AuthActions.login),
      mergeMap(({ username, password }) =>
        this.authService.login({ username, password }).pipe(
          map((response) => {
            console.log('[Effect] Login success, user:', response.user);
            if (response.user.role !== 'hr') {
              throw new Error('Unauthorized: not an HR user');
            }

            localStorage.setItem('user', JSON.stringify(response.user));
            return AuthActions.loginSuccess({ user: response.user });
          }),
          catchError((err) =>
            of(
              AuthActions.loginFailure({ error: err.message || 'Login failed' })
            )
          )
        )
      )
    )
  );

  redirectAfterLogin$ = createEffect(
    () =>
      this.actions$.pipe(
        ofType(AuthActions.loginSuccess),
        tap(() => {
          console.log('[Effect] Navigating to /home');
          this.router.navigate(['/home']);
        })
      ),
    { dispatch: false }
  );
}
