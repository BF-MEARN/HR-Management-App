import { Injectable } from '@angular/core';
import {
  CanActivate,
  Router,
  UrlTree,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, filter, map, take } from 'rxjs';
import { selectUser } from '../store/auth/auth.selectors';

@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  constructor(private store: Store, private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.store.select(selectUser).pipe(
      filter((user) => user !== undefined), // wait for state to be initialized
      take(1),
      map((user) => {
        if (!user || user.role !== 'hr') {
          console.warn('[Guard] Access denied, redirecting to /login');
          return this.router.createUrlTree(['/login']);
        }
        return true;
      })
    );
  }
}
