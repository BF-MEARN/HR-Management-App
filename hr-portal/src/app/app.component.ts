import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { AuthActions, setUser } from './store/auth/auth.actions';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  title = 'hr-portal';
  showNavbar = true;

  constructor(private store: Store, private router: Router) {}

  ngOnInit(): void {
    const storedUser = localStorage.getItem('hrUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // this.store.dispatch(AuthActions.loginSuccess({ user }));
      this.store.dispatch(setUser({ user }));
    }

    // Logic to show/hide navbar
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.showNavbar = !event.url.includes('/login');
        }
      });
  }
}
