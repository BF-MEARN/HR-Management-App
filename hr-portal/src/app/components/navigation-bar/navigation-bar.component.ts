import { Component, OnInit } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs';
import { Store } from '@ngrx/store';
import { AuthService } from 'src/app/services/auth.service';
import { AuthActions } from 'src/app/store/auth/auth.actions';
@Component({
  selector: 'app-navigation-bar',
  templateUrl: './navigation-bar.component.html',
  styleUrls: ['./navigation-bar.component.scss'],
})
export class NavigationBarComponent implements OnInit {
  menuItems = [
    { path: '/home', label: 'Home', icon: 'home' },
    { path: '/employee-profiles', label: 'Employee Profiles', icon: 'people' },
    { path: '/visa', label: 'Visa Status Management', icon: 'article' },
    {
      label: 'Hiring Management',
      path: ['/hiring'],
      queryParams: { subTab: 'pending' },
      icon: 'work'
    },
    { path: '/housing', label: 'Housing Management', icon: 'house' },
  ];

  activeLink: string = '';

  constructor(
    private router: Router,
    private authService: AuthService,
    private store: Store
  ) {}

  ngOnInit(): void {
    this.activeLink = this.router.url;

    // Listen to route changes
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event) => {
        this.activeLink = (event as NavigationEnd).urlAfterRedirects;
      });
  }

  logout(): void {
    this.authService.logout().subscribe(() => {
      localStorage.clear();
      sessionStorage.clear();
      this.store.dispatch(AuthActions.logout());
      this.router.navigate(['/login']);
    });
  }
}
