import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, of, switchMap, take, map, catchError } from 'rxjs';
import { selectUser } from '../store/auth/auth.selectors';
import { AuthService } from '../services/auth.service';
import { setUser } from '../store/auth/auth.actions';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(
    private store: Store,
    private router: Router,
    private authService: AuthService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.select(selectUser).pipe(
      take(1),
      switchMap((user) => {
        if (user) {
          return of(true);
        }

        // Fallback: try retrieving from backend
        return this.authService.getCurrentUser().pipe(
          map((res) => {
            const user = res.user;
        
            if (user && user.role === 'hr') {
              this.store.dispatch(setUser({ user })); 
              return true;
            }
        
            return this.router.createUrlTree(['/login']);
          }),
          catchError((err) => {
            console.error('[AuthGuard] Failed to fetch user from /me:', err);
            return of(this.router.createUrlTree(['/login']));
          })
        );
      })
    );
  }
}
